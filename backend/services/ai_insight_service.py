import google.generativeai as genai
import os

class AIInsightService:

    def __init__(self):
        genai.configure(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

    def generate(self, data):

        prompt = f"""
        Food Waste Report

        Prepared: {data.get('prepared')}
        Wasted: {data.get('wasted')}
        Waste Percent: {data.get('waste_percent')}

        Give:
        1. Short analysis
        2. Key risk
        3. Three recommendations

        Keep response under 150 words.
        """

        response = self.model.generate_content(
            prompt
        )

        return {
            "insight": response.text
        }