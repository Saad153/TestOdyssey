import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    
};

export const jobSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setField(state, action) {
        const { field, value } = action.payload;
        if (field in state) {
          state[field] = value;
        } else {
          console.warn(`Job Field "${field}" does not exist in the state.`);
        }
      },
    setType(state, action) {
      state.type = action.payload;
    },
    setFullJobState(state, action) {
      return { ...initialState, ...action.payload };
    },
    setPayType(state, action) {
      state.payType = action.payload;
    },
    resetJobState(state, action) {
      console.log("reset")
      return initialState;
      // state = initialState
    },
  },
});

export const { setField, resetState, setFullJobState } = jobSlice.actions;

export default jobSlice.reducer;
