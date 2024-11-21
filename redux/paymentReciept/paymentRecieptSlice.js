import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

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

export const paymentRecieptSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    receiving(state, action) {
      state.invoices = state.invoices.map((invoice) => ({
        ...invoice,
        receiving: action.payload.receiving,
      }));
    },
    set(state, action) {
      state[action.payload.var] = action.payload.pay;
    },
    setAll(state, action) {
      Object.assign(state, action.payload);
    },
    on(state) {
      state.visible = true;
    },
    off(state) {
      state.visible = false;
    },
  },
});

export const { receiving, set, setAll, on, off } = paymentRecieptSlice.actions;

export default paymentRecieptSlice.reducer;
