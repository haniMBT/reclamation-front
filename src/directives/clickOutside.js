export const ClickOutside = {
  bind: function (element, binding, vnode) {
    console.log(111, 'Bind')
    element.clickOutsideEvent = function (event) {  //  check that click was outside the el and his children
      if (!(element === event.target || element.contains(event.target))) { // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
        // binding.value(); run the arg
      }
    };
    document.body.addEventListener('click', element.clickOutsideEvent)
  },
  unbind: function (element) {
    console.log(111, 'Unbind')
    document.body.removeEventListener('click', element.clickOutsideEvent)
  }
}
