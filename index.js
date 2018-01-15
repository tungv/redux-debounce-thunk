var debounce = require('debounce');
function always(x) {
  return function() {
    return x;
  };
}

module.exports = function(actionCreator, delay) {
  function thunk(dispatch) {
    dispatch(actionCreator());
  }

  return always(debounce(thunk, delay));
};
