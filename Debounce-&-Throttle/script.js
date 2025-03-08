console.log('Hello');

/***
 * Debounce Polyfill
 */
const inputEle = document.querySelector('input');

function debounce(fn, delay) {
  let timeout = null;
  function debounced(...args) {
    if (timeout) clearTimeout(timeout);
    const context = this;
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }

  debounced.cancel = function () {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

const handleInput = (e) => {
  console.log(e.target.value);
};

const handleDebouncedInput = debounce(handleInput, 300);
inputEle.addEventListener('input', handleDebouncedInput);

/***
 * Throttle Polyfill
 */

function throttle(fn, limit) {
  let flag = true;
  let timeout = null;
  function throttled(...args) {
    const context = this;
    if (flag) {
      fn.apply(context, args);
      flag = false;
      timeout = setTimeout(() => {
        flag = true;
      }, limit);
    }
  }

  throttled.cancel = function () {
    if (timeout) clearTimeout(timeout);
    flag = true;
    timeout = null;
  };

  return throttled;
}

const handleExpensive = () => {
  console.log('expensive');
};

const handleThrottleFunction = throttle(handleExpensive, 1000);

window.addEventListener('resize', handleThrottleFunction);
