from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="MMA Predictor")


class BoutFeatures(BaseModel):
    fighter_a: str
    fighter_b: str
    age_a: int | None = None
    age_b: int | None = None
    reach_a: int | None = None
    reach_b: int | None = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(features: BoutFeatures):
    # Dummy logic: 0.5/0.5 base, nudge by reach and age if both present
    pa = 0.5
    pb = 0.5
    if features.reach_a is not None and features.reach_b is not None:
        diff = features.reach_a - features.reach_b
        pa += 0.01 * max(min(diff, 10), -10)
    if features.age_a is not None and features.age_b is not None:
        if features.age_a < features.age_b:
            pa += 0.02
        elif features.age_a > features.age_b:
            pb += 0.02
    # normalize
    s = pa + pb
    pa /= s
    pb /= s
    return {
        "fighter_a": features.fighter_a,
        "fighter_b": features.fighter_b,
        "prob_a": round(pa, 3),
        "prob_b": round(pb, 3),
        "model": "dummy-v0"
    }
