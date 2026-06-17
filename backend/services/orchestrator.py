class Orchestrator:
    def __init__(self, prediction, analytics, recommendation, simulation, ai_insight):
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
        return {
            "error": "Invalid request type",
            "valid_types": ["predict", "analytics", "recommend", "simulate", "insight"]
        }