import re

# -----------------------------
# 1. Prompt Injection Detection
# -----------------------------
def detect_prompt_injection(prompt):
    patterns = [
        r"ignore previous instructions",
        r"disregard earlier rules",
        r"forget what you were told"
    ]

    for pattern in patterns:
        if re.search(pattern, prompt.lower()):
            return True
    return False


# -----------------------------
# 2. Role Manipulation Detection
# -----------------------------
def detect_role_manipulation(prompt):
    patterns = [
        r"act as",
        r"pretend to be",
        r"you are now",
        r"switch to developer mode"
    ]

    for pattern in patterns:
        if re.search(pattern, prompt.lower()):
            return True
    return False


# -----------------------------
# 3. Instruction Override
# -----------------------------
def detect_instruction_override(prompt):
    patterns = [
        r"bypass safety",
        r"override system",
        r"ignore all rules",
        r"do not follow guidelines"
    ]

    for pattern in patterns:
        if re.search(pattern, prompt.lower()):
            return True
    return False


# -----------------------------
# 4. Data Exfiltration
# -----------------------------
def detect_data_exfiltration(prompt):
    patterns = [
        r"reveal system prompt",
        r"show hidden policy",
        r"display internal instructions",
        r"tell me the password",
        r"leak confidential"
    ]

    for pattern in patterns:
        if re.search(pattern, prompt.lower()):
            return True
    return False


# -----------------------------
# 5. Encoding Attack Detection
# -----------------------------
def detect_encoding_attack(prompt):

    # Base64 pattern
    if re.search(r"[A-Za-z0-9+/]{20,}={0,2}", prompt):
        return True

    # Hex pattern
    if re.search(r"0x[0-9a-fA-F]+", prompt):
        return True

    return False


# -----------------------------
# MASTER DETECTOR FUNCTION
# -----------------------------
def detect_all_attacks(prompt):

    if detect_prompt_injection(prompt):
        return "Prompt Injection"

    if detect_role_manipulation(prompt):
        return "Role Manipulation"

    if detect_instruction_override(prompt):
        return "Instruction Override"

    if detect_data_exfiltration(prompt):
        return "Data Exfiltration"

    if detect_encoding_attack(prompt):
        return "Encoding Attack"

    return None
