const makeDebounce = require('./index');
const { createStore, applyMiddleware } = require('redux');
const reduxThunk = require('redux-thunk').default;

const configStore = reducer => {
  const store = createStore(reducer, {}, applyMiddleware(reduxThunk));
  return store;
};

const actionCreator = () => {
  return {
    type: 'action',
    payload: Date.now(),
  };
};

const reducer = (state = {}, action) => {
  if (action.type === 'action') {
    return { time: action.payload };
  }

  return state;
};

describe('makeDebounce', () => {
  it('should dispatch', done => {
    const debounced = makeDebounce(actionCreator, 100);
    const store = configStore(reducer);
    const now = Date.now();

    store.subscribe(() => {
      const stateTime = store.getState().time;
      expect(stateTime - now).toBeGreaterThanOrEqual(100);
      expect(stateTime - now).toBeLessThan(110);
      done();
    });

    store.dispatch(debounced());
  });

  it('should debounce', done => {
    const debounced = makeDebounce(actionCreator, 100);
    const store = configStore(reducer);
    const now = Date.now();

    store.subscribe(() => {
      const stateTime = store.getState().time;
      expect(stateTime - now).toBeGreaterThanOrEqual(298);
      expect(stateTime - now).toBeLessThan(308);
      done();
    });

    store.dispatch(debounced());
    setTimeout(() => {
      store.dispatch(debounced());
    }, 99);
    setTimeout(() => {
      store.dispatch(debounced());
    }, 198);
  });
});
