from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text


@app.route('/feedback', methods=['POST'])
def submit_feedback():
    conn = db
    data = request.get_json()
    feedback_text = data.get('feedback')
    rating = data.get('rating')
    role_id = data.get('role_id')

    user_id = data.get('user_id') if role_id == 2 else None
    agency_id = data.get('agency_id') if role_id == 3 else None

    if not feedback_text or not rating or not role_id:
        return jsonify({'message': 'Missing required fields'}), 400
    
    insert_query = text(f"""
        INSERT INTO job_finder.feedback_m (feedback_text, rating, user_id, role_id, agency_id) 
        VALUES (:feedback_text, :rating, :user_id, :role_id, :agency_id)
    """)
    try:
        conn.session.execute(insert_query, {
            'feedback_text': feedback_text,
            'rating': rating,
            'user_id': user_id,
            'role_id': role_id,
            'agency_id': agency_id
           
        })
        conn.session.commit()
        return jsonify({'message': 'Feedback submitted successfully'})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Feedback submitted Unsuccessful", "error": str(e)}), 500





from app import app
from flask import jsonify
from dbconfig import db
from sqlalchemy import text

@app.route('/all-feedbacks', methods=['GET'])
def get_all_feedbacks():
    try:
        # --- User Feedbacks ---
        user_query = """
            SELECT f.feedback_id, f.feedback_text, f.rating, f.created_at, u.name
            FROM job_finder.feedback_m f
            JOIN job_finder.user_m u ON f.user_id = u.user_id
            WHERE f.role_id = 2
            ORDER BY f.created_at DESC
        """
        user_result = db.session.execute(text(user_query)).fetchall()

        user_feedbacks = [{
            "feedback_id": row.feedback_id,
            "feedback_text": row.feedback_text,
            "rating": row.rating,
            "created_at": row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "name": row.name
        } for row in user_result]

        # --- Agency Feedbacks ---
        agency_query = """
            SELECT f.feedback_id, f.feedback_text, f.rating, f.created_at, a.name
            FROM job_finder.feedback_m f
            JOIN job_finder.agency_m a ON f.agency_id = a.agency_id
            WHERE f.role_id = 3
            ORDER BY f.created_at DESC
        """
        agency_result = db.session.execute(text(agency_query)).fetchall()

        agency_feedbacks = [{
            "feedback_id": row.feedback_id,
            "feedback_text": row.feedback_text,
            "rating": row.rating,
            "created_at": row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "name": row.name
        } for row in agency_result]

        return jsonify({
            "user_feedbacks": user_feedbacks,
            "agency_feedbacks": agency_feedbacks
        })

    except Exception as e:
        return jsonify({"message": "Error retrieving feedbacks", "error": str(e)}), 500





