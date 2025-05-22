$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });

  document.addEventListener("DOMContentLoaded", function () {
    let images = [
        
        "./images/slider1.jpg",
        "./images/slider2.jpg",
        "./images/slider3.jpg",
        "./images/slider4.jpg",
        "./images/slider5.jpg"
    ];
    let index = 0;

    function changeBackground() {
        let hero = document.getElementById("hero");
        if (!hero) {
            console.error("Hero section not found!");
            return;
        }
        hero.style.background = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${images[index]}') no-repeat center center/cover`;
        index = (index + 1) % images.length;
    }

    changeBackground(); // Set initial background
    setInterval(changeBackground, 5000);
});


$(document).ready(function () {
  fetchJobs();
  fetchCategories();
  fetchAgencies();
});

function fetchJobs() {
  $.ajax({
      url: "http://127.0.0.1:5000/jobss",
      method: "GET",
      success: function (response) {
          const jobs = response.jobs.slice(0, 4); // Only take the first 4 jobs
          let jobHtml = "";
          jobs.forEach(job => {
              jobHtml += `
              <div class="col-md-3">
              <div class="job-card">
                          <h5>${job.title}</h5>
                          <p><strong>Company:</strong> ${job.agency_name}</p>
                          <p><strong>Salary:</strong> ${job.monthly_remuneration}</p>
                          <p><strong>Location:</strong> ${job.location_name}</p>
                      </div>
          </div>
              `;
          });
          $(".p_job .row").html(jobHtml);
      }
  });
}

function fetchCategories() {
  $.ajax({
      url: "http://127.0.0.1:5000/categoriess",
      method: "GET",
      success: function (response) {
          let categoryHtml = "";
          response.categories.forEach(category => {
              categoryHtml += `<div class="col-md-3 category-card">${category.category_name}</div>`;
          });
          $(".popular-categories .row").html(categoryHtml);
      }
  });
}

function fetchAgencies() {
  $.get("http://127.0.0.1:5000/agencies", function (data) {
      let agencies = data.filter((agency) => agency.is_active); // Show only active agencies
      let agencyContainer = $(".row.agency-list");
      agencyContainer.empty();

      agencies.forEach((agency) => {
          agencyContainer.append(`
              <div class="col-md-3 agency-card">${agency.name}</div>
          `);
      });
  });
}