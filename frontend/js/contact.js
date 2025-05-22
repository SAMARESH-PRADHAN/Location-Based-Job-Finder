



  $(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();

        let c_name = $("input[placeholder='Full Name']").val();
        let c_email = $("input[placeholder='Email']").val();
        let c_phone = $("input[placeholder='Phone Number']").val();
        let c_text = $("input[placeholder='Message']").val();


        if (c_name === "" || c_email === "" || c_phone === "" || c_text === "") {
            Swal.fire({
                title: "Warning",
                text: "All fields are required!",
                icon: "warning",
                timer: 3000, // 3 seconds
                timerProgressBar: true,
                showConfirmButton: false
              });
              
            return;
        }
        var data = {
            "c_name": c_name,
            "c_email": c_email,
            "c_text": c_text,
            "c_phone": c_phone
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/contact",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    title: "Message Sent!",
                    text: response.message,
                    icon: "success",
                    timer: 3000, // 3 seconds
                    timerProgressBar: true,
                    showConfirmButton: false
                  });
                  
                $("#contactForm")[0].reset();
            },
            error: function (xhr, error) {
                console.error("Error:", error)
                Swal.fire({
                    title: "Oops!",
                    text: (xhr.responseJSON.error || "Something went wrong!"),
                    icon: "error",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                  });
            }
        });
    });
});
