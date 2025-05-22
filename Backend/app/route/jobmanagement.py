from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from dbconfig import db  # Ensure your database config is correct

from app import app


@app.route("/jobs", methods=["GET"])
def get_jobs():
    conn = db
    query = text("""
        SELECT j.job_id, j.tittle, j.description, j.requirements, j.monthly_remuneration, j.is_active,
               a.name AS agency_name, c.category_name, l.location_name
        FROM job_finder.job_m j
        LEFT JOIN job_finder.agency_m a ON j.agency_id = a.agency_id
        LEFT JOIN job_finder.category_m c ON j.category_id = c.category_id
        LEFT JOIN job_finder.location_m l ON j.location_id = l.location_id
    """)
    result = conn.session.execute(query)
    jobs = [dict(row) for row in result.mappings()]
    
    return jsonify(jobs)

@app.route("/jobs/add", methods=["POST"])
def add_job():
    try:
        data = request.get_json()  # Ensure we get JSON
        required_fields = ["tittle", "description", "requirements", "monthly_remuneration", "agency_id", "category_id", "location_id"]
        
        # Validate input fields
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        conn = db
        query = text("""
            INSERT INTO job_finder.job_m (tittle, description, requirements, monthly_remuneration, agency_id, category_id, location_id)
            VALUES (:tittle, :description, :requirements, :monthly_remuneration, :agency_id, :category_id, :location_id)
        """)
        conn.session.execute(query, data)
        conn.session.commit()
        
        return jsonify({'message': 'Job added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@app.route("/jobs/<int:job_id>", methods=["GET"])
def get_single_job(job_id):
    conn = db
    query = text("""
        SELECT job_id, tittle, description, requirements, monthly_remuneration, agency_id, category_id, location_id
        FROM job_finder.job_m
        WHERE job_id = :job_id
    """)
    result = conn.session.execute(query, {"job_id": job_id}).fetchone()

    if result:
        job = dict(result._mapping)  # Convert to dict
        return jsonify(job)
    else:
        return jsonify({'error': 'Job not found'}), 404





@app.route("/jobs/update", methods=["PUT"])
def update_job():
     try:
        data = request.get_json()
        if "job_id" not in data:
            return jsonify({"error": "Missing job_id"}), 400

        query = text("""
            UPDATE job_finder.job_m
            SET tittle = :tittle, description = :description, requirements = :requirements, 
                monthly_remuneration = :monthly_remuneration, agency_id = :agency_id, 
                category_id = :category_id, location_id = :location_id
            WHERE job_id = :job_id
        """)
        db.session.execute(query, data)
        db.session.commit()

        return jsonify({'message': 'Job updated successfully'}), 200
     except Exception as e:
        return jsonify({'error': str(e)}), 500
     
@app.route("/jobs/toggle-status/<int:job_id>", methods=["PUT"])
def toggle_job_status(job_id):
    try:
        conn = db
        
        # Get the current status
        query_get = text("SELECT is_active FROM job_finder.job_m WHERE job_id = :job_id")
        result = conn.session.execute(query_get, {"job_id": job_id}).fetchone()
        
        if result is None:
            return jsonify({"error": "Job not found"}), 404
        
        current_status = result[0]  # Get TRUE or FALSE
        
        # Toggle the value
        new_status = not current_status  # Flip TRUE to FALSE and vice versa
        
        query_update = text("""
            UPDATE job_finder.job_m
            SET is_active = :new_status
            WHERE job_id = :job_id
        """)
        conn.session.execute(query_update, {"new_status": new_status, "job_id": job_id})
        conn.session.commit()

        return jsonify({"message": "Job status updated successfully", "new_status": new_status}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
