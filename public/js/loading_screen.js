// Waits for the whole page to load
window.addEventListener("load", function() {

	// Selects the loading screen
	const loading_screen = document.querySelector(".loading_screen");
	
    // If the loading screen is found
    if(loading_screen != null) {

		// Once loaded, wait for 250ms and remove screen
	    setTimeout(function(){
	        loading_screen.className += " hidden"
	    }, 250)
	}
})