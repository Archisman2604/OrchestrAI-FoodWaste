from flask import Flask
from routes.waste_routes import waste_bp

app = Flask(__name__)

app.register_blueprint(
    waste_bp,
    url_prefix="/api"
)

if __name__ == "__main__":
    app.run(debug=True)