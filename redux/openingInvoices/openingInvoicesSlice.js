import { createSlice } from '@reduxjs/toolkit'
import { set } from 'js-cookie';
import moment from 'moment';

  const initialState = {
    type: "JI",
    payType: "Recievable",
    operation: "AE",
    currency: "PKR",
    ex_rate: "1",
    party_Id: "",
    party_Name: "",
    paid: "0",
    recieved: "0",
    roundOff: "0",
    total: "0",
    partyType: "client",
    note: "",
    createdAt: moment()
  };

  export const openingInvoiceSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    setType(state, action) {
      state.type = action.payload;
    },
    setPayType(state, action) {
      state.payType = action.payload;
    },
    setOperation(state, action) {
      state.operation = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    setExRate(state, action) {
      state.ex_rate = action.payload;
    },
    setPartyId(state, action) {
      state.party_Id = action.payload;
    },
    setPartyName(state, action) {
      state.party_Name = action.payload;
    },
    setPaid(state, action) {
      state.paid = action.payload;
    },
    setRecieved(state, action) {
      state.recieved = action.payload;
    },
    setRoundOff(state, action) {
      state.roundOff = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setPartyType(state, action) {
      state.partyType = action.payload;
    },
    setNote(state, action) {
      state.note = action.payload;
    },
    setCreatedAt(state, action) {
      state.createdAt = action.payload;
    },
  },
})

export const { setType, setPayType, setOperation, setCurrency, setExRate, setPartyId, setPartyName, setPaid, setRecieved, setRoundOff, setTotal, setPartyType, setNote } = openingInvoiceSlice.actions

export default openingInvoiceSlice.reducer