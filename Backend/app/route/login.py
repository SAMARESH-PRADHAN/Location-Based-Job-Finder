# import bcrypt
# from flask import request, jsonify
# from app import app
# from dbconfig import db
# from sqlalchemy import text

# @app.route("/login", methods=['POST'])
# def login():
#     conn = db
#     data = request.json
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"message": "Email and password are required"}), 400

#     # Try fetching user from user_m table
#     user_query = text("SELECT user_id, name, role_id, password FROM job_finder.user_m WHERE email = :email")
#     user_result = conn.session.execute(user_query, {'email': email}).fetchone()

#     # Try fetching user from agency_m table
#     agency_query = text("SELECT agency_id, name, role_id, password FROM job_finder.agency_m WHERE email = :email")
#     agency_result = conn.session.execute(agency_query, {'email': email}).fetchone()

#     # Determine user details
#     user = user_result or agency_result
#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     user_id, name, role_id, stored_password = user

#     # 🔹 Fix for memoryview issue
#     if isinstance(stored_password, memoryview):
#         stored_password = stored_password.tobytes()  # Convert memoryview to bytes

#     # Verify password
#     if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
#         return jsonify({"message": "Invalid credentials"}), 401

#     return jsonify({
#         "user_id": user_id,
#         "name": name,
#         "role_id": role_id
#     })

import bcrypt
from flask import request, jsonify
from app import app
from dbconfig import db
from sqlalchemy import text

@app.route("/login", methods=['POST'])
def login():
    conn = db
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Fetch user from user_m or agency_m
    query = text("""
        SELECT user_id AS id, name, role_id, password, NULL AS agency_id FROM job_finder.user_m WHERE email = :email
        UNION ALL
        SELECT agency_id AS id, name, role_id, password, agency_id FROM job_finder.agency_m WHERE email = :email
    """)
    user = conn.session.execute(query, {'email': email}).fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

    user_id, name, role_id, stored_password, agency_id = user

    # Ensure stored_password is in bytes
    if isinstance(stored_password, memoryview):
        stored_password = stored_password.tobytes()

    if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
        return jsonify({"message": "Invalid credentials"}), 401

    # ✅ Return user data for manual localStorage storage
    response_data = {
        "user_id": user_id,
        "name": name,
        "role_id": role_id
    }

    # ✅ If user is an agency, return agency_id
    if role_id == 3:
        response_data["agency_id"] = agency_id

    return jsonify(response_data), 200