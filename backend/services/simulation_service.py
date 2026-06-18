class SimulationService:

    def simulate(self, data):

        current_waste = data.get("current_waste", 390)
        reduction_percent = data.get("reduction_percent", 20)

        projected_waste = round(
            current_waste * (1 - reduction_percent / 100)
        )

        food_saved = current_waste - projected_waste

        money_saved = food_saved * 5
        co2_saved = round(food_saved * 2)

        return {
            "current_waste": current_waste,
            "reduction_percent": reduction_percent,
            "projected_waste": projected_waste,
            "food_saved": food_saved,
            "money_saved": money_saved,
            "co2_saved": co2_saved,
            "scenario": f"{reduction_percent}% waste reduction strategy"
        }