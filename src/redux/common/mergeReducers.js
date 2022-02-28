export default function mergeReducers(reducers) {
  return (state, action) => {
    if (!state) {
      return reducers.reduce(
        (acc, cur) => ({ ...acc, ...cur(state, action) }),
        {}
      );
    } else {
      let nextState = state;
      for (const x of reducers) {
        nextState = x(nextState, action);
      }
      return nextState;
    }
  };
}
