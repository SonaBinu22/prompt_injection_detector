import re
import pickle
import unicodedata
from datetime import datetime

# load ML model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

LOG_FILE = "attack_logs.txt"


# ---------------- NORMALIZATION ----------------
def normalize_text(text: str):
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)

    # collapse spaced letters: y o u -> you
    text = re.sub(r'(?<=\b[a-z])\s(?=[a-z]\b)', '', text)

    # remove separators
    text = re.sub(r'([a-z])[\._\-]([a-z])', r'\1\2', text)

    text = re.sub(r'\s+', ' ', text).strip()
    return text


def detect_obfuscation(original, normalized):
    if original == normalized:
        return False

    letters = re.findall(r'\b[a-zA-Z]\b', original)
    if len(letters) >= 6:
        return True

    if re.search(r'(?:[a-z][\s\.\-_]){5,}', original.lower()):
        return True

    return False


# ---------------- RULE PATTERNS ----------------
MALICIOUS_PATTERNS = [
    r"reveal system prompt",
    r"ignore previous instructions",
    r"developer mode",
    r"act as system",
    r"bypass safety",
    r"show hidden policy",
    r"print training data",
    r"exfiltrate"
]

SUSPICIOUS_PATTERNS = [
    r"dan mode",
    r"you are now",
    r"pretend to be",
    r"roleplay as",
    r"simulate jailbreak",
    r"jailbreak"
]


def rule_based_detection(text):
    for pattern in MALICIOUS_PATTERNS:
        if re.search(pattern, text):
            return "Malicious", pattern

    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, text):
            return "Suspicious", pattern

    return None, None


# ---------------- LOGGING ----------------
def log_attack(text, label, reason):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{datetime.now()} | {label} | {reason} | {text}\n")


# ---------------- MAIN DETECTOR ----------------
def detect_prompt_injection(text):

    original_text = text
    text = normalize_text(text)

    # 1. Obfuscation detection
    if detect_obfuscation(original_text, text):
        log_attack(original_text, "Suspicious", "Obfuscation attack")
        return {
            "label": "Suspicious",
            "confidence": 85.0,
            "reason": "Obfuscated prompt detected",
            "category": "obfuscation_attack"
        }

    # 2. Rule based detection
    label, pattern = rule_based_detection(text)
    if label:
        log_attack(original_text, label, f"Matched pattern: {pattern}")
        return {
            "label": label,
            "confidence": 95.0,
            "reason": f"Matched known attack pattern: '{pattern}'",
            "category": "prompt_injection"
        }

    # 3. ML classification
    X = vectorizer.transform([text])
    prediction = model.predict(X)[0]
    confidence = max(model.predict_proba(X)[0]) * 100

    if prediction != "Safe":
        log_attack(original_text, prediction, "ML semantic detection")

    reason = "Normal natural language query"
    if prediction == "Suspicious":
        reason = "Possible roleplay/jailbreak attempt detected"
    elif prediction == "Malicious":
        reason = "Malicious intent detected by ML classifier"

    return {
        "label": prediction,
        "confidence": round(confidence, 2),
        "reason": reason,
        "category": None
    }
