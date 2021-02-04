const setActive = (el, active) => {

    const formField = el.parentNode.parentNode
    
    if (active) {

        formField.classList.add('input_text--is_active')

    } else {

        formField.classList.remove('input_text--is_active')
        el.value === '' ? formField.classList.remove('input_text--is_filled') : formField.classList.add('input_text--is_filled')

    }
}
  
[].forEach.call(

    document.querySelectorAll('input, textarea'), (el) => {

        el.onblur = () => {
            setActive(el, false)
        }

        el.onfocus = () => {
            setActive(el, true)
        }
    }
)