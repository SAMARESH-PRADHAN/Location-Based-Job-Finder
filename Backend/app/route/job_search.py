from flask import request, jsonify
from app import app
from dbconfig import db
from sqlalchemy import text

@app.route('/jobss', methods=['GET'])
def get_jobss():
    conn = db
    location_id = request.args.get('location_id')
    category_id = request.args.get('category_id')

    base_query = """
        SELECT j.job_id, j.tittle AS title, j.description, j.requirements, j.monthly_remuneration, 
               a.name AS agency_name, c.category_name, l.location_name
        FROM job_finder.job_m j
        JOIN job_finder.agency_m a ON j.agency_id = a.agency_id
        JOIN job_finder.category_m c ON j.category_id = c.category_id
        JOIN job_finder.location_m l ON j.location_id = l.location_id
        WHERE j.is_active = true
    """

    conditions = []
    params = {}

    if location_id:
        conditions.append("j.location_id = :location_id")
        params["location_id"] = location_id

    if category_id:
        conditions.append("j.category_id = :category_id")
        params["category_id"] = category_id

    # Add filtering conditions if any
    if conditions:
        base_query += " AND " + " AND ".join(conditions)

    query = text(base_query)
    jobs = conn.session.execute(query, params).fetchall()

    job_list = [
        {"job_id": j[0], "title": j[1], "description": j[2], "requirements": j[3],
         "monthly_remuneration": j[4], "agency_name": j[5], "category_name": j[6], "location_name": j[7]}
        for j in jobs
    ]
    return jsonify({"jobs": job_list})


@app.route('/locationss', methods=['GET'])
def get_locationss():
    conn = db
    query = text("SELECT location_id, location_name FROM job_finder.location_m WHERE is_active = true")
    locations = conn.session.execute(query).fetchall()
    
    location_list = [{"location_id": loc[0], "location_name": loc[1]} for loc in locations]
    return jsonify({"locations": location_list})

@app.route('/categoriess', methods=['GET'])
def get_categoriess():
    conn = db
    query = text("SELECT category_id, category_name FROM job_finder.category_m WHERE is_active = true")
    categories = conn.session.execute(query).fetchall()
    
    category_list = [{"category_id": cat[0], "category_name": cat[1]} for cat in categories]
    return jsonify({"categories": category_list})
