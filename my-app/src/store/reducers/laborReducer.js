const initialState = [];

const laborReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LABOR_HOURS':
      return [...state, action.payload];
    default:
      return state;
  }
};

export default laborReducer;
