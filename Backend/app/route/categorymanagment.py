from flask import Flask, request, jsonify
from sqlalchemy import text
from dbconfig import db  # Your database connection file
from app import app

# ✅ Get all categories
@app.route("/categories", methods=["GET"])
def get_categories():
    conn = db
    query = text("SELECT category_id, category_name FROM job_finder.category_m")
    result = conn.session.execute(query)
    categories = [dict(row) for row in result.mappings()]
    return jsonify(categories)

# ✅ Add a category
@app.route("/category/add", methods=["POST"])
def add_category():
    conn = db
    data = request.json
    category_name = data.get("name")

    if not category_name:
        return jsonify({"message": "Category name is required"}), 400

    insert_query = text("INSERT INTO job_finder.category_m (category_name) VALUES (:category_name)")

    try:
        conn.session.execute(insert_query, {"category_name": category_name})
        conn.session.commit()
        return jsonify({"message": "Category added successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Failed to add category", "error": str(e)}), 500

# ✅ Update category
@app.route("/category/<int:category_id>/update", methods=["PUT"])
def update_category(category_id):
    conn = db
    data = request.json
    category_name = data.get("name")

    if not category_name:
        return jsonify({"message": "Category name is required"}), 400

    update_query = text("UPDATE job_finder.category_m SET category_name = :category_name WHERE category_id = :category_id")

    try:
        conn.session.execute(update_query, {"category_id": category_id, "category_name": category_name})
        conn.session.commit()
        return jsonify({"message": "Category updated successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Failed to update category", "error": str(e)}), 500

# ✅ Delete category
@app.route("/category/<int:category_id>/delete", methods=["DELETE"])
def delete_category(category_id):
    conn = db
    delete_query = text("DELETE FROM job_finder.category_m WHERE category_id = :category_id")

    try:
        conn.session.execute(delete_query, {"category_id": category_id})
        conn.session.commit()
        return jsonify({"message": "Category deleted successfully"})
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Failed to delete category", "error": str(e)}), 500
