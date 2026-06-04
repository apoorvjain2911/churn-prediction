from __future__ import annotations

HIGH_RISK_RECOMMENDATION = "Offer discount and immediate support. Upgrade loyalty benefits."
MEDIUM_RISK_RECOMMENDATION = "Send promotional email and offer an annual contract."
LOW_RISK_RECOMMENDATION = "Maintain engagement with regular updates and check-ins."


def get_risk_level(probability: float) -> str:
    if probability >= 0.8:
        return "High"
    if probability >= 0.5:
        return "Medium"
    return "Low"


def get_recommendation(risk: str) -> str:
    if risk == "High":
        return HIGH_RISK_RECOMMENDATION
    if risk == "Medium":
        return MEDIUM_RISK_RECOMMENDATION
    return LOW_RISK_RECOMMENDATION
