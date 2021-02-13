const setActive = (el, active) => {
    // Get the parent node of the field
    const formField = el.parentNode.parentNode
    if (active) {
        // Activate the input by moving the label upwards
        formField.classList.add('input_text--is_active')
    } else {
        // Return the input label to its original position
        formField.classList.remove('input_text--is_active')
        el.value === '' ? formField.classList.remove('input_text--is_filled') : formField.classList.add('input_text--is_filled')
    }
}
  
// Iterate through every input in the page
[].forEach.call( document.querySelectorAll('input, textarea'), (el) => {
    // When unfocused, move the label to the middle
    el.onblur = () => { setActive(el, false) }
    // When focused, move the label upwards
    el.onfocus = () => { setActive(el, true) }
})

$(function() {
    $('.input_label').click(function() {
        let id = $(this).attr('for');
        console.log(id)
        $('#'+id).select();
    });
});