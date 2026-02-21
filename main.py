from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

from preprocess import clean_text
from detectors import detect_all_attacks

app = FastAPI(title="Prompt Injection Detector")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))


class PromptRequest(BaseModel):
    prompt: str


def label_to_text(label):
    return {
        0: "Non-Malicious",
        1: "Suspicious",
        2: "Malicious"
    }[label]


# -----------------------------
# Explanation Generator
# -----------------------------
def generate_security_explanation(attack_type):

    explanations = {
        "Prompt Injection":
            "The prompt attempts to override previously defined instructions. "
            "This is a known prompt injection technique used to manipulate AI behavior.",

        "Role Manipulation":
            "The prompt tries to change the system's assigned role. "
            "This may allow bypassing normal security restrictions.",

        "Instruction Override":
            "The prompt explicitly attempts to bypass system-level safety rules. "
            "This indicates malicious intent.",

        "Data Exfiltration":
            "The prompt attempts to extract hidden or confidential system information. "
            "This is classified as a data exfiltration attack.",

        "Encoding Attack":
            "The prompt contains encoded or obfuscated content, "
            "which is often used to hide malicious instructions."
    }

    return explanations.get(
        attack_type,
        "The prompt contains suspicious patterns."
    )


def get_risk_level(attack_type):

    high_risk = ["Prompt Injection", "Data Exfiltration", "Instruction Override"]
    medium_risk = ["Role Manipulation", "Encoding Attack"]

    if attack_type in high_risk:
        return "High"

    if attack_type in medium_risk:
        return "Medium"

    return "Low"


@app.post("/analyze")
def analyze_prompt(data: PromptRequest):

    if not data.prompt.strip():
        return {"error": "Prompt cannot be empty"}

    # 1️⃣ RULE-BASED DETECTION
    attack_type = detect_all_attacks(data.prompt)

    if attack_type:
        return {
            "classification": "Malicious",
            "attack_type": attack_type,
            "risk_level": get_risk_level(attack_type),
            "confidence": "High",
            "explanation": generate_security_explanation(attack_type),
            "source": "Rule-Based Security Engine"
        }

    # 2️⃣ MACHINE LEARNING DETECTION
    cleaned = clean_text(data.prompt)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]

    classification = label_to_text(prediction)

    return {
        "classification": classification,
        "attack_type": "None",
        "risk_level": "Low",
        "confidence": "ML-Based",
        "explanation": "No explicit injection patterns detected. Classified using semantic machine learning analysis.",
        "source": "Machine Learning Model"
    }
