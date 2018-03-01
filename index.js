var debounce = require('debounce');
function always(x) {
  return function() {
    return x;
  };
}

module.exports = function(actionCreator, delay) {
  var lastArgs;

  function thunk(dispatch) {
    dispatch(actionCreator.apply(null, lastArgs));
  }

  const debounced = debounce(thunk, delay);

  return function() {
    lastArgs = [].slice.call(arguments);

    return debounced;
  };
};
