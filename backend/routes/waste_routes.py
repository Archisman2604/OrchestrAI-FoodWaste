from flask import Blueprint, jsonify
from services.analytics_service import get_waste_summary

waste_bp = Blueprint("waste", __name__)

@waste_bp.route("/summary")
def summary():
    return jsonify(get_waste_summary())