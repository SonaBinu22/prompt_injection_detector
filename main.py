from fastapi import FastAPI
from pydantic import BaseModel
from detector import detect_prompt_injection

app = FastAPI(title="Prompt Injection Detection API")

class Request(BaseModel):
    message: str

@app.post("/analyze")
def analyze(req: Request):
    return detect_prompt_injection(req.message)
