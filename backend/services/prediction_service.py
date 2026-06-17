class PredictionService:

    def predict(self, data):
        prepared = data.get("prepared", 0)
        waste_percent = data.get("past_waste_percent", 0)

        predicted_waste = round(
            prepared * waste_percent / 100
        )

        if waste_percent < 10:
            risk = "low"
        elif waste_percent < 20:
            risk = "medium"
        else:
            risk = "high"

        return {
            "predicted_waste": predicted_waste,
            "risk": risk
        }