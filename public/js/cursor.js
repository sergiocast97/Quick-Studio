// Retrieve the cursor
const cursor = document.querySelector('.cursor')

// Follow the mouse
document.addEventListener('mousemove', e => {

    cursor.style.top = (e.clientY-10) + "px"
    cursor.style.left = (e.clientX-15) + "px"

})

// Animate when clicking
document.addEventListener('click', () => {

    // Expand the cursor
    cursor.classList.add("expand")

    // Return to initial size after 0.5s
    setTimeout(() => { cursor.classList.remove("expand") }, 500)
})