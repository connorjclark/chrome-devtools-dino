const controllerEl = document.querySelector('.controller');
let i = 0;

let prevFrame = '';
function render() {
  const frame = `/*
${i}
*/
//# sourceURL=foo.js`;
  if (prevFrame !== frame) {
    prevFrame = frame;
    eval(frame);
  }
}

function handleInput() {
  let newLeft = controllerEl.style.left;
  let newRight = controllerEl.style.right;

  if (controllerEl.style.left === '') {
    i--;
    newLeft = '0';
  }
  if (controllerEl.style.right === '') {
    i++;
    newRight = '0';
  }

  // Set the properties in the order which DevTools should display them.
  if (controllerEl.style.left !== newLeft || controllerEl.style.right !== newRight) {
    controllerEl.style.left = '';
    controllerEl.style.right = '';
    controllerEl.style.left = newLeft;
    controllerEl.style.right = newRight;
  }
}

setInterval(() => {
  handleInput();
  render();
}, 200);
