from flask import Flask, request, jsonify
from sqlalchemy import text
from dbconfig import db  # Your database connection file
from app import app

# ✅ Get all locations
@app.route("/locations", methods=["GET"])
def get_locations():
    conn = db
    query = text("SELECT location_id, location_name, latitude, longitude FROM job_finder.location_m")
    result = conn.session.execute(query)
    locations = [dict(row) for row in result.mappings()]
    return jsonify(locations)

# ✅ Add a location
@app.route("/location/add", methods=["POST"])
def add_location():
    conn = db
    data = request.json
    insert_query = text("""
        INSERT INTO job_finder.location_m (location_name, latitude, longitude) 
        VALUES (:location_name, :latitude, :longitude)
    """)

    try:
        conn.session.execute(insert_query, data)
        conn.session.commit()
        return jsonify({"message": "Location added successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"error": str(e)}), 500

# ✅ Update location
@app.route("/location/<int:location_id>/update", methods=["PUT"])
def update_location(location_id):
    conn = db
    data = request.json
    update_query = text("""
        UPDATE job_finder.location_m 
        SET location_name = :location_name, latitude = :latitude, longitude = :longitude 
        WHERE location_id = :location_id
    """)

    try:
        conn.session.execute(update_query, {**data, "location_id": location_id})
        conn.session.commit()
        return jsonify({"message": "Location updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"error": str(e)}), 500

# ✅ Toggle Location Status (Activate/Deactivate)
@app.route("/location/<int:location_id>/toggle-status", methods=["PUT"])
def toggle_location_status(location_id):
    conn = db
    data = request.json
    print("Received Data:", data)  # Debugging line

    if "is_active" not in data:
        return jsonify({"error": "Missing 'is_active' field"}), 400

    new_status = bool(data["is_active"])

    toggle_query = text("""
        UPDATE job_finder.location_m 
        SET is_active = :is_active
        WHERE location_id = :location_id
    """)

    try:
        conn.session.execute(toggle_query, {"is_active": new_status, "location_id": location_id})
        conn.session.commit()
        status_text = "activated" if new_status else "deactivated"
        return jsonify({"message": f"Location {status_text} successfully"})
    except Exception as e:
        conn.session.rollback()
        print("Error:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500
