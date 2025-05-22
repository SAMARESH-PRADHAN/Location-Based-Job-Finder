$(document).ready(function () {
    // Load header
    $("#header").load("header.html", function () {
      $.getScript("js/header.js");
    });
  
    $("#footer").load("footer.html");
    $("#header").css("background", "none");
  });

  
function loadPage(page) {
    fetch(page)
      .then(response => response.text())
      .then(data => {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = data;

        // Remove previous dynamic scripts
        document.querySelectorAll(".dynamic-script").forEach(script => script.remove());

        // Execute any new inline or external scripts
        const scripts = mainContent.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
          const newScript = document.createElement("script");
          if (scripts[i].src) {
            newScript.src = scripts[i].src;
            newScript.classList.add("dynamic-script");
          } else {
            newScript.text = scripts[i].text;
          }
          document.body.appendChild(newScript);
        }

        // Reload Bootstrap if needed
        loadExternalScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js");

        if (page === "locationmanagment.html") {
          loadExternalScript("js/locationmanagement.js");
        }
      })
      .catch(error => console.error("Error loading the page:", error));
  }

  function loadExternalScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.classList.add("dynamic-script");
    document.body.appendChild(script);
  }




 
