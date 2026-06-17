import json

class AnalyticsService:

    def load_data(self):
        with open("data/sample_data.json") as f:
            return json.load(f)

    def analyze(self, data=None):
        data = self.load_data()

        total_prepared = sum(x["prepared"] for x in data)
        total_wasted = sum(x["wasted"] for x in data)

        waste_percent = round(
            (total_wasted / total_prepared) * 100,
            2
        )

        return {
            "prepared": total_prepared,
            "wasted": total_wasted,
            "waste_percent": waste_percent
        }