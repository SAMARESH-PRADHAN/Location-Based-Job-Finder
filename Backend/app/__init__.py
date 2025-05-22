from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from app.route import registration
from app.route import login
from app.route import userManagement
from app.route import agencymanagement
from app.route import categorymanagment
from app.route import locationmanagement
from app.route import jobmanagement
from app.route import agencypanel
from app.route.jobmanagement import add_job
from app.route import job_search
from app.route import contact
from app.route import mapapi
from app.route import feedback
from app.route import dashbordApi