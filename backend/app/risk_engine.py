import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from pydantic import BaseModel
from typing import List, Optional, Literal
import json

class HealthInput(BaseModel):
    mother_id: str
    age: int
    week: int
    bp_sys: int
    bp_dia: int
    swelling: bool
    headache_severity: Literal["none", "mild", "moderate", "severe"]
    fever: bool
    diabetes_history: bool
    fetal_movement: Literal["normal", "reduced"]
    bleeding: bool = False

class RiskResult(BaseModel):
    risk_level: str
    risk_score: float
    explanation: str
    advice_bn: Optional[str] = None
    emergency_flag: bool

class MayerHybridEngine:
    def __init__(self):
        # Simulated ML logic for MVP - Structure ready for joblib.load()
        self.rf_model = None 
        self.dt_model = None

    def check_danger_rules(self, data: HealthInput) -> Optional[dict]:
        """Non-AI Danger Rule Override (Safety First)"""
        if data.bleeding:
            return {"level": "High", "reason": "Vaginal bleeding detected. Emergency."}
        if data.bp_sys >= 160 or data.bp_dia >= 110:
            return {"level": "High", "reason": "Severe Hypertension (Critical BP level)."}
        if data.fetal_movement == "reduced" and data.week >= 28:
            return {"level": "High", "reason": "Reduced fetal movement in 3rd trimester."}
        return None

    def predict_ml(self, data: HealthInput) -> dict:
        """Lightweight ML Classification Logic"""
        score = 0
        if data.bp_sys > 140 or data.bp_dia > 90: score += 40
        if data.swelling: score += 15
        if data.headache_severity in ["moderate", "severe"]: score += 20
        if data.diabetes_history: score += 15
        
        level = "Low"
        if score > 70: level = "High"
        elif score > 30: level = "Medium"
        
        return {"level": level, "score": score}

    async def analyze(self, data: HealthInput, rag_engine) -> RiskResult:
        # 1. Rule Check
        rule_hit = self.check_danger_rules(data)
        
        # 2. ML Prediction
        ml_res = self.predict_ml(data)
        
        # 3. Final Level Selection
        final_level = rule_hit["level"] if rule_hit else ml_res["level"]
        
        # 4. AI Explanation (Using Prompts)
        ai_response = await rag_engine.generate_risk_explanation(final_level, data)
        
        return RiskResult(
            risk_level=final_level,
            risk_score=ml_res["score"],
            explanation=ai_response["explanation"],
            advice_bn=ai_response.get("advice_bn"),
            emergency_flag=(final_level == "High")
        )

engine = MayerHybridEngine()
