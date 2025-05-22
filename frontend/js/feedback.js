$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });


let selectedRating = 0;

const emojiMap = {
  1: "😡",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "🤩"
};

$(document).ready(function () {
  $(".star").on("mouseover", function () {
    let val = $(this).data("value");
    $(".star").each(function () {
      $(this).toggleClass("hovered", $(this).data("value") <= val);
    });
  });

  $(".star").on("mouseout", function () {
    $(".star").removeClass("hovered");
  });

  $(".star").on("click", function () {
    selectedRating = $(this).data("value");
    $(".star").removeClass("selected");
    $(".star").each(function () {
      if ($(this).data("value") <= selectedRating) {
        $(this).addClass("selected");
      }
    });

    $("#emojiDisplay").html(emojiMap[selectedRating] || "😐");
    $("#emojiDisplay").addClass("animated");
    setTimeout(() => $("#emojiDisplay").removeClass("animated"), 500);
  });

  $("#feedbackForm").on("submit", function (e) {
    e.preventDefault();

    const feedback = $("#feedbackText").val().trim();
    const role_id = parseInt(localStorage.getItem("role_id"));
    const user_id = parseInt(localStorage.getItem("user_id"));
    const agency_id = parseInt(localStorage.getItem("agency_id"));

    if (selectedRating === 0) {
      Swal.fire("Please select a rating", "", "warning");
      return;
    }
    const data = {
        feedback: feedback,
        rating: selectedRating,
        role_id: role_id
    };

    // Include correct ID based on role
    if (role_id === 2) {
        data.user_id = user_id;
    } else if (role_id === 3) {
        data.agency_id = agency_id;
    }

    console.log(data);


    $.ajax({
      url: "http://127.0.0.1:5000/feedback",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (res) {
        Swal.fire("Thank you!", "Your feedback has been submitted.", "success");
        $("#feedbackText").val("");
        $(".star").removeClass("selected");
        selectedRating = 0;
        $("#emojiDisplay").html("😐");
      },
      error: function (err) {
        Swal.fire("Oops!", "Something went wrong. Try again.", "error");
      }
    });
  });
});