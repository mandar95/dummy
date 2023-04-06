
export const DropdownNavigator = () => {
  let ul = document.getElementById('drop-down-items__overflow');
  let nodes = Array.from(ul.children)
  let liSelected = document.querySelector('div.drop-down-items__overflow > div.drop-down-items__item--selected');
  let index = nodes.indexOf(liSelected);
  let next;
  setScrollTop(ul, liSelected);

  document.addEventListener('keydown', function (event) {
    let dropdwon = document.getElementsByClassName("custom-drop-down__head--open")
    if (dropdwon.length > 0) {

      let len = nodes.length - 1;
      if (event.which === 40) {
        if (index !== len) {
          index++;
          //down 
          if (liSelected) {
            removeClass(liSelected, 'drop-down-items__item--selected');
            addClass(liSelected, 'drop-down-items__item');
            next = nodes[index];
            if (typeof next !== undefined && index <= len) {

              liSelected = next;
            } else {
              index = 0;
              liSelected = nodes[0];
            }
            addClass(liSelected, 'drop-down-items__item--selected');
            setScrollTop(ul, liSelected)
          }
        }
        else {
          removeClass(liSelected, 'drop-down-items__item--selected');
          index = 0;
          liSelected = nodes[0];
          addClass(liSelected, 'drop-down-items__item--selected');
          setScrollTop(ul, liSelected)
        }
      }
      else if (event.which === 38) {

        //up
        if (liSelected) {
          if (index !== 0) {
            removeClass(liSelected, 'drop-down-items__item--selected');
            addClass(liSelected, 'drop-down-items__item');
            index--;
            next = nodes[index];
            if (typeof next !== undefined && index >= 0) {
              liSelected = next;
            } else {
              index = len;
              liSelected = nodes[len];
            }
            addClass(liSelected, 'drop-down-items__item--selected');
            setScrollTop(ul, liSelected)
          }
        }
        else {
          index = 0;
          liSelected = nodes[len];
          addClass(liSelected, 'drop-down-items__item--selected');
          setScrollTop(ul, liSelected)
        }
      }
      else if (event.which === 13) {
        liSelected.click()
      }
    }
  }, false);

  function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };

  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  };
}
const setScrollTop = (div, selectedItem) => {
  div.scrollTop = 0;
  div.scrollTop = (selectedItem.offsetTop - div.offsetHeight);

}

