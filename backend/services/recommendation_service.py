class RecommendationService:

    def recommend(self, data):

        waste_percent = data.get("waste_percent", 0)

        recommendations = []

        if waste_percent > 20:
            recommendations.append("Reduce food preparation by 15%")
            recommendations.append("Increase donation of surplus food")
            recommendations.append("Improve demand forecasting")

        elif waste_percent > 10:
            recommendations.append("Reduce food preparation by 10%")
            recommendations.append("Track peak demand hours")
            recommendations.append("Monitor inventory more closely")

        else:
            recommendations.append("Current waste levels are healthy")
            recommendations.append("Maintain current strategy")
            recommendations.append("Continue monitoring trends")

        return {
            "waste_percent": waste_percent,
            "actions": recommendations
        }