import axios from "axios";
import moment from "moment";

function recordsReducer(state, action){
  switch (action.type) {
    case"receiving":{
      return {
        ...state,
        invoices: state.invoices.map((invoice) => {
          invoice.receiving = action.payload.receiving
          return invoice
        }
      )
      }

    }
    case 'set': {
      return { ...state, [action.var]: action.pay } 
    }
    case 'setAll': {
      
      return {
          ...state, ...action.payload
      }
    }
    case 'on': {
      return {
          ...state,
          visible: true,
      }
    }
    case 'off': {
      let returnVal = {
        ...state, visible: false
      };
      return returnVal
    }
    default: return state 
  }
};

const initialState = {
  id:'',
  oldVouchers:false,
  oldVouchersList:[],
  records: [],
  voucherHeads:[],
  edit:false,
  oldBills: false,
  oldrecords: [],
  load:false,
  visible:false,
  glVisible:false,
  deleteVisible:false,
  searchTerm:'',

  tranVisible:false,
  search:"",
  selectedParty:{id:'', name:''},
  payType:'Receivable',
  payTypeByDifference:'Receivable',
  partyType:'client',
  invoiceCurrency:'PKR',
  partyOptions:[],
  createdAt:'',

  invoices: [],
  load: false,
  autoOn:false,
  auto:'0',
  exRate:'1',
  manualExRate:'1',

  transaction :"Cash",
  subType:'Cheque',
  onAccount:'Client',
  variable:"",
  drawnAt:'',
  accounts:[
      {
        Parent_Account:{ CompanyId:1, title:'', Account:{}},
        title:''
      }
  ],
  checkNo:'',
  search:'',
  date:moment(),
  bankCharges:0.0,
  
  gainLoss :"Gain",
  gainLossAmount:0.0,
  taxAmount:0.0,
  isPerc:false,
  accountsLoader:false,
  taxPerc:0.0,
  finalTax:0.0,
  indexes:[],
  partyAccountRecord:{},
  payAccountRecord:{},
  taxAccountRecord:{},
  bankChargesAccountRecord:{},
  gainLossAccountRecord:{},

  totalrecieving:0.00,

  transactionCreation:[],
  activityCreation:[],
  transLoad:false,
  invoiceLosses:[],
};

const getCompanyName = (id) => {
    let result = "";
    result = id==1?'SNS':id==2?"CLS":"ACS"
   return result;
}

const getAccounts = async(trans, companyId) => {
  const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{
    headers:{type:trans, companyid:companyId}
  }).then((x)=> x.data.result )
  return result;
}

const totalRecieveCalc = (vals) => {
  let total = 0.00;
  vals.forEach((x)=>{
    if(x.receiving>0){
      total = total + parseFloat(x.receiving)
    }
  });
  return total;
}

//const getInvoices = async(id, dispatch, partytype, selectedParty, payType, companyId, invoiceCurrency) => {
const getInvoices = async(state, companyId, dispatch) => {
  dispatch({type:"setAll", payload:{ load:true }});
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, 
    { headers:{
      edit:state.edit,
      invoices:state.oldInvoices,
      voucherid:state.id,
      id:state.selectedParty.id,
      pay:state.payType, 
      party:state.partytype, 
      companyId:companyId, 
      invoiceCurrency:state.invoiceCurrency} }
  ).then(async(x)=> {
    let temp = x.data.result;
    let accountData = {};
    if(x.data.status=="success" && x.data.account!=null){
      x.data.account.forEach((z)=>{
        if(z.Child_Account!=null){
          accountData = z;
        }
      })
      
      temp = temp.map((y, index)=>{
        let tempRemBalance = 0
        if(y.payType == "Receivable"){
          tempRemBalance = parseFloat(y.total) - parseFloat(y.recieved)
        }else{
          tempRemBalance = parseFloat(y.total) - parseFloat(y.paid)
        }
        return{
          ...y,
          check:false,
          jobId:y.SE_Job==null?'Old Job':y.SE_Job.jobNo,
          jobSubType:y.SE_Job==null?'Old':y.SE_Job.subType,
          ex_rate:state.partytype=="agent"?y.ex_rate:1.00,
          receiving:state.edit? y.Invoice_Transactions[0].amount:0.00,
          inVbalance:
            (parseFloat(y.total) + parseFloat(y.roundOff)).toFixed(2),
          remBalance:tempRemBalance=='0'?
            0:
            (parseFloat(tempRemBalance)+parseFloat(state.edit?y.Invoice_Transactions[0].amount:0.00)).toFixed(2),
        }
      });
    }
    if(temp.length>1){
      let temp1 = temp.filter((x) => {
        return x.remBalance != 0;
      });
      temp = temp1
    }
    dispatch({
    type:"setAll", 
    
    payload:{
      invoices:temp,
      partyAccountRecord:accountData.Child_Account,
      load:false,
      glVisible:false,
      transLoad:false
    }})
  })
}

const getTotal = (type, list, curr) => {
  let result = 0.00;
  curr=="PKR"?
  list.forEach((x)=>{
    if(type==x.tran.type){
      result = result + parseFloat(x.tran.amount)
    }
  }):
  list.forEach((x)=>{
    if(type==x.tran.type){
      result = result + parseFloat(x.tran.defaultAmount)
    }
  });
  return parseFloat(result.toFixed(2));
}

export { recordsReducer, initialState, getCompanyName, getAccounts, totalRecieveCalc, getInvoices, getTotal };