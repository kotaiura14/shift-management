const initialState = [];

const shiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SHIFT':
      return [...state, action.payload];
    default:
      return state;
  }
};

export default shiftReducer;
