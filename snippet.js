// works great on about:dino

// 1. save this file to your snippets 
// 2. load about:dino
// 3. rnable "Emulate focused page" in DevTools settings
// 4. evaluate the snippet
// 5. hit up arrow to trigger the game
// 6. find 'controller' div in Elements panel, toggle styles to perform action
// 7. profit

const DEBUG = false;

(function () {
  if (performance.now.toString() === "function now() { [native code] }") {
    perfnow = performance.now;
    // slow down performance.now so the dino game is Slooooooooww
    performance.now = (...args) => perfnow.call(performance) / 2.5;
  }

  if (DEBUG) {
    window.outascii = window.outascii || document.createElement('textarea');
    outascii.style.cssText = `
  position: absolute;
  top: 0px;
  font-size: 8px;
  width: 760px;
  height: 363px;
  z-index: 10;
  font-family: monospace;
  background: #000000e0;
  color: #0bff0b;
  right: 0;
  `;
    document.body.append(outascii);
  }

  if (!DEBUG) {
    document.body.style.opacity = '0';
  }

  let prevFrame = '';
  let controllerEl = null;
  const back = document.createElement('canvas');
  const backcontext = back.getContext('2d');
  const ascii = '@GLftli;:,.  '
    .split()
    .reverse()
    .join('');

  const sourceCanvas = document.querySelector('canvas');

  const scalingFactor = 6; // bigger is smaller.
  const refreshRateInMs = 175;

  function domReady() {
    controllerEl = document.createElement('div');
    controllerEl.classList.add('controller');
    document.body.appendChild(controllerEl);
    controllerEl.style['border-top'] = 'solid';
    controllerEl.style['border-bottom'] = 'solid';

    drawAscii(
      sourceCanvas,
      backcontext,
      sourceCanvas.offsetWidth / scalingFactor,
      sourceCanvas.offsetHeight / scalingFactor
    );
  }

  function handleInput() {
    let newBorderTop = controllerEl.style['border-top'];
    let newBorderBottom = controllerEl.style['border-bottom'];

    // space
    if (newBorderTop === '') {
      newBorderTop = 'solid';
      document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 }));
      document.dispatchEvent(new KeyboardEvent('keyup', { 'keyCode': 32, 'which': 32 }));
    }

    // down
    if (newBorderBottom === '') {
      newBorderBottom = 'solid';
      document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 40, 'which': 40 }));
      setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'keyCode': 40, 'which': 40 }));
      }, 300);
    }

    // Set the properties in the order which DevTools should display them.
    if (controllerEl.style['border-top'] !== newBorderTop || controllerEl.style['border-bottom'] !== newBorderBottom) {
      controllerEl.style['border-top'] = '';
      controllerEl.style['border-bottom'] = '';
      controllerEl.style['border-top'] = newBorderTop;
      controllerEl.style['border-bottom'] = newBorderBottom;
    }
  }

  function drawAscii(sourceCanvas, bc, w, h) {
    handleInput();

    bc.fillStyle = 'white';
    bc.fillRect(0, 0, w, h);
    bc.drawImage(sourceCanvas, 0, 0, w, h);

    // Grab the pixel data from the backing canvas
    var data = bc.getImageData(0, 0, w, h).data;

    var chars = '',
      px = 0,
      pxlen = w * h * 4;

    // Loop through the pixels
    for (var ih = 0; ih < h; ih++) {
      for (var iw = 0; iw < w; iw++) {
        // Convert the color into an appropriate character based on luminance
        // magic numbers depend on ascii string length of 13, so scale accordingly
        chars += ascii[(62 * data[px++] + 123 * data[px++] + 23 * data[px++]) >>> 12];
        px++; // don't need alpha
      }
      chars += '\n';
    }

    frame = `/*
${chars}
*/
//# sourceURL=foo.js`;
    if (prevFrame !== frame) {
      prevFrame = frame;
      eval(frame);
    }

    if (DEBUG) {
      // Write the char data into the output divs
      outascii.textContent = chars;
    }

    // Start over!
    setTimeout(_ => {
      drawAscii(sourceCanvas, bc, w, h);
    }, refreshRateInMs);
  }

  domReady(); // addEventListener('DOMContentLoaded',domReady,false);
})();
