import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  id: '',
  jobNo: '',
  jobId: '',
  title: '',
  customerRef: '',
  fileNo: '',
  shipStatus: 'booked',
  teu: 0,
  bkg: 0,
  pcs: 0,
  vol: 0,
  volWeight: 0,
  pol: '',
  pod: '',
  fd: '',
  dg: 'nondg',
  subType: 'fcl',
  billVol: 0,
  shpVol: 0,
  weight: 0,
  weightUnit: '',
  costCenter: 'khi',
  jobType: 'direct',
  jobKind: 'current',
  containers: [],
  carrier: '',
  freightType: 'prepaid',
  nomination: 'freehand',
  transportCheck: false,
  customCheck: false,
  etd: moment(),
  eta: moment(),
  cbkg: 0,
  aesDate: moment(),
  aestime: moment(),
  eRcDate: moment(),
  eRcTime: moment(),
  eRlDate: moment(),
  eRlTime: moment(),
  jobDate: moment(),
  shipDate: moment(),
  doorMove: '',
  cutOffDate: moment(),
  cutOffTime: moment(),
  siCutOffDate: moment(),
  siCutOffTime: moment(),
  vgmCutOffDate: moment(),
  vgmCutOffTime: moment(),
  freightPaybleAt: '',
  terminal: '',
  delivery: '',
  companyId: '',
  pkgUnit: '',
  incoTerms: 'EXW',
  exRate: 0,
  approved: false,
  flightNo: '',
  cwtLine: '',
  cwtClient: '',
  operation: '',
  arrivalDate: moment(),
  arrivalTime: moment(),
  departureDate: moment(),
  departureTime: moment(),
  PartyId: undefined,
  VoyageId: '',
  saleRepresentatorId: '',
  overseasAgentId: '',
  shippingLineId: '',
  localVendorId: '',
  customAgentId: '',
  transporterId: '',
  createdById: '',
  commodityId: '',
  consigneeId: '',
  forwarderId: '',
  airLineId: '',
  shipperId: undefined,
  vesselId: '',
  equipment: [],
  charges_Heads: [],
  charges: [],
  parties: [],
  sr: [],
  notes: [],
  ports: [],

    
};

export const jobSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setJobField(state, action) {
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

export const { setJobField, resetState, setFullJobState } = jobSlice.actions;

export default jobSlice.reducer;
