export const debounce = (() => {
  let timerID;

  return (fn, ms) => {
    if (timerID) clearTimeout(timerID);
    timer = setTimeout(fn, ms);
  };
})();
