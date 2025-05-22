from flask import Flask, jsonify, request
from app import app
from dbconfig import db
from sqlalchemy import text

@app.route('/dashboard/counts', methods=['GET'])
def get_dashboard_counts():
    total_users = db.session.execute(text("SELECT COUNT(*) FROM job_finder.user_m WHERE role_id = 2")).scalar()
    total_agencies = db.session.execute(text("SELECT COUNT(*) FROM job_finder.agency_m WHERE role_id = 3")).scalar()
    total_locations = db.session.execute(text("SELECT COUNT(*) FROM job_finder.location_m")).scalar()
    total_categories = db.session.execute(text("SELECT COUNT(*) FROM job_finder.category_m")).scalar()
    total_jobs = db.session.execute(text("SELECT COUNT(*) FROM job_finder.job_m")).scalar()

    return jsonify({
        'users': total_users,
        'agencies': total_agencies,
        'locations': total_locations,
        'categories': total_categories,
        'jobs': total_jobs
    })

@app.route('/dashboard/feedbacks', methods=['GET'])
def get_feedback_stats():
    user_feedback_data = db.session.execute(text("""
        SELECT rating, COUNT(*) FROM job_finder.feedback_m 
        WHERE role_id = 2 GROUP BY rating ORDER BY rating
    """)).fetchall()
    agency_feedback_data = db.session.execute(text("""
        SELECT rating, COUNT(*) FROM job_finder.feedback_m 
        WHERE role_id = 3 GROUP BY rating ORDER BY rating
    """)).fetchall()

    user_feedback = {str(row[0]): row[1] for row in user_feedback_data}
    agency_feedback = {str(row[0]): row[1] for row in agency_feedback_data}

    return jsonify({
        'user_feedback': user_feedback,
        'agency_feedback': agency_feedback
    })



@app.route('/dashboard/registrations', methods=['GET'])
def get_registration_stats():
    user_regs = db.session.execute(text("""
        SELECT DATE(created_on), COUNT(*) FROM job_finder.user_m 
        WHERE role_id = 2 GROUP BY DATE(created_on) ORDER BY DATE(created_on)
    """)).fetchall()

    agency_regs = db.session.execute(text("""
        SELECT DATE(created_on), COUNT(*) FROM job_finder.agency_m 
        WHERE role_id = 3 GROUP BY DATE(created_on) ORDER BY DATE(created_on)
    """)).fetchall()

    user_regs = [{'date': str(row[0]), 'count': row[1]} for row in user_regs]
    agency_regs = [{'date': str(row[0]), 'count': row[1]} for row in agency_regs]
 
    return jsonify({
        'user_regs': user_regs,
        'agency_regs': agency_regs
    })



@app.route('/dashboard/registrations/filter', methods=['POST'])
def filter_registration_stats():
    data = request.get_json()
    start = data.get('start_date')
    end = data.get('end_date')
    role_id = data.get('role_id')

    if role_id == 2:
        result = db.session.execute(text(f"""
            SELECT DATE(created_on), COUNT(*) FROM job_finder.user_m 
            WHERE role_id = 2 AND DATE(created_on) BETWEEN :start AND :end 
            GROUP BY DATE(created_on) ORDER BY DATE(created_on)
        """), {'start': start, 'end': end}).fetchall()
    elif role_id == 3:
        result = db.session.execute(text(f"""
            SELECT DATE(created_on), COUNT(*) FROM job_finder.agency_m 
            WHERE role_id = 3 AND DATE(created_on) BETWEEN :start AND :end 
            GROUP BY DATE(created_on) ORDER BY DATE(created_on)
        """), {'start': start, 'end': end}).fetchall()
    else:
        result = []

    formatted = [{'date': str(row[0]), 'count': row[1]} for row in result]
    return jsonify({'data': formatted})
