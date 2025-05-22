$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("assets/js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });



  let agency_id = localStorage.getItem("agency_id");  //Get from session after login
  //let agency_id = 2;

   function fetchAgencyJobs() {
       $.get(`http://127.0.0.1:5000/Ajobs?agency_id=${agency_id}`, function(data) {
           let rows = "";
           data.forEach((job, index) => {
               rows += `<tr>
                   <td>${index+1}</td>
                   <td>${job.tittle}</td>
                   <td>${job.description}</td>
                   <td>${job.requirements}</td>
                   <td>${job.monthly_remuneration || 'N/A'}</td>
                   <td>${job.category_name}</td>
                   <td>${job.location_name}</td>
                   <td>
                       <button class="btn btn-warning btn-sm" onclick="openEditModal(${job.job_id})">Edit</button>
                       <button class="btn ${job.is_active ?  'btn-danger': 'btn-success'} btn-sm" onclick="toggleJobStatus(${job.job_id}, ${job.is_active})">
                           ${job.is_active ? 'Deactivate' : 'Active' }
                       </button>
                   </td>
               </tr>`;
           });
           $("#jobTable").html(rows);
       });
   }
   fetchAgencyJobs();
   function openAddModal() {
console.log("Add Job button clicked"); // Debugging
$("#jobForm")[0].reset();
$("#job_id").val('');
fetchDropdownData();
$("#jobModal").modal("show"); // Ensure modal is triggered
}


function openEditModal(job_id) {
console.log("Fetching job details for job_id:", job_id); // Debugging log

$.get(`http://127.0.0.1:5000/job_a/${job_id}`, function(job) {
   if (!job) {
       alert("Error: Job not found!");
       return;
   }
   
   // Populate form fields
   $("#job_id").val(job.job_id);
   $("#tittle").val(job.tittle);
   $("#description").val(job.description);
   $("#requirements").val(job.requirements);
   $("#monthly_remuneration").val(job.monthly_remuneration || '');
   $("#category_id").val(job.category_id);
   $("#location_id").val(job.location_id);

   // Fetch categories and locations before showing modal
   fetchDropdownData(() => {
       $("#jobModal").modal("show");
   });
}).fail(function(xhr) {
   console.error("Error fetching job:", xhr.responseText);
   alert("Failed to fetch job details.");
});
}


function fetchDropdownData(callback) {
let categoryPromise = $.get("http://127.0.0.1:5000/categories", function(data) {
   let options = data.map(cat => `<option value="${cat.category_id}">${cat.category_name}</option>`);
   $("#category_id").html(options);
});

let locationPromise = $.get("http://127.0.0.1:5000/locations", function(data) {
   let options = data.map(loc => `<option value="${loc.location_id}">${loc.location_name}</option>`);
   $("#location_id").html(options);
});

// Run callback when both dropdowns have been loaded
$.when(categoryPromise, locationPromise).done(callback);
}


   $("#jobForm").submit(function(e) {
       e.preventDefault();
       let jobData = {
           job_id: $("#job_id").val(),
           tittle: $("#tittle").val(),
           description: $("#description").val(),
           requirements: $("#requirements").val(),
           monthly_remuneration: $("#monthly_remuneration").val(),
           category_id: $("#category_id").val(),
           location_id: $("#location_id").val(),
           agency_id: agency_id
       };

       let url = jobData.job_id ? "http://127.0.0.1:5000/update_jobByagency" : "http://127.0.0.1:5000/add_jobByagency";
       $.post(url, jobData, function() {
           $("#jobModal").modal("hide");
           fetchAgencyJobs();
       });
       $.ajax({
   url: url,
   type: "POST",
   contentType: "application/json",
   data: JSON.stringify(jobData),
   success: function(response) {
       $("#jobModal").modal("hide");
       fetchAgencyJobs();
   },
   error: function(xhr) {
       console.error("Error:", xhr.responseText);
       alert("Failed to save job.");
   }
});
   });

   function toggleJobStatus(job_id, current_status) {
let new_status = !current_status; // Toggle boolean value

$.ajax({
   url: "http://127.0.0.1:5000/toggle_job",
   type: "POST",
   contentType: "application/json",
   data: JSON.stringify({ job_id: job_id, is_active: new_status }),
   success: function() {
       fetchAgencyJobs(); // Refresh job list after status change
   },
   error: function(xhr) {
       console.error("Error:", xhr.responseText);
       alert("Failed to update job status.");
   }
});
}
