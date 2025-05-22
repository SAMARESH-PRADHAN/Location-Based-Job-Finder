from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from dbconfig import db  # Ensure your database config is correct

from app import app

@app.route("/Ajobs", methods=["GET"])
def get_agency_jobs():
    try:
        agency_id = request.args.get("agency_id", type=int)
        if not agency_id:
            return jsonify({"error": "Unauthorized access"}), 403

        query = text("""
            SELECT j.job_id, j.tittle, j.description, j.requirements, j.monthly_remuneration, j.is_active,
                   c.category_name, l.location_name
            FROM job_finder.job_m j
            LEFT JOIN job_finder.category_m c ON j.category_id = c.category_id
            LEFT JOIN job_finder.location_m l ON j.location_id = l.location_id
            WHERE j.agency_id = :agency_id
        """)
        result = db.session.execute(query, {"agency_id": agency_id})
        jobs = [dict(row) for row in result.mappings()]
        
        return jsonify(jobs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/add_jobByagency", methods=["POST"])
def add_jobByagency():
    try:
        data = request.get_json()
        query = text("""
            INSERT INTO job_finder.job_m (tittle, description, requirements, monthly_remuneration, category_id, location_id, agency_id)
            VALUES (:tittle, :description, :requirements, :monthly_remuneration, :category_id, :location_id, :agency_id)
        """)
        db.session.execute(query, {
            "tittle": data["tittle"],
            "description": data["description"],
            "requirements": data["requirements"],
            "monthly_remuneration": data.get("monthly_remuneration"),
            "category_id": data["category_id"],
            "location_id": data["location_id"],
            "agency_id": data["agency_id"]
        })
        db.session.commit()
        return jsonify({"message": "Job added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@app.route("/job_a/<int:job_id>", methods=["GET"])
def get_job_by_id(job_id):
    try:
        query = text("""
            SELECT job_id, tittle, description, requirements, monthly_remuneration, category_id, location_id
            FROM job_finder.job_m
            WHERE job_id = :job_id
        """)
        result = db.session.execute(query, {"job_id": job_id}).fetchone()

        if not result:
            return jsonify({"error": "Job not found"}), 404

        job = dict(result._mapping)  # Convert result to dictionary
        return jsonify(job)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/update_jobByagency", methods=["POST"])
def update_jobByagency():
    try:
        data = request.get_json()

        query = text("""
            UPDATE job_finder.job_m
            SET tittle = :tittle, description = :description, requirements = :requirements, 
                monthly_remuneration = :monthly_remuneration, category_id = :category_id, location_id = :location_id
            WHERE job_id = :job_id AND agency_id = :agency_id
        """)

        result = db.session.execute(query, {
            "tittle": data["tittle"],
            "description": data["description"],
            "requirements": data["requirements"],
            "monthly_remuneration": data.get("monthly_remuneration"),
            "category_id": data["category_id"],
            "location_id": data["location_id"],
            "job_id": data["job_id"],
            "agency_id": data["agency_id"]
        })

        db.session.commit()

        if result.rowcount == 0:
            return jsonify({"error": "Job not found or unauthorized"}), 404

        return jsonify({"message": "Job updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/toggle_job", methods=["POST"])
def toggle_status_agency():
    try:
        data = request.get_json()
        job_id = data.get("job_id")
        is_active = data.get("is_active")

        if job_id is None or is_active is None:
            return jsonify({"error": "Job ID and is_active status are required"}), 400

        query = text("""
            UPDATE job_finder.job_m
            SET is_active = :is_active
            WHERE job_id = :job_id
        """)

        db.session.execute(query, {"job_id": job_id, "is_active": is_active})
        db.session.commit()

        return jsonify({"message": "Job status updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
