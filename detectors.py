import re

# ---------- Injection Behaviour Detection ----------
def detect_injection_patterns(prompt):
    prompt_lower = prompt.lower()
    reasons = []

    if re.search(r"act as|pretend to be|you are now", prompt_lower):
        reasons.append("Role-play attempt to change AI behavior")

    if re.search(r"ignore .* instructions|bypass .* rules", prompt_lower):
        reasons.append("Instruction override attempt")

    if re.search(r"reveal|show|leak|display .* (policy|system|hidden|password)", prompt_lower):
        reasons.append("Sensitive information extraction attempt")

    if re.search(r"jailbreak|developer mode|dan mode", prompt_lower):
        reasons.append("Known jailbreak attack pattern")

    if "step by step" in prompt_lower and "ignore" in prompt_lower:
        reasons.append("Multi-step manipulation attempt")

    return reasons


# ---------- Obfuscation Detection ----------
def detect_obfuscation(prompt):
    reasons = []

    # base64
    if re.search(r"[A-Za-z0-9+/]{20,}={0,2}", prompt):
        reasons.append("Possible encoded payload (Base64)")

    # hex
    if re.search(r"0x[0-9a-fA-F]+", prompt):
        reasons.append("Hex encoded instructions")

    # character splitting
    spaced = " ".join(list("ignore"))
    if spaced in prompt.lower():
        reasons.append("Character obfuscation detected")

    return reasons
