import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  type: 'client',
  payType: 'Recievable',
  currency: 'PKR',
  search: '',
  searchAccount: '',
  accounts: [],
  oldVouchers: [],
  oldVouchersList: [],
  selectedAccount: undefined,
  edit: false,
  invoices: [],
  load: false,
  transactionMode: 'Cash',
  receivingAccounts: [],
  receivingAccount: undefined,
  adjustAccounts: [],
  bankChargesAccount: undefined,
  bankChargesAmount: 0.0,
  taxAccount: undefined,
  taxAmount: 0.0,
  taxPercent: 0.0,
  gainLossAccount: undefined,
  gainLossAmount: 0.0,
  subType: 'Cheque',
  autoKnockOff: false,
  percent: false,
  checkNo: "",
  checkDate: moment(),
  date: moment(),
  totalReceivable: 0.0,
  exRate: 1.0,
  modal: false,
  transactions: [],
  onAccount: 'client',
  
};

export const paymentRecieptSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setField(state, action) {
        const { field, value } = action.payload;
        if (field in state) {
          state[field] = value;
        } else {
          console.warn(`Field "${field}" does not exist in the state.`);
        }
      },
    setType(state, action) {
      state.type = action.payload;
    },
    setPayType(state, action) {
      state.payType = action.payload;
    },
  },
});

export const { setField } = paymentRecieptSlice.actions;

export default paymentRecieptSlice.reducer;