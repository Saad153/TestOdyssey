import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

// Initial state based on the provided structure
const initialState = {
  id: '',
  oldVouchers: false,
  oldVouchersList: [],
  records: [],
  voucherHeads: [],
  edit: false,
  oldBills: false,
  oldrecords: [],
  load: false,
  visible: false,
  glVisible: false,
  deleteVisible: false,
  searchTerm: '',
  tranVisible: false,
  search: '',
  selectedParty: { id: '', name: '' },
  payType: 'Recievable',
  payTypeByDifference: 'Recievable',
  partyType: 'client',
  invoiceCurrency: 'PKR',
  partyOptions: [],
  createdAt: '',
  invoices: [],
  load: false,
  autoOn: false,
  auto: '0',
  exRate: '1',
  manualExRate: '1',
  transaction: 'Cash',
  subType: 'Cheque',
  onAccount: 'Client',
  variable: '',
  drawnAt: '',
  accounts: [
    {
      Parent_Account: { CompanyId: 1, title: '', Account: {} },
      title: '',
    },
  ],
  checkNo: '',
  checkDate: moment(),
  date: moment(),
  bankCharges: 0.0,
  gainLoss: 'Gain',
  gainLossAmount: 0.0,
  taxAmount: 0.0,
  isPerc: false,
  accountsLoader: false,
  taxPerc: 0.0,
  finalTax: 0.0,
  indexes: [],
  partyAccountRecord: {},
  payAccountRecord: {},
  taxAccountRecord: {},
  bankChargesAccountRecord: {},
  gainLossAccountRecord: {},
  totalrecieving: 0.0,
  transactionCreation: [],
  activityCreation: [],
  transLoad: false,
  invoiceLosses: [],
};

// Create slice
export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    receiving: (state, action) => {
      state.invoices = state.invoices.map((invoice) => {
        invoice.receiving = action.payload.receiving;
        return invoice;
      });
    },
    set: (state, action) => {
      state[action.var] = action.pay;
    },
    setAll: (state, action) => {
      return { ...state, ...action.payload };
    },
    on: (state) => {
      state.visible = true;
    },
    off: (state) => {
      state.visible = false;
    },
    setTranVisible: (state, action) => {
      state.tranVisible = action.payload;
    },
    setSelectedParty: (state, action) => {
      state.selectedParty = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
    setOldVouchers: (state, action) => {
      state.oldVouchers = action.payload;
    },
    setOldVouchersList: (state, action) => {
      state.oldVouchersList = action.payload;
    },
    setVoucherHeads: (state, action) => {
      state.voucherHeads = action.payload;
    },
    setPayType: (state, action) => {
      state.payType = action.payload;
    },
    setPartyType: (state, action) => {
      state.partyType = action.payload;
    },
    setInvoiceCurrency: (state, action) => {
      state.invoiceCurrency = action.payload;
    },
    setPartyOptions: (state, action) => {
      state.partyOptions = action.payload;
    },
    setManualExRate: (state, action) => {
      state.manualExRate = action.payload;
    },
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    },
    setSubType: (state, action) => {
      state.subType = action.payload;
    },
    setOnAccount: (state, action) => {
      state.onAccount = action.payload;
    },
    setDrawnAt: (state, action) => {
      state.drawnAt = action.payload;
    },
    setCheckNo: (state, action) => {
      state.checkNo = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setBankCharges: (state, action) => {
      state.bankCharges = action.payload;
    },
    setTaxAmount: (state, action) => {
      state.taxAmount = action.payload;
    },
    setPartyAccountRecord: (state, action) => {
      state.partyAccountRecord = action.payload;
    },
    setPayAccountRecord: (state, action) => {
      state.payAccountRecord = action.payload;
    },
    setTaxAccountRecord: (state, action) => {
      state.taxAccountRecord = action.payload;
    },
    setBankChargesAccountRecord: (state, action) => {
      state.bankChargesAccountRecord = action.payload;
    },
    setGainLossAccountRecord: (state, action) => {
      state.gainLossAccountRecord = action.payload;
    },
  },
});

// Export actions
export const { 
  receiving,
  set,
  setAll,
  on,
  off,
  setTranVisible,
  setSelectedParty,
  setEdit,
  setOldVouchers,
  setOldVouchersList,
  setVoucherHeads,
  setPayType,
  setPartyType,
  setInvoiceCurrency,
  setPartyOptions,
  setManualExRate,
  setTransaction,
  setSubType,
  setOnAccount,
  setDrawnAt,
  setCheckNo,
  setDate,
  setBankCharges,
  setTaxAmount,
  setPartyAccountRecord,
  setPayAccountRecord,
  setTaxAccountRecord,
  setBankChargesAccountRecord,
  setGainLossAccountRecord
} = recordsSlice.actions;

// Export reducer
export default recordsSlice.reducer;
