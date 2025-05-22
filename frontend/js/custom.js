// (function () {
//   var year = new Date().getFullYear();
//   document.querySelector("#currentYear").innerHTML = year;
// })();

// let scrollTopBtn = document.getElementById("scrollTopBtn");

// window.onscroll = function() {
//   if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
//       scrollTopBtn.style.display = "block";
//   } else {
//       scrollTopBtn.style.display = "none";
//   }
// };

// function scrollToTop() {
//   window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//   });
// }

// $(document).ready(function (){
//   $("#signupForm").submit(function (event) {
//       event.preventDefault();

//       var full_name = $("#signupFullname").val();
//       var email = $("#signupEmail").val();
//       var mobile_no = $("#signupNumber").val();
//       var address = $("#signupAddress").val();
//       var password = $("#signupPassword").val();
//       var confirmPassword = $("#signupConfirmPassword").val();
//       var role_id = $("input[name='role']:checked").val(); // Get selected role value


      
//       if (full_name === "") {
//           alert("Error: Please enter your Full Name.");
//           return false;
//       } else if (email === "") {
//           alert("Error: Please enter your Email.");
//           return false;
//       } else if (mobile_no === "") {
//           alert("Error: Please enter your mobile number.");
//           return false;
//       } else if (address === "") {
//           alert("Error: Please enter your Address.");
//           return false;
//       } else if (password === "") {
//           alert("Error: Please enter your password.");
//           return false;
//       } else if (confirmPassword === "") {
//           alert("Error: Please confirm your password.");
//           return false;
//       } else if (!role_id) {
//           alert("Error: Please select a role.");
//           return false;
//       }

//       var user_emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//       if (!email.match(user_emailRegex)) {
//           alert("Error: Enter a valid Email.");
//           return false;
//       }

//       var mobileRegex = /^[0-9]{10}$/;
//       if (!mobile_no.match(mobileRegex)) {
//           alert("Error: Invalid mobile number. Please enter a 10-digit number.");
//           return false;
//       }

//       var user_passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z\d!@#$%^&]{6,}$/;
//       if (!password.match(user_passwordRegex)) {
//           alert("Error: Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
//           return false;
//       }

//       if (password !== confirmPassword) {
//           alert("Error: Passwords do not match.");
//           return false;
//       }
      
//       submitForm();
//   });

//   function submitForm() {
//       var full_name = $("#signupFullname").val();
//       var email = $("#signupEmail").val();
//       var mobile_no = $("#signupNumber").val();
//       var address = $("#signupAddress").val();
//       var password = $("#signupPassword").val();
//       var role_id = $("input[name='role']:checked").val(); // Get selected role value


//       var data = {
//           "full_name": full_name,
//           "email": email,
//           "mobile_no": mobile_no,
//           "address": address,
//           "password": password,
//           "role_id": role_id 
//       };

//       $.ajax({
//           type: "POST",
//           url: "http://127.0.0.1:5000/registration",
//           contentType: "application/json",
//           data: JSON.stringify(data),
//           success: function (response) {
//               alert("Success: Registration successful!");
//               $("#exampleModalToggle2").modal("hide");
//               $("#exampleModalToggle").modal("show");
//           },
//           error: function (xhr, status, error) {
//               console.error("Error:", error);
//               alert("Error: An error occurred. Please try again later.");
//           }
//       });
//   }

// });

// $(document).ready(function () {
//     $("#loginForm").submit(function (event) {
//         event.preventDefault();
        
//         let userEmail = $("#loginEmail").val().trim();
//         let userPassword = $("#loginPassword").val().trim();

//         if (!userEmail || !userPassword) {
//             alert("Please enter email and password!");
//             return;
//         }

//         $.ajax({
//             url: "http://127.0.0.1:5000/login",
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify({ email: userEmail, password: userPassword }),
//             success: function (response) {

//                 // ✅ Store user details manually in localStorage
//                 localStorage.setItem("user_id", response.user_id);
//                 localStorage.setItem("name", response.name);
//                 localStorage.setItem("role_id", response.role_id);
//                 alert("sucessfull");

//                 // ✅ If user is an agency, store `agency_id`
//                 if (parseInt(response.role_id) === 3 && response.agency_id) {
//                     localStorage.setItem("agency_id", response.agency_id);
//                 }
                
                
//                 // ✅ Redirect only if role_id is valid
//                 if ([1, 2, 3].includes(parseInt(response.role_id))) {
//                     window.location.href = "home.html"; 
//                 } else {
//                     alert("Invalid role detected. Please contact support.");
//                 }
//             },
//             error: function (xhr) {
//                 alert(xhr.responseJSON ? xhr.responseJSON.message : "Login failed. Please try again.");
//             }
//         });
//     });
// });



