import bcrypt
from flask import request, jsonify
from app import app
from dbconfig import db
from sqlalchemy import text

@app.route("/locationsss", methods=["GET"])
def get_locationsss():
    try:
        with db.session() as session:
            query = text("""
                SELECT location_id, location_name, latitude, longitude 
                FROM job_finder.location_m 
                WHERE is_active = TRUE
            """)
            locations = session.execute(query).fetchall()

            if not locations:
                return jsonify({"message": "No locations found"}), 404

            return jsonify([
                {
                    "location_id": loc.location_id,
                    "location_name": loc.location_name,
                    "latitude": float(loc.latitude),
                    "longitude": float(loc.longitude)
                }
                for loc in locations
            ]), 200

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


@app.route("/jobsss/<int:location_id>", methods=["GET"])
def get_jobs_by_locationnn(location_id):
    try:
        with db.session() as session:
            query = text("""
                SELECT job_id, tittle 
                FROM job_finder.job_m 
                WHERE location_id = :location_id AND is_active = TRUE
            """)
            jobs = session.execute(query, {"location_id": location_id}).fetchall()

            if not jobs:
                return jsonify({"message": "No jobs found for this location"}), 404

            return jsonify([
                {
                    "job_id": job.job_id,
                    "title": job.tittle
                }
                for job in jobs
            ]), 200

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


@app.route("/job_detailsss/<int:job_id>", methods=["GET"])
def get_job_detailsss(job_id):
    try:
        with db.session() as session:
            query = text("""
                SELECT j.tittle, j.description, j.requirements, j.monthly_remuneration, 
                       a.name AS agency_name, c.category_name
                FROM job_finder.job_m j
                JOIN job_finder.agency_m a ON j.agency_id = a.agency_id
                JOIN job_finder.category_m c ON j.category_id = c.category_id
                WHERE j.job_id = :job_id
            """)
            job = session.execute(query, {"job_id": job_id}).fetchone()

            if not job:
                return jsonify({"message": "Job not found"}), 404

            return jsonify({
                "title": job.tittle,
                "description": job.description,
                "requirements": job.requirements,
                "monthly_income": float(job.monthly_remuneration) if job.monthly_remuneration else None,
                "agency_name": job.agency_name,
                "category_name": job.category_name
            }), 200

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500
