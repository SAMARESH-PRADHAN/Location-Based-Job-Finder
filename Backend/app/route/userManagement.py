import bcrypt
from flask import Flask,request, jsonify
from app import app
from dbconfig import db
from sqlalchemy import text



# Fetch Users
@app.route("/users", methods=['GET'])
def get_users():
    conn = db
    try:
        query = text("SELECT user_id, name, email, address, mobile_no, is_active FROM job_finder.user_m")
        result = conn.session.execute(query)
        users = [dict(row) for row in result.mappings()]
        return jsonify(users)
    except Exception as e:
        return jsonify({"message": "Error fetching users", "error": str(e)}), 500

# Add User (Fixed)
@app.route("/user/add", methods=['POST'])
def add_user():
    conn = db
    data = request.get_json()  # Ensure proper JSON parsing

    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    name = data.get('name')
    email = data.get('email')
    address = data.get('address')
    mobile_no = data.get('mobile_no')
    password = data.get('password')
    role_id = 2

    if not all([name, email, address, mobile_no, password]):
        return jsonify({"message": "All fields are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    insert_query = text("""
        INSERT INTO job_finder.user_m (name, email, address, role_id, mobile_no, password) 
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
        return jsonify({"message": "User added successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "User registration failed", "error": str(e)}), 500
    finally:
        conn.session.close()  # Ensure session is closed

# Toggle User Status
@app.route("/user/<int:user_id>/toggle", methods=['PUT'])
def toggle_user_status(user_id):
    conn = db
    query = text("UPDATE job_finder.user_m SET is_active = NOT is_active WHERE user_id = :user_id")
    try:
        conn.session.execute(query, {'user_id': user_id})
        conn.session.commit()
        return jsonify({"message": "User status updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Failed to update user status", "error": str(e)}), 500
    finally:
        conn.session.close()



@app.route("/user/<int:user_id>/update", methods=['PUT'])
def update_user(user_id):
    conn = db
    data = request.json

    # Extracting user details
    name = data.get('name')
    email = data.get('email')
    address = data.get('address')
    mobile_no = data.get('mobile_no')

    if not name or not email or not address or not mobile_no:
        return jsonify({"message": "All fields are required"}), 400

    # Update query
    update_query = text("""
        UPDATE job_finder.user_m 
        SET name = :name, email = :email, address = :address, mobile_no = :mobile_no 
        WHERE user_id = :user_id
    """)

    try:
        conn.session.execute(update_query, {
            'user_id': user_id,
            'name': name,
            'email': email,
            'address': address,
            'mobile_no': mobile_no
        })
        conn.session.commit()
        return jsonify({"message": "User updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "User update failed", "error": str(e)}), 500