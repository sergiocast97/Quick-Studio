$(function() {

    /* Variables */

    // Get the Project ID
    const project_id = window.location.pathname.split('/')[2]
    
    // List of colours
    const colours = [ "purple", "red", "orange", "yellow", "green", "blue"]

    // Currently Selected track
    let selected_track = ""

    // Toaster settings
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    /* Update the Project Name */
    function updateProjectName() {
        // Register the Enter key
        if (event.keyCode === 13) {

            // Get the Object to Pass
            const passed_data = { name: $("#project_name").text() }

            // Update Project Name via AJAX
            $.ajax({
                // Establish the request type and URL
                type: "POST",
                url: "/project/" + project_id + "/project_name",
                // Establish the type and format of Data
                dataType: "json",
                data: passed_data,
                // Update the Names
                success: function(response, status, http) {
                    if (response) {

                        document.title = response.project_name + " - Quick Studio"
                        $("#project_name").text(response.project_name)
                        console.log(response.message)
                        toastr.success(response.message, "Success")
                    }
                }
            })
        }
    }

    /* Add new track */
    function addTrack() {

        // Get the Object to Pass
        const passed_data = { track_name: "Track " + ( $('.track').length + 1) }

        // Add Via Ajax
        $.ajax({
            // Establish the request type and URL
            type: "POST",
            url: "/project/" + project_id + "/add_track",
            // Establish the type and format of Data
            dataType: "json",
            data: passed_data,
            // Update the Names
            success: function(response, status, http) {
                if (response) {

                    // Log the Success
                    console.log(response.message)
                    toastr.success(response.message, "Success")

                    // Append the HTML
                    $(".track_list").append(
                        `<div class="track ${ response.track_colour }" id="${ response.track_id }">` +
                            `<div class="track_header">` +
                                `<div class="track_colour ${ response.track_colour }"></div>` +
                                `<div class="track_name" contenteditable="true">${ response.track_name }</div>` +
                            `</div>` +
                            `<div class="track_volume">` +
                                `<div class="slider track_volume_slider">` +
                                    `<input type="range" id="slider_example" name="slider_example" min="0" max="1" step="0.01">` +
                                `</div>` + 
                            `</div>` +
                            `<div class="track_control">` +
                            `</div>` + 
                        `</div>`
                    )
                    $(".recording_track_list").append(
                        `<div class="recording_track" id="${ response.track_id }"></div>`
                    )
                    
                    // Add the listeners
                    $(".track_colour").click(updateTrackColour)
                    $(".track_name").keyup(updateTrackName)
                    $(".track").click(selectTrack)
                }
            }
        })
    }

    /* Delete Track */
    function deleteTrack() {
        if( selected_track !== "" ){

            // Get the Object to Pass
            const passed_data = { track_id: selected_track }

            // Add Via Ajax
            $.ajax({
                // Establish the request type and URL
                type: "DELETE",
                url: "/project/" + project_id + "/delete_track",
                // Establish the type and format of Data
                dataType: "json",
                data: passed_data,
                // Update the Names
                success: function(response, status, http) {
                    if (response) {

                        // Log the Success
                        console.log(response.message)
                        toastr.success(response.message, "Success")

                        // Remove divs
                        $( ".track#" + selected_track ).remove();
                        $( ".recording_track#" + selected_track ).remove();
                    }
                }
            })
        }
    }

    /* Update Track name */
    function updateTrackName() {
        // Register the Enter key
        if (event.keyCode === 13) {

            // Get the track ID
            let track_id = $(this).parent().parent().attr('id')

            // Get the Object to Pass
            const passed_data = {
                track_id: track_id,
                name: $(`#${ track_id } .track_name`).text()
            }

            // Update Project Name via AJAX
            $.ajax({
                // Establish the request type and URL
                type: "POST",
                url: "/project/" + project_id + "/track_name",
                // Establish the type and format of Data
                dataType: "json",
                data: passed_data,
                // Update the Names
                success: function(response, status, http) {
                    if (response) {

                        $(`#${ track_id } .track_name`).text(response.track_name)
                        console.log(response.message)
                        toastr.success(response.message, "Success")
                    }
                }
            })
        }
    }

    /* Update track colour */
    function updateTrackColour() {

        // Get the ID of the track
        let track_id = $(this).parent().parent().attr('id')

        // Current colour and New Colour names
        let current_colour = $(this).attr('class').split(' ')[1]
        let new_colour = colours[(colours.indexOf(current_colour)+1) % colours.length]

        // Get the Object to Pass
        const passed_data = {
            track_id: track_id,
            track_colour: new_colour
        }

        // Update Project Colour via AJAX
        $.ajax({
            // Establish the request type and URL
            type: "POST",
            url: "/project/" + project_id + "/track_colour",
            // Establish the type and format of Data
            dataType: "json",
            data: passed_data,
            // Update the Names
            success: function(response, status, http) {
                if (response) {

                    console.log(response.message)
                    console.log(`Current Colour: ${ current_colour }, New Colour: ${ response.new_colour }`)

                    // Replace the track dot colour
                    $(`#${ track_id } .track_colour`).removeClass(current_colour).addClass(response.new_colour)

                    // Replace the track border colour
                    $('#' + track_id).removeClass(current_colour).addClass(response.new_colour)

                    // Replace the recording colour
                    $('.recording_track#' + track_id).children().removeClass(current_colour).addClass(response.new_colour)
                }
            }
        })
    }
    
    /* Select Track */
    function selectTrack() {

        // Remove a previous selected track
        if( selected_track !== "") $(".track#" + selected_track).removeClass("selected")

        // Replace the selected track
        selected_track = $(this).attr('id')
        console.log(selected_track)
        
        // Add the selected track
        $(".track#" + selected_track).addClass("selected")        
    }

    /* Deselect track */
    function deselectTrack() {

        // Remove a previous selected track
        if( selected_track !== "" ) $(".track#" + selected_track).removeClass("selected")

        // Replace the selected track
        selected_track = ""
    }

    /* Select Recording */
    function selectRecording() {

    }

    /* Delete Recording */
    function deleteRecording() {

    }

    /* Delete Project */
    function deleteProject() {
        
        $.ajax({
            // Establish the request type and URL
            type: "DELETE",
            url: "/project/" + project_id + "/delete_project",
            // Establish the type and format of Data
            dataType: "json",
            data: {},
            // Update the Names
            success: function(response, status, http) {
                if (response) {
                    
                    // Log the Success
                    console.log(response.message)
                    window.location.href = "/";
                }
            }
        })
    }

    /* Listeners */

    // Project name listener
    $("#project_name").keyup(updateProjectName)

    // Add Track listener
    $("#add_track" ).click(addTrack)

    // Add Track listener
    $("#delete_track" ).click(deleteTrack)

    // Track Name Listener
    $(".track_name").keyup(updateTrackName)

    // Track Colour Listener
    $(".track_colour").click(updateTrackColour)

    // Select Track Listener
    $(".track").click(selectTrack)

    // Select Recording Listener
    $(".recording").click(selectRecording)

    // Select Recording Listener
    $("#delete_recording").click(deleteRecording)

    // Deselect Track Listener
    $(".app_main_track_area").click(deselectTrack)

    // Delete Project
    $("#delete_project" ).click(deleteProject)
})