(function () {
    var year = new Date().getFullYear();
    document.querySelector("#currentYear").innerHTML = year;
  })();
  
  let scrollTopBtn = document.getElementById("scrollTopBtn");
  
  window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  };
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  $(document).ready(function () {
    $("#signupForm").submit(function (event) {
      event.preventDefault();
  
      var full_name = $("#signupFullname").val();
      var email = $("#signupEmail").val();
      var mobile_no = $("#signupNumber").val();
      var address = $("#signupAddress").val();
      var password = $("#signupPassword").val();
      var confirmPassword = $("#signupConfirmPassword").val();
      var role_id = $("input[name='role']:checked").val();
  
      if (full_name === "") {
        Swal.fire("Error", "Please enter your Full Name.", "error");
        return false;
      } else if (email === "") {
        Swal.fire("Error", "Please enter your Email.", "error");
        return false;
      } else if (mobile_no === "") {
        Swal.fire("Error", "Please enter your mobile number.", "error");
        return false;
      } else if (address === "") {
        Swal.fire("Error", "Please enter your Address.", "error");
        return false;
      } else if (password === "") {
        Swal.fire("Error", "Please enter your password.", "error");
        return false;
      } else if (confirmPassword === "") {
        Swal.fire("Error", "Please confirm your password.", "error");
        return false;
      } else if (!role_id) {
        Swal.fire("Error", "Please select a role.", "error");
        return false;
      }
  
      var user_emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email.match(user_emailRegex)) {
        Swal.fire("Error", "Enter a valid Email.", "error");
        return false;
      }
  
      var mobileRegex = /^[0-9]{10}$/;
      if (!mobile_no.match(mobileRegex)) {
        Swal.fire("Error", "Invalid mobile number. Please enter a 10-digit number.", "error");
        return false;
      }
  
      var user_passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z\d!@#$%^&]{6,}$/;
      if (!password.match(user_passwordRegex)) {
        Swal.fire("Error", "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.", "error");
        return false;
      }
  
      if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match.", "error");
        return false;
      }
  
      submitForm();
    });
  
    function submitForm() {
      var full_name = $("#signupFullname").val();
      var email = $("#signupEmail").val();
      var mobile_no = $("#signupNumber").val();
      var address = $("#signupAddress").val();
      var password = $("#signupPassword").val();
      var role_id = $("input[name='role']:checked").val();
  
      var data = {
        "full_name": full_name,
        "email": email,
        "mobile_no": mobile_no,
        "address": address,
        "password": password,
        "role_id": role_id
      };
  
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/registration",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          $("#exampleModalToggle2").modal("hide");
          setTimeout(() => {
            Swal.fire("Success", "Registration successful!", "success");
            $("#exampleModalToggle").modal("show");
          }, 500);
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
          Swal.fire("Error", "An error occurred. Please try again later.", "error");
        }
      });
    }
  });
  
  $(document).ready(function () {
    $("#loginForm").submit(function (event) {
      event.preventDefault();
  
      let userEmail = $("#loginEmail").val().trim();
      let userPassword = $("#loginPassword").val().trim();
  
      if (!userEmail || !userPassword) {
        Swal.fire("Error", "Please enter email and password!", "error");
        return;
      }
  
      $.ajax({
        url: "http://127.0.0.1:5000/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: userEmail, password: userPassword }),
        success: function (response) {
          localStorage.setItem("user_id", response.user_id);
          localStorage.setItem("name", response.name);
          localStorage.setItem("role_id", response.role_id);
  
          if (parseInt(response.role_id) === 3 && response.agency_id) {
            localStorage.setItem("agency_id", response.agency_id);
          }
  
          if ([1, 2, 3].includes(parseInt(response.role_id))) {
            $("#exampleModalToggle").modal("hide");
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              window.location.href = "home.html";
            });
          } else {
            Swal.fire("Error", "Invalid role detected. Please contact support.", "error");
          }
        },
        error: function (xhr) {
          Swal.fire("Login Failed", xhr.responseJSON ? xhr.responseJSON.message : "Please try again.", "error");
        }
      });
    });
  });
  