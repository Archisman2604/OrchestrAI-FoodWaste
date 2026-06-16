class Orchestrator:
    def __init__(self, prediction_service, analytics_service,
                 recommendation_service, simulation_service):
        self.prediction = prediction_service
        self.analytics = analytics_service
        self.recommendation = recommendation_service
        self.simulation = simulation_service

    def process(self, request_type, data):
        """
        Main AI decision engine
        """

        if request_type == "predict":
            return self.prediction.predict(data)

        elif request_type == "analytics":
            return self.analytics.analyze(data)

        elif request_type == "recommend":
            return self.recommendation.generate(data)

        elif request_type == "simulate":
            return self.simulation.run(data)

        else:
            return {
                "error": "Unknown request type"
            }