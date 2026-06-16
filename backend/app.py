from flask import Flask, request, jsonify
from flask_cors import CORS

# Services
from services.prediction_service import PredictionService
from services.analytics_service import AnalyticsService
from services.recommendation_service import RecommendationService
from services.simulation_service import SimulationService
from services.orchestrator import Orchestrator

app = Flask(__name__)
CORS(app)

# ----------------------------
# Initialize AI System
# ----------------------------
orchestrator = Orchestrator(
    PredictionService(),
    AnalyticsService(),
    RecommendationService(),
    SimulationService()
)

# ----------------------------
# Health Check
# ----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "OrchestrAI Backend is running 🚀"
    })

# ----------------------------
# AI Core Engine
# ----------------------------
@app.route("/ai", methods=["POST"])
def ai_engine():
    try:
        data = request.get_json()

        request_type = data.get("type")
        payload = data.get("data")

        result = orchestrator.process(request_type, payload)

        return jsonify({
            "success": True,
            "type": request_type,
            "result": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ----------------------------
# Gunicorn entry point
# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)