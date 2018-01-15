const makeDebounce = require('./index');
const { createStore, applyMiddleware } = require('redux');
const reduxThunk = require('redux-thunk').default;

const configStore = reducer => {
  const store = createStore(reducer, {}, applyMiddleware(reduxThunk));
  return store;
};

const sendTime = () => {
  return {
    type: 'TIME_ACTION',
    payload: Date.now(),
  };
};

const withParams = (a, b, c) => {
  return {
    type: 'WITH_PARAMS',
    payload: a + b + c,
  };
};

const reducer = (state = {}, action) => {
  if (action.type === 'TIME_ACTION') {
    return { time: action.payload };
  }

  if (action.type === 'WITH_PARAMS') {
    return { number: action.payload };
  }

  return state;
};

describe('makeDebounce', () => {
  it('should dispatch', done => {
    const debounced = makeDebounce(sendTime, 100);
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
    const debounced = makeDebounce(sendTime, 100);
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

  it('should carry args', () => {
    const debounced = makeDebounce(withParams, 10);
    const store = configStore(reducer);
    const now = Date.now();

    store.subscribe(() => {
      const { number } = store.getState();

      expect(number).toBe(12);
      done();
    });

    store.dispatch(debounced(1, 2, 3));
    setTimeout(() => {
      store.dispatch(debounced(2, 3, 4));
    }, 9);
    setTimeout(() => {
      store.dispatch(debounced(3, 4, 5));
    }, 18);
  });
});
