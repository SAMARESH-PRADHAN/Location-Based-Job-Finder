import bcrypt
from flask import Flask, request, jsonify
from sqlalchemy import text
from dbconfig import db  # Your database connection file
from app import app



# ✅ Get all agencies
@app.route("/agencies", methods=["GET"])
def get_agencies():
    conn = db
    query = text("SELECT agency_id, name, email, address, mobile_no, is_active FROM job_finder.agency_m")
    result = conn.session.execute(query)
    agencies = [dict(row) for row in result.mappings()]
    return jsonify(agencies)


# ✅ Add an agency
@app.route("/agency/add", methods=["POST"])
def add_agency():
    conn = db
    data = request.json

    name = data.get("name")
    email = data.get("email")
    address = data.get("address")
    mobile_no = data.get("mobile_no")
    password = data.get("password")
    role_id = 3
    if not name or not email or not address or not mobile_no:
        return jsonify({"message": "All fields are required"}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    insert_query = text("""
        INSERT INTO job_finder.agency_m (name, email, address, role_id, mobile_no, password) 
        VALUES (:name, :email, :address, :role_id, :mobile_no, :password)
    """)

    try:
        conn.session.execute(insert_query, {
            "name": name,
            "email": email,
            "address": address,
            "role_id": role_id,
            "mobile_no": mobile_no,
            "password": hashed_password
        })
        conn.session.commit()
        return jsonify({"message": "Agency added successfully"})
    except Exception as e:
        conn.session.rollback()
        print(f"Error: {str(e)}") 
        return jsonify({"message": "Agency registration failed", "error": str(e)}), 500


# ✅ Update agency details
@app.route("/agency/<int:agency_id>/update", methods=["PUT"])
def update_agency(agency_id):
    conn = db
    data = request.json

    name = data.get("name")
    email = data.get("email")
    address = data.get("address")
    mobile_no = data.get("mobile_no")

    if not name or not email or not address or not mobile_no:
        return jsonify({"message": "All fields are required"}), 400

    update_query = text("""
        UPDATE job_finder.agency_m 
        SET name = :name, email = :email, address = :address, mobile_no = :mobile_no
        WHERE agency_id = :agency_id
    """)

    try:
        conn.session.execute(update_query, {
            "agency_id": agency_id,
            "name": name,
            "email": email,
            "address": address,
            "mobile_no": mobile_no
        })
        conn.session.commit()
        return jsonify({"message": "Agency updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Agency update failed", "error": str(e)}), 500


# ✅ Toggle agency active/inactive status
@app.route("/agency/<int:agency_id>/toggle", methods=["PUT"])
def toggle_agency_status(agency_id):
    conn = db
    query = text("UPDATE job_finder.agency_m SET is_active = NOT is_active WHERE agency_id = :agency_id")

    try:
        conn.session.execute(query, {"agency_id": agency_id})
        conn.session.commit()
        return jsonify({"message": "Agency status updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Failed to update agency status", "error": str(e)}), 500

