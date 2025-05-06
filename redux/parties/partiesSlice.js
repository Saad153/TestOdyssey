import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    COAId: '',
    accountNo: '',
    accountsMail: '',
    active: true,
    address1: '',
    address2: '',
    bank: '',
    bankAuthorizeDate: '',
    branchCode: '',
    branchName: '',
    city: '',
    coa: {
        code: '',
        id: '',
        parent: {
            code: '',
            id: '',
            subCategory: '',
            title: '',
        },
        parentId: '',
        subCategory: '',
        title: '',
    },
    code: 0,
    createdAt: '',
    createdBy: '',
    currency: 'PKR',
    iban: '',
    id: '',
    ifscCode: 'null',
    infoMail: '',
    micrCode: '',
    mobile1: '',
    mobile2: '',
    name: '',
    ntn: '',
    operations: '',
    person1: '',
    person2: '',
    registerDate: undefined,
    routingNo: '',
    strn: '',
    swiftCode: '',
    telephone1: '',
    telephone2: '',
    types: '',
    updatedAt: '',
    website: '',
    zip: '',
    companyId: '',
    partyType: '',
};

export const partiesSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setField(state, action) {
        const { field, value } = action.payload;
        if (field in state) {
          state[field] = value;
        } else {
          console.warn(`Party Field "${field}" does not exist in the state.`);
        }
      },
      setFullPartyState(state, action) {
        return { ...initialState, ...action.payload };
      },
    resetPartyState(state, action) {
      console.log("reset")
      return {...initialState};
    },
  },
});

export const { setField, setFullPartyState, resetPartyState } = partiesSlice.actions;

export default partiesSlice.reducer;
