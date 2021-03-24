$(function() {

    /* Start Recording */
    function startRecording() {

        if( selected_track !== "" ) {

            console.log("Record selected")
        }
    }

    /* Stop Recording */
    function stopRecording() {

        console.log("Stop Recording")
    }

    /* Play Recordings */
    function playRecording() {

        console.log("Playing the Recordings")
    }

    /* Export the Recordings */
    function exportRecording() {

        console.log("Exporting the Recordings")
    }

    /* Going backwards */
    function goBackwards() {

        console.log("Going Backwards")
    }

    /* Going Forward */
    function goForward() {

        console.log("Going Forward")
    }

    /* Listeners */

    // Start Recording Listener
    $("#record").click(startRecording)

    // Stop Recording Listener
    $("#stop").click(stopRecording)

    // Play Recording Listener
    $("#play").click(playRecording)

    // Export Recording Listener
    $("#export").click(exportRecording)

    // Go Backwards Listener
    $("#back").click(goBackwards)

    // Go Forward Listener
    $("#forward").click(goForward)

    // Draggable sections
    $( ".track_section" ).draggable({ axis: "x" })
})