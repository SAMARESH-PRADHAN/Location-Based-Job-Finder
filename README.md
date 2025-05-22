# 📍 Location Based Job Finder

**Location Based Job Finder** is a smart job discovery platform that helps users find jobs by location and category using an interactive map. The system includes user, agency, and admin panels for seamless management of job posts, locations, feedback, and more.

---

## 🌟 Features

- 📍 Location-based job listing with map markers
- 🔍 Filter jobs by category and location
- 🧑‍💼 Admin Panel:
  - Manage users, agencies, categories, locations
  - View feedback and contact messages
- 🏢 Agency Panel:
  - Post and manage job listings
- 🗺️ Interactive map with clickable job markers
- 📬 Feedback and contact form with filter/sort

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Bootstrap, JavaScript, jQuery
- **Backend**: Python Flask
- **Database**: PostgreSQL
- **Map Library**: Leaflet.js
- **Authentication**: OTP via Email
- **Charting/Analytics**: Chart.js (Optional for admin stats)

---

## 📸 Screenshots

### 🏠 Landing Page

![Landing Page](screenshots/landing.png)

### 🗺️ Job Map View

![Map](screenshots/map.png)

### 📋 Job Listings with Filter

![Job List](screenshots/joblist.png)

### 🧑‍💼 Admin Panel - Dashboard

![Admin](screenshots/admin_dashboard.png)

### 🏢 Agency Panel - Manage Jobs

![Agency](screenshots/agency_panel.png)

---

## 🚀 Getting Started

Follow these steps to set up and run the LBJF project locally:

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/location-based-job-finder.git
cd location-based-job-finder
```

### 🔹 2. Create a Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate # On Windows
```

# OR

```bash
source venv/bin/activate # On macOS/Linux
```

### 🔹 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 🔹 4. Set Up the .env File

```bash
Create a .env file in the root folder and add your database and secret config:
```

```ini
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
SECRET_KEY=your_secret_key
✅ Note: Make sure .env is listed in your .gitignore file to prevent it from being pushed to GitHub.
```

### 🔹 5. Run the Application

```bash
flask run
The app will run at: http://127.0.0.1:5000
```

---

## 👤 Author

- **Samaresh Pradhan**
  GitHub: [@SAMARESH-PRADHAN](https://github.com/SAMARESH-PRADHAN)

---

## 📬 Contact

📧 Email: pradhansamaresh2002@gmail.com
📱 Mobile: +91-7978961272

---
