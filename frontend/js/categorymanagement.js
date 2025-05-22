$(document).ready(function () {
    fetchCategories();

    // Open Add Category Modal
    $("#addCategoryBtn").click(function () {
        $("#addCategoryModal").modal("show");
    });

    // Save Category
    $("#saveCategoryBtn").click(function () {
        let categoryData = { name: $("#addCategoryName").val() };

        $.ajax({
            url: "http://127.0.0.1:5000/category/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(categoryData),
            success: function () {
                alert("Category added successfully!");
                $("#addCategoryModal").modal("hide");
                fetchCategories();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Open Edit Modal
    $(document).on("click", ".edit-btn", function () {
        $("#editCategoryId").val($(this).data("id"));
        $("#editCategoryName").val($(this).data("name"));
        $("#editCategoryModal").modal("show");
    });

    // Update Category
    $("#updateCategoryBtn").click(function () {
        let categoryId = $("#editCategoryId").val();
        let updatedData = { name: $("#editCategoryName").val() };

        $.ajax({
            url: `http://127.0.0.1:5000/category/${categoryId}/update`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function () {
                alert("Category updated successfully!");
                $("#editCategoryModal").modal("hide");
                fetchCategories();
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Delete Category
    $(document).on("click", ".delete-btn", function () {
        let categoryId = $(this).data("id");

        if (confirm("Are you sure you want to delete this category?")) {
            $.ajax({
                url: `http://127.0.0.1:5000/category/${categoryId}/delete`,
                type: "DELETE",
                success: function () {
                    alert("Category deleted successfully!");
                    fetchCategories();
                },
                error: function (xhr) {
                    alert("Error: " + xhr.responseText);
                }
            });
        }
    });
});

// Fetch and Display Categories
function fetchCategories() {
    $.get("http://127.0.0.1:5000/categories", function (categories) {
        let tableBody = "";
        categories.forEach((category, index) => {
            tableBody += `
                <tr>
                    <td>${index+1}</td>
                    <td>${category.category_name}</td>
                    <td>
                        <button class="btn btn-warning edit-btn" 
                            data-id="${category.category_id}" 
                            data-name="${category.category_name}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${category.category_id}">Delete</button>
                    </td>
                </tr>`;
        });
        $("#categoryTableBody").html(tableBody);
    });
}
