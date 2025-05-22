import bcrypt
from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text

@app.route("/registration", methods=['POST'])
def registration():
    conn = db
    data = request.json
    name = data.get('full_name')
    email = data.get('email')
    mobile_no = data.get('mobile_no')
    address = data.get('address')
    password = data.get('password') 
    role_id = data.get('role_id')

    # Ensure role_id is an integer
    try:
        role_id = int(role_id)
    except (TypeError, ValueError):
        return jsonify({"message": "Register Unsuccessful", "error": "Invalid role_id"}), 400

    # Validate missing fields
    if not name or not email or not address or not mobile_no or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Hash password and decode for PostgreSQL
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Determine the target table
    if role_id == 2:
        table_name = "job_finder.user_m"
    elif role_id == 3:
        table_name = "job_finder.agency_m"
    else:
        return jsonify({"message": "Register Unsuccessful", "error": "Invalid role_id"}), 400

    # Insert query (Dynamic based on table)
    insert_query = text(f"""
        INSERT INTO {table_name} (name, email, address, role_id, mobile_no, password) 
        VALUES (:name, :email, :address, :role_id, :mobile_no, :password)
    """)

    try:
        conn.session.execute(insert_query, {
            'name': name,
            'email': email,
            'address': address,
            'role_id': role_id,
            'mobile_no': mobile_no,
            'password': hashed_password
        })
        conn.session.commit()
        return jsonify({"message": "Register Successfully"})  
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Register Unsuccessful", "error": str(e)}), 500
