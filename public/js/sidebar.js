$(function() {

    // Current Page
    let currentPage

    // Get the first section of the path
    switch(window.location.pathname.split('/')[1]) {
        case '' : currentPage = 'projects'; break;
        case 'project' : currentPage = 'projects'; break; 
        case 'bandmates' : currentPage = 'bandmates'; break;
        case 'settings' : currentPage = 'settings'; break;
        case 'test' : currentPage = 'test'; break;
        default: currentPage = 'none';
    }

    // Add class to the right sidebar item
    $('.nav_item#'+ currentPage ).addClass('active')
})