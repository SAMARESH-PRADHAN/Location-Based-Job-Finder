from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text



# ✅ Route to store contact form data
@app.route("/contact", methods=["POST"])
def save_contact():
    conn = db
    data = request.json
    c_name = data.get('c_name')
    c_email = data.get('c_email')
    c_text = data.get('c_text')
    c_phone = data.get('c_phone')

    insert_query = text("""
            INSERT INTO job_finder.contact_m (c_name, c_email, c_text, c_phone)
            VALUES (:c_name, :c_email, :c_text, :c_phone)
        """)
    try:
        conn.session.execute(insert_query, {
            'c_name': c_name,
            'c_email': c_email,
            'c_text': c_text,
            'c_phone': c_phone
        })
        conn.session.commit()
        return jsonify({"message": "Submit Sucessfull"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Submit Unsucessfull", "error": str(e)}), 500
    










    
# from app import app
# from flask import jsonify
# from dbconfig import db
# from sqlalchemy import text

# ✅ Get all contact entries (with read/unread flag)
@app.route("/all-contacts", methods=["GET"])
def get_contacts():
    try:
        query = text("""
            SELECT contact_id, c_name, c_email, c_text, time, c_phone, 
                   COALESCE(is_read, FALSE) AS is_read 
            FROM job_finder.contact_m
            ORDER BY time DESC
        """)
        result = db.session.execute(query)
        rows = result.fetchall()

        contacts = [
            {
                "contact_id": r[0],
                "c_name": r[1],
                "c_email": r[2],
                "c_text": r[3],
                "time": r[4].strftime('%Y-%m-%d %H:%M:%S'),
                "c_phone": str(r[5]) if r[5] else "",
                "is_read": r[6]
            }
            for r in rows
        ]
        return jsonify({"contacts": contacts})
    except Exception as e:
        return jsonify({"message": "Error retrieving contacts", "error": str(e)}), 500

# ✅ Mark a contact as read
@app.route("/mark-contact-read/<int:contact_id>", methods=["PUT"])
def mark_contact_read(contact_id):
    try:
        update_query = text("""
            UPDATE job_finder.contact_m 
            SET is_read = TRUE 
            WHERE contact_id = :contact_id
        """)
        db.session.execute(update_query, {'contact_id': contact_id})
        db.session.commit()
        return jsonify({"message": "Marked as read"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to mark as read", "error": str(e)}), 500
