import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
    tranVisible: false,
    selectedParty: { id: '', name: '' },
    edit: false,
    oldInvoices: [],
    id: '',
    payType: 'Recievable',
    partytype: 'client',
    invoiceCurrency: 'PKR',
    invoices: [],
};

export const paymentReceiptSlice = createSlice({
    name: 'paymentReceipt',
    initialState,
    reducers: {
        setTranVisible: (state, action) => {
            state.tranVisible = action.payload;
        },
        setSelectedParty: (state, action) => {
            state.selectedParty = action.payload;
        },
        setEdit: (state, action) => {
            state.edit = action.payload;
        },
        setOldInvoices: (state, action) => {
            state.oldInvoices = action.payload;
        },
        setInvoices: (state, action) => {
            state.oldInvoices = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
        setPayType: (state, action) => {
            state.payType = action.payload;
        },
        setPartyType: (state, action) => {
            state.partytype = action.payload;
        },
        setInvoiceCurrency: (state, action) => {
            state.invoiceCurrency = action.payload;
        },
    },
});

export const { 
    setTranVisible, 
    setSelectedParty, 
    setEdit, 
    setOldInvoices, 
    setInvoices,
    setId, 
    setPayType, 
    setPartyType, 
    setInvoiceCurrency 
} = paymentReceiptSlice.actions;

export default paymentReceiptSlice.reducer;
