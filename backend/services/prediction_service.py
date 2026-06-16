class PredictionService:
    def predict(self, data):
        prepared = data.get("prepared", 0)
        waste_percent = data.get("waste_percent", 0)

        wasted = (prepared * waste_percent) / 100

        return {
            "prepared": prepared,
            "waste_percent": waste_percent,
            "wasted": round(wasted, 2)
        }