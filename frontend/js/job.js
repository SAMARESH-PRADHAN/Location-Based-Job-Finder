$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });


$(document).ready(function () {
  let currentPage = 1;
let jobsPerPage = 6;

function fetchJobs(location = "", category = "", page = 1) {
  $.get("http://127.0.0.1:5000/jobss", { location_id: location, category_id: category })
    .done(function (data) {
      let jobs = data.jobs;
      if (jobs.length === 0) {
        $("#jobCards").html("<p>No jobs found for selected criteria.</p>");
        $("#pagination").html(""); // clear pagination
        return;
      }

      let totalPages = Math.ceil(jobs.length / jobsPerPage);
      currentPage = Math.min(Math.max(1, page), totalPages); // ensure page is in range

      let start = (currentPage - 1) * jobsPerPage;
      let end = start + jobsPerPage;
      let visibleJobs = jobs.slice(start, end);

      let cards = "";
      visibleJobs.forEach((job) => {
        cards += `<div class="job-card">
                    <div class="job-title">${job.title}</div>
                    <div class="job-description">${job.description}</div>
                    <div class="job-details"><strong>Requirements:</strong> ${job.requirements}</div>
                    <div class="job-details"><strong>Salary:</strong> ${job.monthly_remuneration}</div>
                    <div class="job-details"><strong>Agency:</strong> ${job.agency_name}</div>
                    <div class="job-details"><strong>Category:</strong> ${job.category_name}</div>
                    <div class="job-details"><strong>Location:</strong> ${job.location_name}</div>
                  </div>`;
      });
      $("#jobCards").html(cards);

      // Pagination buttons
      let paginationHtml = `<div style="margin-top:20px;">`;
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="page-btn" data-page="${i}" 
                              style="margin: 0 5px; background: ${
                                i === currentPage ? "#ff9800" : "#333"
                              }; color: white;">${i}</button>`;
      }
      paginationHtml += `</div>`;
      $("#pagination").html(paginationHtml);
    })
    .fail(function (xhr, status, error) {
      console.error("API Error:", status, error);
    });
}

    // Fetch all jobs when the page loads
    fetchJobs();

    $("#searchBtn").click(function () {
      currentPage = 1;
      fetchJobs($("#locationFilter").val(), $("#categoryFilter").val(), currentPage);
    });
    
    // Pagination button click
    $(document).on("click", ".page-btn", function () {
      currentPage = parseInt($(this).attr("data-page"));
      fetchJobs($("#locationFilter").val(), $("#categoryFilter").val(), currentPage);
    });
    

    $.get("http://127.0.0.1:5000/locationss", function (data) {
      data.locations.forEach((loc) => {
        $("#locationFilter").append(
          `<option value="${loc.location_id}">${loc.location_name}</option>`
        );
      });
    });

    $.get("http://127.0.0.1:5000/categoriess", function (data) {
      data.categories.forEach((cat) => {
        $("#categoryFilter").append(
          `<option value="${cat.category_id}">${cat.category_name}</option>`
        );
      });
    });
  });