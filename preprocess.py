import re

def normalize_text(text: str) -> str:
    text = text.lower()

    # remove repeated spaces
    text = re.sub(r"\s+", " ", text)

    # join spaced letters: r e v e a l -> reveal
    text = re.sub(r'(?:\b\w\b\s*){3,}', lambda m: m.group(0).replace(" ", ""), text)

    # remove symbols between letters: re-ve-al -> reveal
    text = re.sub(r'(?<=\w)[^\w\s]+(?=\w)', '', text)

    # replace leetspeak
    replacements = {
        "0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","@":"a","$":"s"
    }
    for k,v in replacements.items():
        text = text.replace(k,v)

    return text
