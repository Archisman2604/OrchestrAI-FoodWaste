class Orchestrator:
    def __init__(
        self,
        prediction,
        analytics,
        recommendation,
        simulation,
        ai_insight
    ):
        self.prediction = prediction
        self.analytics = analytics
        self.recommendation = recommendation
        self.simulation = simulation
        self.ai_insight = ai_insight

    def process(self, request_type, payload):

        if request_type == "predict":
            return self.prediction.predict(payload)

        elif request_type == "analytics":
            return self.analytics.analyze(payload)

        elif request_type == "recommend":
            return self.recommendation.recommend(payload)

        elif request_type == "simulate":
            return self.simulation.simulate(payload)

        elif request_type == "insight":
            return self.ai_insight.generate(payload)

        elif request_type == "full_report":

            analytics = self.analytics.analyze(payload)

            prediction = self.prediction.predict({
                "prepared": analytics["prepared"],
                "past_waste_percent": analytics["waste_percent"]
            })

            recommendation = self.recommendation.recommend({
                "waste_percent": analytics["waste_percent"]
            })

            insight = self.ai_insight.generate({
                "prepared": analytics["prepared"],
                "wasted": analytics["wasted"],
                "waste_percent": analytics["waste_percent"]
            })

            return {
                "analytics": analytics,
                "prediction": prediction,
                "recommendation": recommendation,
                "insight": insight
            }

        return {
            "error": "Invalid request type",
            "valid_types": [
                "predict",
                "analytics",
                "recommend",
                "simulate",
                "insight",
                "full_report"
            ]
        }