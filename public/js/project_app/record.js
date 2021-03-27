$(function() {

    /* Listeners */

    // Start Recording Listener
    //$("#record").click(startRecording)

    // Stop Recording Listener
    //$("#stop").click(stopRecording)

    // Play Recording Listener
    //$("#play").click(playRecording)

    // Export Recording Listener
    $("#export").click(exportRecording)

    // Go Backwards Listener
    $("#back").click(goBackwards)

    // Go Forward Listener
    $("#forward").click(goForward)

    // Draggable sections
    $( ".track_section" ).draggable({ axis: "x" })

    /* Preparing the recording */

    // WebkitURL is deprecated but nevertheless
    URL = window.URL || window.webkitURL;

    let gumStream   // Stream from getUserMedia()
    let recorder    // MediaRecorder object
    let chunks = [] // Array of chunks of audio data from the browser
    let extension

    let recordButton = $("#record")
    let stopButton = $("#stop")
    let pauseButton = $("#pause")

    // Add events to those 2 buttons
    recordButton.click(startRecording)
    stopButton.click(stopRecording)
    pauseButton.click(pauseRecording)

    // True on Chrome, False on Firefox
    console.log("audio/webm:"+MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
    // False on Chrome, True on Firefox
    console.log("audio/ogg:"+MediaRecorder.isTypeSupported('audio/ogg;codecs=opus'))

    // Select the audio format
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))extension="webm"
    else extension="ogg"

    /* Functions */

    // Start Recording
    function startRecording() {

        // Only if a track is selected
        if(selected_track != "") {

            console.log("recordButton clicked")
        
            // Audio only
            var constraints = {audio: true}
        
            // Disable recording until media is found
            recordButton.disabled = true
            stopButton.disabled = false
            pauseButton.disabled = false
        
            // Get User Media
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

                console.log("getUserMedia() success, stream created, initializing MediaRecorder");

                //  assign to gumStream for later use
                gumStream = stream

                var options = {
                    audioBitsPerSecond :  256000,
                    videoBitsPerSecond : 2500000,
                    bitsPerSecond:       2628000,
                    mimeType : 'audio/'+extension+';codecs=opus'
                }
        
                // Create the MediaRecorder object
                recorder = new MediaRecorder(stream, options);
        
                // When data becomes available add it to our array of audio data
                recorder.ondataavailable = function(e){

                    console.log("recorder.ondataavailable:" + e.data);
                    console.log("recorder.audioBitsPerSecond:" + recorder.audioBitsPerSecond)
                    console.log("recorder.videoBitsPerSecond:" + recorder.videoBitsPerSecond)
                    console.log("recorder.bitsPerSecond:" + recorder.bitsPerSecond)

                    // Add stream data to chunks
                    chunks.push(e.data);

                    // If recorder is 'inactive' then recording has finished
                    if (recorder.state == 'inactive') {

                    // Convert stream data chunks to a 'webm' audio format as a blob
                    const blob = new Blob(chunks, { type: 'audio/'+extension, bitsPerSecond:128000})
                    createDownloadLink(blob)
                    }
                };
        
                // Error
                recorder.onerror = function(e){
                    console.log(e.error);
                }
        
                // Start recording using 1 second chunks
                // Chrome and Firefox will record one long chunk if you do not specify the chunck length
                recorder.start(1000)
                //recorder.start()

            }).catch(function(err) {

                // Enable the record button if getUserMedia() fails
                recordButton.disabled = false;
                stopButton.disabled = true;
                pauseButton.disabled = true
            })
        } else {
            console.log("No track selected")
        }
    }

    // Pause Recording
    function pauseRecording(){

        console.log("pauseButton clicked recorder.state=",recorder.state );

        // If recording, Pause
        if (recorder.state=="recording"){

            recorder.pause()
            // Update the button or something

        // If already paused, Resume
        } else if (recorder.state=="paused"){

            recorder.resume();
            // Update Button or something
    
        }
    }

    // Stop Recording
    function stopRecording() {

        console.log("stopButton clicked");
    
        // Disable the stop button, Enable the record too allow for new recordings
        stopButton.disabled = true
        recordButton.disabled = false
        pauseButton.disabled = true
    
        // Reset button just in case the recording is stopped while paused
        pauseButton.innerHTML="Pause";
        
        // Tell the recorder to stop the recording
        recorder.stop();
    
        // Stop microphone access
        gumStream.getAudioTracks()[0].stop();
    }

    // Create Download Link
    function createDownloadLink(blob) {
	
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');
    
        // Add controls to the <audio> element
        au.controls = true;
        au.src = url;
    
        // Link the a element to the blob
        link.href = url;
        link.download = new Date().toISOString() + '.'+extension;
        link.innerHTML = link.download;
    
        // Add the new audio and a elements to the li element
        li.appendChild(au);
        //li.appendChild(link);
    
        // Add the recording
        $('.recording_track#'+selected_track ).append(
            `<div class="track_section" start="0" duration="1" >` +
                li.innerHTML +
            `</div>`
        )
    }

    // Play Recordings
    function playRecording() {

        console.log("Playing the Recordings")

        var audio = new Audio( $(".track_section audio").attr("src") )
        audio.play()
    }

    // Export the Recordings
    function exportRecording() {

        console.log("Exporting the Recordings")
    }

    // Going backwards
    function goBackwards() {

        console.log("Going Backwards")
    }

    // Going Forward
    function goForward() {

        console.log("Going Forward")
    }
})