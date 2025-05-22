$(document).ready(function () {
    fetchAgencies();

    // Open Add Agency Modal
    $("#addAgencyBtn").click(function () {
        $("#addAgencyModal").modal("show");
    });

    // Save Agency
    $("#saveAgencyBtn").click(function () {
        let agencyData = {
            name: $("#addAgencyName").val(),
            email: $("#addAgencyEmail").val(),
            address: $("#addAgencyAddress").val(),
            mobile_no: $("#addAgencyMobile").val(),
            password: $("#addAgencyPassword").val(),
        };

        $.ajax({
            url: "http://127.0.0.1:5000/agency/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(agencyData),
            success: function () {
                alert("Agency added successfully!");
                $("#addAgencyModal").modal("hide");
                fetchAgencies();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Open Edit Modal
    $(document).on("click", ".edit-btn", function () {
        $("#editAgencyId").val($(this).data("id"));
        $("#editAgencyName").val($(this).data("name"));
        $("#editAgencyEmail").val($(this).data("email"));
        $("#editAgencyAddress").val($(this).data("address"));
        $("#editAgencyMobile").val($(this).data("mobile"));
        $("#editAgencyModal").modal("show");
    });

    // Update Agency
    $("#updateAgencyBtn").click(function () {
        let agencyId = $("#editAgencyId").val();
        let updatedData = {
            name: $("#editAgencyName").val(),
            email: $("#editAgencyEmail").val(),
            address: $("#editAgencyAddress").val(),
            mobile_no: $("#editAgencyMobile").val(),
        };

        $.ajax({
            url: `http://127.0.0.1:5000/agency/${agencyId}/update`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function () {
                alert("Agency updated successfully!");
                $("#editAgencyModal").modal("hide");
                fetchAgencies();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Toggle Status
    $(document).on("click", ".toggle-status", function () {
        let agencyId = $(this).data("id");
        $.ajax({
            url: `http://127.0.0.1:5000/agency/${agencyId}/toggle`,
            type: "PUT",
            success: function () {
                fetchAgencies();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });
});

function fetchAgencies() {
    $.get("http://127.0.0.1:5000/agencies", function (agencies) {
        let tableBody = "";
        agencies.forEach((agency, index) => {
            let statusColor = agency.is_active ? "btn-success" : "btn-danger";
            let statusText = agency.is_active ? "Active" : "Deactivate";
            tableBody += `
                <tr>
                    <td>${index+1}</td>
                    <td>${agency.name}</td>
                    <td>${agency.email}</td>
                    <td>${agency.address}</td>
                    <td>${agency.mobile_no}</td>
                    <td>
                        <button class="btn ${statusColor} toggle-status" data-id="${agency.agency_id}">${statusText}</button>
                    </td>
                    <td>
                        <button class="btn btn-warning edit-btn" 
                            data-id="${agency.agency_id}" 
                            data-name="${agency.name}" 
                            data-email="${agency.email}" 
                            data-address="${agency.address}" 
                            data-mobile="${agency.mobile_no}">Edit</button>
                    </td>
                </tr>`;
        });
        $("#agencyTableBody").html(tableBody);
    });
}
