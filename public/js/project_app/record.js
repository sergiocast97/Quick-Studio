$(function() {

    // Draggable sections
    $( ".track_section" ).draggable({ axis: "x" })

    /* Record Sound */
    $("#record").click(function() {

        if( selected_track !== "" ) {

            console.log("Record selected")

        } else {
            console("Can't record, select a track first!")
        }
    })

    /* Stop Recording */
    $("#stop").click(function() {

        console.log("Recording stopped")
    })

    /* Save Recording */
    $(window).keydown(function(event) {
        // If Control or Command key is pressed and the S key is pressed
        if((event.ctrlKey || event.metaKey) && event.which == 83) {

            // Prevent default Save
            event.preventDefault();

            // Loop through every track
            for(track of $( ".track_list" ).find( ".track" )){
                alert(track.$("track_name").text())
            }

            return false;
        }
    })
})