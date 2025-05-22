$(document).ready(function () {
    fetchLocations();

    // Open Add Location Modal
    $("#addLocationBtn").click(function () {
        $("#addLocationModal").modal("show");
    });

    // Save Location
    $("#saveLocationBtn").click(function () {
        let locationData = {
            location_name: $("#addLocationName").val(),
            latitude: $("#addLatitude").val(),
            longitude: $("#addLongitude").val(),
        };

        $.ajax({
            url: "http://127.0.0.1:5000/location/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(locationData),
            success: function () {
                alert("Location added successfully!");
                $("#addLocationModal").modal("hide");
                fetchLocations();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Open Edit Modal
    $(document).on("click", ".edit-btn", function () {
        $("#editLocationId").val($(this).data("id"));
        $("#editLocationName").val($(this).data("name"));
        $("#editLatitude").val($(this).data("latitude"));
        $("#editLongitude").val($(this).data("longitude"));
        $("#editLocationModal").modal("show");
    });

    // Update Location
    $("#updateLocationBtn").click(function () {
        let locationId = $("#editLocationId").val();
        let updatedData = {
            location_name: $("#editLocationName").val(),
            latitude: $("#editLatitude").val(),
            longitude: $("#editLongitude").val(),
        };

        $.ajax({
            url: `http://127.0.0.1:5000/location/${locationId}/update`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function () {
                alert("Location updated successfully!");
                $("#editLocationModal").modal("hide");
                fetchLocations();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Fetch and Display Locations
    function fetchLocations() {
        $.get("http://127.0.0.1:5000/locations", function (locations) {
            let tableBody = "";
            locations.forEach((location, index) => {
                let buttonClass = location.is_active ? "btn-danger" : "btn-success";
                let buttonText = location.is_active ? "Deactivate" : "Activate";
    
                tableBody += `
                    <tr>
                        <td>${index+1}</td>
                        <td>${location.location_name}</td>
                        <td>${location.latitude}</td>
                        <td>${location.longitude}</td>
                        <td>
                            <button class="btn btn-warning edit-btn" 
                                data-id="${location.location_id}" 
                                data-name="${location.location_name}" 
                                data-latitude="${location.latitude}" 
                                data-longitude="${location.longitude}">Edit</button>
                            <button class="btn ${buttonClass} toggle-status-btn" 
                                data-id="${location.location_id}" 
                                data-active="${location.is_active}">
                                ${buttonText}
                            </button>
                        </td>
                    </tr>`;
            });
            $("#locationTableBody").html(tableBody);
        });
    }
    

    $(document).on("click", ".toggle-status-btn", function () {
        let button = $(this);
        let locationId = button.data("id");
        let isActive = button.data("active"); // Current status
    
        let newStatus = !isActive; // Toggle status
    
        console.log(`Sending request to toggle status for ID: ${locationId}, New Status: ${newStatus}`);
    
        $.ajax({
            url: `http://127.0.0.1:5000/location/${locationId}/toggle-status`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ is_active: newStatus }),
            success: function () {
                alert(`Location ${newStatus ? "activated" : "deactivated"} successfully!`);
                
                // ✅ Update button text and color immediately
                if (newStatus) {
                    button.removeClass("btn-success").addClass("btn-danger");
                    button.text("Deactivate");
                } else {
                    button.removeClass("btn-danger").addClass("btn-success");
                    button.text("Activate");
                }
                
                // ✅ Update button's data-active attribute
                button.data("active", newStatus);
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });
    
    
});

