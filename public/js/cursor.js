// Retrieve the cursor
const cursor = document.querySelector('.cursor');

// Follow the mouse
document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
})

// Animate when clicking
document.addEventListener('click', () => {
    // Expand the cursor
    cursor.classList.add("expand")
    // Return to initial size after 0.5s
    setTimeout(() => { cursor.classList.remove("expand") }, 500)
})