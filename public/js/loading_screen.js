// Waits for the whole page to load
window.addEventListener("load", function() {

	const loading_screen = document.querySelector(".loading_screen");
	
    // Adds the animation class, in order to hide it
    if(loading_screen != null) {

    	var d = new Date();
		d.setTime(d.getTime() + 1 * 3600 * 1000);
		var expires = "expires="+ d.toUTCString();
		document.cookie = "splashscreen" + "=" + "hidden" + ";" + expires + ";path=/";
    	
	    setTimeout(function(){
	        loading_screen.className += " hidden";
	    }, 250);
	}
});
