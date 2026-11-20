from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes import ALL_BLUEPRINTS


def create_app() -> Flask:
    """Create and configure the Flask application for all 10 ML tasks."""
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "ML Portfolio Backend API",
            "tasks_count": len(Config.TASKS_CATALOG),
        }), 200

    @app.route("/api/tasks", methods=["GET"])
    def list_tasks():
        return jsonify({
            "status": "success",
            "total": len(Config.TASKS_CATALOG),
            "data": Config.TASKS_CATALOG,
        }), 200

    for bp in ALL_BLUEPRINTS:
        app.register_blueprint(bp)

    @app.errorhandler(404)
    def handle_404(_err):
        return jsonify({"status": "error", "message": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def handle_405(_err):
        return jsonify({"status": "error", "message": "Method not allowed."}), 405

    @app.errorhandler(500)
    def handle_500(err):
        return jsonify({"status": "error", "message": str(err)}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)