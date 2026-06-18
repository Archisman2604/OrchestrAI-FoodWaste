class PredictionService:

    def predict(self, data):
        prepared = data.get("prepared", 0)
        waste_percent = data.get("past_waste_percent", 0)

        # Assume waste grows slightly if not addressed
        future_waste_percent = waste_percent * 1.15

        predicted_waste = round(
            prepared * future_waste_percent / 100
        )

        if future_waste_percent < 10:
            risk = "low"
        elif future_waste_percent < 20:
            risk = "medium"
        else:
            risk = "high"

        confidence = max(
            60,
            round(95 - abs(20 - waste_percent))
        )

        trend = (
            "increasing"
            if future_waste_percent > waste_percent
            else "stable"
        )

        return {
            "predicted_waste": predicted_waste,
            "future_waste_percent": round(future_waste_percent, 1),
            "risk": risk,
            "confidence": confidence,
            "trend": trend
        }