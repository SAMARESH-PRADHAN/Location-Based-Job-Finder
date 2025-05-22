$(document).ready(function() {
    let role_id = localStorage.getItem("role_id");
    let name = localStorage.getItem("name");
    let agency_id = localStorage.getItem("agency_id");

    // If user is not logged in, redirect to the landing page
    if (!role_id) {
        window.location.href = "index.html"; 
        return;
    }

    $("#profileSection").fadeIn(500); // Show profile section if user is logged in
    $("#userName").text(name);  // Set user name

    let dropdownHtml = `<li><span class="dropdown-item fw-bold">${name}</span></li>`;

    if (role_id == "1") { 
        dropdownHtml += `<li><a class="dropdown-item" href="admin.html">Admin Panel</a></li>`;
    } else if (role_id == "3") { 
        dropdownHtml += `<li><a class="dropdown-item" href="agencyPanel.html">Agency Panel</a></li>`;
    }

    dropdownHtml += `<li><a class="dropdown-item text-danger" href="#" id="logout">Logout</a></li>`;
    $("#dropdownMenu").html(dropdownHtml);

    // Logout Functionality
    $(document).on("click", "#logout", function() {
        localStorage.clear();
        window.location.href = "index.html";
    });
});
