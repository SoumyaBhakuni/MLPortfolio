from flask import Flask, jsonify
from flask_cors import CORS
from routes.eda_routes import eda_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "ML-Portfolio Flask API"}), 200

    app.register_blueprint(eda_bp)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)