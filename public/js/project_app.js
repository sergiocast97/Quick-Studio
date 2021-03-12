$(function() {

    // Update the Project Name
    $("#project_name").keyup(function(event) {
        // Register the Enter key
        if (event.keyCode === 13) {

            // Get the Content of the editable div
            let name = $("#project_name").text()
            // Get the ID through the URL
            let id = window.location.pathname.split('/')[2]

            // Update Name via AJAX
            $.ajax({
                // Server URL
                url: "/project/update/" + id,
                // Requets Type
                type: "POST",
                // Data being Passed
                data: "name=" + name,
                // Data that has been returned
                dataType: "text",
                    success: function(response, status, http) {
                        if (response) {
                            
                            // Parse the response from JSON to Js Object
                            const parsed_response = JSON.parse(response);

                            // Log the Success
                            console.log(parsed_response.message)

                            // Update the names
                            document.title = parsed_response.name + " - Quick Studio"
                            $("#project_name").text(parsed_response.name)
                        }
                    }
            });
        }
    })

    // Draggable sections
    $( ".track_section" ).draggable({ axis: "x" });

})