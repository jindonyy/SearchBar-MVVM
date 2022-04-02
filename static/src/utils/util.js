export const debounce = (() => {
  let timerID;

  return (fn, ms) => {
    if (timerID) clearTimeout(timerID);
    timerID = setTimeout(fn, ms);
  };
})();
