import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import tabsReducer from './tabs/tabSlice';
import companyReducer from './company/companySlice';
import blCreationReducer from './BlCreation/blCreationSlice';
import persistValuesReducer from './persistValues/persistValuesSlice';
import { seJobValues } from './apis/seJobValues';
import filterValuesReducer from './filters/filterSlice';
import ledgerReducer from './ledger/ledgerSlice';
import invoiceReducer from './invoice/invoiceSlice';
import profitLossReducer from './profitLoss/profitLossSlice'
import openingInvoiceSlice from './openingInvoices/openingInvoicesSlice';
import paymentRecieptSlice from './paymentReciept/paymentRecieptSlice';
import jobSlice from './Job/jobSlice';
import voucherSlice from './vouchers/voucherSlice';
import partiesReducer from './parties/partiesSlice';
export const store = configureStore({
  reducer: {
    [seJobValues.reducerPath]: seJobValues.reducer,
    counter: counterReducer,
    filterValues:filterValuesReducer,
    company: companyReducer,
    ledger: ledgerReducer,
    invoice: invoiceReducer,
    profitloss:profitLossReducer,
    tabs: tabsReducer,
    blCreationValues: blCreationReducer,
    persistValues: persistValuesReducer,
    openingInvoice:openingInvoiceSlice,
    paymentReciept:paymentRecieptSlice,
    job:jobSlice,
    vouchers:voucherSlice,
    parties: partiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seJobValues.middleware),
})