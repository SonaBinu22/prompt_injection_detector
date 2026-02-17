from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

from preprocess import clean_text
from rules import rule_check
from detectors import detect_injection_patterns, detect_obfuscation

app = FastAPI(title="Prompt Injection Detector")

# CORS (allow website to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load ML model
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


def generate_explanation(classification, reasons):
    if classification == "Malicious":
        return "The prompt shows clear signs of prompt injection: " + ", ".join(reasons)
    if classification == "Suspicious":
        return "The prompt contains potentially unsafe patterns: " + ", ".join(reasons)
    return "No injection patterns detected. Prompt appears safe."


@app.post("/analyze")
def analyze_prompt(data: PromptRequest):

    if not data.prompt.strip():
        return {"error": "Prompt cannot be empty"}

    # ---------- Layer 1: direct rules ----------
    rule_label, rule_reason = rule_check(data.prompt)
    if rule_label:
        return {
            "classification": rule_label,
            "explanation": rule_reason,
            "source": "Rule-Based Protection"
        }

    # ---------- Layer 2: behavioral detection ----------
    reasons = []
    reasons += detect_injection_patterns(data.prompt)
    reasons += detect_obfuscation(data.prompt)

    if len(reasons) >= 2:
        return {
            "classification": "Malicious",
            "explanation": generate_explanation("Malicious", reasons),
            "source": "Security Pattern Analyzer"
        }

    if len(reasons) == 1:
        return {
            "classification": "Suspicious",
            "explanation": generate_explanation("Suspicious", reasons),
            "source": "Security Pattern Analyzer"
        }

    # ---------- Layer 3: ML model ----------
    cleaned = clean_text(data.prompt)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]

    classification = label_to_text(prediction)

    return {
        "classification": classification,
        "explanation": generate_explanation(classification, []),
        "source": "Machine Learning Model"
    }
