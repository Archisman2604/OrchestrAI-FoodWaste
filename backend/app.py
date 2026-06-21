from flask import Flask, request, jsonify
from flask_cors import CORS

# Services
from services.prediction_service import PredictionService
from services.analytics_service import AnalyticsService
from services.recommendation_service import RecommendationService
from services.simulation_service import SimulationService
from services.ai_insight_service import AIInsightService
from services.image_service import ImageService
from services.orchestrator import Orchestrator

app = Flask(__name__)
CORS(app)

# ----------------------------
# Initialize Services
# ----------------------------

prediction_service = PredictionService()
analytics_service = AnalyticsService()
recommendation_service = RecommendationService()
simulation_service = SimulationService()
ai_insight_service = AIInsightService()
image_service = ImageService()

# ----------------------------
# Initialize Orchestrator
# ----------------------------

orchestrator = Orchestrator(
    prediction_service,
    analytics_service,
    recommendation_service,
    simulation_service,
    ai_insight_service
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
        payload = data.get("data", {})

        result = orchestrator.process(
            request_type,
            payload
        )

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
# Food Image Upload
# ----------------------------

@app.route("/upload-food-image", methods=["POST"])
def upload_food_image():

    try:

        image = request.files.get("image")

        if not image:
            return jsonify({
                "success": False,
                "error": "No image uploaded"
            }), 400

        result = image_service.process_image(image)

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ----------------------------
# Run Server
# ----------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=10000,
        debug=True
    )