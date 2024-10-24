import { getNetInvoicesAmount } from '/functions/amountCalculations';
import { getAccounts, totalRecieveCalc, getInvoices, getTotal } from './states';
import openNotification from '/Components/Shared/Notification';
import TransactionInfo from './TransactionInfo';
import { Empty, InputNumber, Checkbox, Radio } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import React, { useEffect, useReducer, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Gl from './Gl';

const BillComp = ({companyId, state, dispatch}) => {

  const router = useRouter();
  const dispatchNew = useDispatch();
  const { payType } = state;
  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")};
  const [checked, setChecked] = useState(false);
  console.log(payType)
  useEffect(() => {
    getInvoices(state, companyId, dispatch);
    // let record = state.invoices.filter(x=>x?.total!=x?.recieved && x?.total!=x?.paid)
  }, [state.selectedParty, state.payType]);  
  
  useEffect(() => { 
    if(state.invoices.length>0){
      set('totalrecieving', totalRecieveCalc(state.invoices));
      calculateTransactions();
      //}
    }
  }, [
    state.invoices,
    state.manualExRate,
    state.exRate,
    state.autoOn
  ]);  

  useEffect(() => {
    calculateTax();
  }, [
    state.totalrecieving, 
    state.taxPerc, 
    state.taxAmount, 
    state.autoOn, 
    state.exRate, 
    state.manualExRate
  ]);  

  async function calculateTax(){
    let tempRate = state.autoOn? state.exRate:state.manualExRate
    if(state.isPerc){
      let tax = ((state.totalrecieving * tempRate)/100)*state.taxPerc;
      set('finalTax', tax);
    } else {
      set('finalTax', state.taxAmount);
    }
  };

  const calculateTransactions = () => {
    let tempGainLoss = 0.00;
    let tempInvoiceLosses = [];
    let debitReceiving = 0.00
    let creditReceiving = 0.00
    state.invoices.forEach((x)=>{
      if(x.receiving && (x.receiving!=0|| state.edit)){
        console.log("Calculating profit/loss", x.receiving, x.ex_rate, state.manualExRate, x.payType)
        let tempExAmount = parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))
        if(x.payType=="Payble"){
          tempExAmount = -1*tempExAmount
        }
        tempGainLoss = tempGainLoss + tempExAmount
        let tempAmount = (parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))).toFixed(2)
        let invoieLossValue = {}
        x.payType == 'Receivable'?
          debitReceiving = debitReceiving + parseFloat(x.receiving):
          creditReceiving = creditReceiving + parseFloat(x.receiving)
        invoieLossValue = {
          amount:x.receiving,
          InvoiceId:x.id,
          gainLoss: x.payType =="Receivable"?
            parseFloat(tempAmount)==0?
              0:parseFloat(tempAmount)*(-1)
            :
            tempAmount, 
        }
        if(x.Invoice_Transactions){
          invoieLossValue.id = x.Invoice_Transactions[0].id
        }
        tempInvoiceLosses.push(invoieLossValue)
      }
    });
    dispatch({type:'setAll', payload:{
      gainLossAmount:tempGainLoss.toFixed(2),
      invoiceLosses:tempInvoiceLosses,
      debitReceiving:debitReceiving,
      creditReceiving:creditReceiving,
      totalrecieving:debitReceiving-creditReceiving,
    }})
  };

  const resetAll = () => {
    let tempList = [...state.invoices];
    tempList = tempList.map(x=>({
      ...x,
      check:false,
      receiving:0.00,
    }));
    return tempList
  };

  const autoKnocking = async() => {
    let val = resetAll();
    if(state.auto=='0'||state.auto==null){
      openNotification('Alert', 'Please Enter A Number', 'orange');
    } else {
      let newExAmount = 0.00;
      let oldExAmount = 0.00;
      let tempAmount = parseFloat(state.auto).toFixed(2);
      let pendingFund = 0;
      val.forEach((x) => {
        pendingFund = parseFloat((parseFloat(x.inVbalance) - parseFloat(x.receiving==null?0:x.receiving)).toFixed(2));
        if(pendingFund >= tempAmount) {
          x.receiving = (parseFloat(x.receiving) + parseFloat(tempAmount)).toFixed(2);
          tempAmount = 0.00;
        } else if (tempAmount==0.00) {
          null
        } else if (pendingFund < tempAmount){
          x.receiving = pendingFund;
          tempAmount = tempAmount - pendingFund;
        }
        pendingFund = 0.00;
      })
      val.forEach((x)=>{
        console.log(x.payType, x.receiving, state.exRate)
        newExAmount = parseFloat(newExAmount) + (parseFloat(x.receiving)*parseFloat(state.exRate));
        oldExAmount = parseFloat(oldExAmount) + (parseFloat(x.receiving)*parseFloat(x.ex_rate));
      })
      dispatch({type:'setAll', payload:{
        gainLossAmount:(newExAmount-oldExAmount).toFixed(2),
        invoices:val,
      }})
    }
    calculateTax();
    calculateTransactions();
  };

  const submitPrices = async() => {
    if(Object.keys(state.payAccountRecord).length==0) {
      openNotification('Alert', 'Please Select Receiving / Paying Account', 'orange');
    } else if(state.transaction=="Bank" && (state.checkNo==null || state.checkNo=="" || state.checkNo==undefined)){
      openNotification('Alert', 'Please Enter Cheque / Transaction #', 'orange');
    } else if(state.partytype=='agent' && ((state.exRate==1 && state.autoOn) || (state.manualExRate==1 && !state.autoOn) )){
      openNotification('Alert', 'Please Set Appropriate Exchange-Rate', 'orange');
    } else if(state.partytype=='agent' && Object.keys(state.gainLossAccountRecord).length==0){
      openNotification('Alert', 'Please Select Gain / Loss Account', 'orange');
    } else {
      let transTwo = [];
      let removing = 0;
      let tempInvoices = [...state.invoices]; 
      let invNarration = "";
      let gainAndLossAmount = 0
      tempInvoices.forEach((x)=>{
        if(x.check){
          invNarration = invNarration + `Inv# ${x.invoice_No} for Job# ${x.jobId},`
        }
      });
  
      invNarration = invNarration + ` For ${state.selectedParty.name}`;
      //Create Account Transactions
      if((Object.keys(state.payAccountRecord).length!=0) && (state.totalrecieving!=0)){ // <- Checks if The Recieving Account is Selected
        // Tax Account
        if((Object.keys(state.taxAccountRecord).length!=0) && (state.finalTax!=0) && (state.finalTax!=null) && (state.totalrecieving!=0)){
          removing = parseFloat(state.finalTax);
          transTwo.push({
            particular:state.taxAccountRecord,
            tran:{
              type:'debit',
              amount:state.finalTax,
              defaultAmount:parseFloat(state.finalTax)/parseFloat(state.autoOn?state.exRate:state.manualExRate),//0
              narration:`Tax Paid Against ${invNarration}`,
              accountType:'Tax'
            }
          })
        }
        // Bank Charges Account
        if((Object.keys(state.bankChargesAccountRecord).length!=0) && (state.bankCharges!=0) && (state.bankCharges!=null) && (state.totalrecieving!=0)){
          removing = removing + parseFloat(state.bankCharges)*parseFloat(state.autoOn?state.exRate:state.manualExRate);
          transTwo.push({
            particular:state.bankChargesAccountRecord,
            tran:{
              type:'debit',
              amount:(parseFloat(state.bankCharges)*parseFloat(state.autoOn?state.exRate:state.manualExRate)).toFixed(2),
              defaultAmount:parseFloat(state.bankCharges).toFixed(2),//0
              narration:`Bank Charges Paid Against ${invNarration}`,
              accountType:'BankCharges'
            }
          })
        }
        console.log(state.totalrecieving)
        console.log(state.debitReceiving)
        let partyAmount = (state.totalrecieving<0?(-1*state.totalrecieving):state.totalrecieving) * parseFloat(state.autoOn?state.exRate:state.manualExRate)
        let payAmount = state.debitReceiving > state.creditReceiving? 
          ((state.totalrecieving<0?(-1*state.totalrecieving):state.totalrecieving) * parseFloat(state.autoOn?state.exRate:state.manualExRate)) - removing:
          ((state.totalrecieving<0?(-1*state.totalrecieving):state.totalrecieving) * parseFloat(state.autoOn?state.exRate:state.manualExRate)) + removing; 
  
        if(state.partytype=='agent'){
          // Gain & Loss Account
          if((Object.keys(state.gainLossAccountRecord).length!=0) && (state.gainLossAmount!=0) && (state.gainLossAmount!=null) && (state.totalrecieving!=0)){
            gainAndLossAmount = state.gainLossAmount>0?parseFloat(state.gainLossAmount):(-1*parseFloat(state.gainLossAmount))
            transTwo.push({
              particular:state.gainLossAccountRecord,
              tran:{
                type:parseFloat(state.gainLossAmount)>0?'credit':'debit',
                amount:parseFloat(gainAndLossAmount).toFixed(2),//state.gainLossAmount>0?parseFloat(state.gainLossAmount):(-1*parseFloat(state.gainLossAmount)),
                defaultAmount:(parseFloat(gainAndLossAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate)).toFixed(2), //- removing
                narration:`Ex-Rate ${parseFloat(state.gainLossAmount)<0?'Loss':"Gain"} Against ${invNarration}`,
                accountType:'gainLoss'
              }
            })
          }
          // transTwo.push({
          //   particular:state.partyAccountRecord,
          //   tran:{
          //     type:parseFloat(state.gainLossAmount)<0?'credit':'debit',
          //     amount:Math.abs(parseFloat(state.gainLossAmount)).toFixed(2),
          //     defaultAmount:(Math.abs(parseFloat(state.gainLossAmount))/parseFloat(state.autoOn?state.exRate:state.manualExRate)).toFixed(2), //- removing
          //     narration:`Ex-Rate ${parseFloat(state.gainLossAmount)<0?'Loss':"Gain"} Against ${invNarration}`,
          //     accountType:'partyAccount'
          //   }
          // })
  
          let newPartyAmount = 0;
          let newPayAmount = 0;
          let TempTotalReceing = Math.abs(state.totalrecieving) * parseFloat(state.autoOn?state.exRate:state.manualExRate)
          newPartyAmount = ((TempTotalReceing).toFixed(2));
  
          if(state.debitReceiving>state.creditReceiving){
            newPayAmount = (TempTotalReceing - removing )//+ parseFloat(state.gainLossAmount))
          } else {
            newPayAmount = (TempTotalReceing + removing )//- parseFloat(state.gainLossAmount))
          }
          transTwo.push({
            particular:state.partyAccountRecord,
            tran:{
              type:state.payType=="Payble"?'debit':'credit',
              amount:newPartyAmount,
              defaultAmount:parseFloat(newPartyAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate), //- removing
              narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
              accountType:'partyAccount'
            }
          })
          transTwo.push({
            particular:state.payAccountRecord,  
            tran:{ 
              type:state.payType=="Payble"?'credit':'debit',
              amount: state.payType=="Payble"?(parseFloat(newPayAmount)-parseFloat(state.gainLossAmount)).toFixed(2):(parseFloat(newPayAmount)+parseFloat(state.gainLossAmount)).toFixed(2),
              defaultAmount: state.payType=="Payble"?((parseFloat(newPayAmount))/parseFloat(state.autoOn?state.exRate:state.manualExRate))-(parseFloat(state.gainLossAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate)):(parseFloat(newPayAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate))+(parseFloat(state.gainLossAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate)),//-removing
              narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
              accountType:'payAccount'
            }
          })
        } else {
          transTwo.push({
            particular:state.partyAccountRecord,
            tran:{
              type:payType=="Receivable"?'credit':'debit',
              amount:parseFloat(partyAmount).toFixed(2),
              defaultAmount:(parseFloat(partyAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate)).toFixed(2), //- removing
              narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
              accountType:'partyAccount'
            }
          })
          transTwo.push({
            particular:state.payAccountRecord,  
            tran:{
              type:payType=="Receivable"?'debit':'credit',// <-Checks the account type to make Debit or Credit
              amount:(parseFloat(payAmount)),// + parseFloat(state.gainLossAmount)).toFixed(2), 
              defaultAmount:(parseFloat(payAmount)),// + parseFloat(state.gainLossAmount))/parseFloat(state.autoOn?state.exRate:state.manualExRate).toFixed(2),//-removing
              narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
              accountType:'payAccount'
            }
          })
        }
      };
      dispatch({type:'setAll', payload:{
        removing:removing,
        transactionCreation:transTwo,
        glVisible:true
      }})
    }
  };

  const getContainers = (data) => {
    let result = "";
    data?.SE_Job?.Bl?.Container_Infos &&
    data?.SE_Job?.Bl?.Container_Infos.forEach((x)=>{
      result = result + x.no + ', '
    });
    return result||'none'
  };

  useEffect(() => {
    let delayDebounceFn ;
    if(state.autoOn){
      delayDebounceFn = setTimeout(() => {
        autoKnocking()
      }, 1500)
    }
    return () => clearTimeout(delayDebounceFn)
  }, [state.auto])

  return (
  <>
  <Row>
    <Col md={7}>
      <TransactionInfo state={state} dispatch={dispatch} />
    </Col>
    <Col md={5} className="">
      <div className="mb-2 pb-2 cur" style={{borderBottom:'1px solid silver'}} 
        onClick={async()=>{
          let tempReset = await resetAll();
          dispatch({type:'setAll', payload:{
            autoOn:!state.autoOn, invoices:tempReset,
            exRate:'1', gainLossAmount:0.00, auto:'0'
          }})
        }}>
          <span><Checkbox checked={state.autoOn} style={{position:'relative', bottom:1}} /></span>
          <span className='mx-2'>Auto Knock Off</span>
      </div>
      <Row>
        <Col md={5}>
          <span className='grey-txt'>Amount</span>
          <InputNumber 
            size='small'
            min="0" stringMode 
            style={{width:'100%', paddingRight:10}} 
            disabled={!state.autoOn} value={state.auto} 
            onChange={(e)=>set('auto', e)}
          />
        </Col>
        <Col md={4}>
          <span className='grey-txt'>Ex. Rate</span>
          <InputNumber size='small'
            min="0.00" stringMode 
            style={{width:'100%', paddingRight:20}} 
            disabled={state.partytype!="agent"?true:!state.autoOn} value={state.exRate} 
            onChange={(e)=>set('exRate', e)}
          />
        </Col>
        <Col md={3}>
          <br/>
          {/* <button className={state.autoOn?'btn-custom':'btn-custom-disabled'}
            style={{fontSize:10}}
            disabled={!state.autoOn}
            onClick={()=>autoKnocking()}
          >Set</button> */}
        </Col>
        {!state.autoOn &&
        <Col md={12}>
          <div style={{maxWidth:100}}>
          <span className='grey-txt'>Ex. Rate</span>
            <InputNumber size='small'
              disabled={state.partytype!="agent"}
              min="0.00" stringMode 
              style={{width:'100%', paddingRight:20}} 
              value={state.partytype!="agent"?'1.00':state.manualExRate} 
              onChange={(e)=>set('manualExRate', e)} 
            />
          </div>
        </Col>
        }
        <Col md={3} className="mt-3">
          <div className='grey-txt fs-14'>Tax Amount</div>
          <InputNumber size='small' value={state.taxAmount} 
            disabled={state.isPerc?true:false} 
            onChange={(e)=>set('taxAmount',e)} min="0.0" 
          />
        </Col>
        <Col md={1} className="mt-3">
          <div className='grey-txt mb-1 fs-14'>%</div>
          <Checkbox size='small' checked={state.isPerc} 
            onChange={()=>{
              set('isPerc',!state.isPerc);
              dispatch({type:'setAll', payload:{
                isPerc:!state.isPerc,
                taxAmount:0,
                taxPerc:0
              }})
            }} 
          />
        </Col>
        <Col md={3} className="mt-3">
          <div className='grey-txt fs-14'>Tax %</div>
          <InputNumber size='small' value={state.taxPerc} disabled={!state.isPerc?true:false} onChange={(e)=>set('taxPerc',e)} min="0.0" />
        </Col>
        <Col className="mt-3" md={5}>
          <span className="grey-txt fs-14">Tax Account #</span>
          <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>
            <CloseCircleOutlined 
              onClick={()=>{
                set('taxAccountRecord', {});
              }} 
            />
          </span>
          <div className="custom-select-input-small" 
            onClick={async()=>{
              dispatch({type:'setAll', payload:{
                visible:true,
                accountsLoader:true
              }})
              let resutlVal = await getAccounts('Adjust', companyId);
              dispatch({type:'setAll', payload:{
                variable:'taxAccountRecord',
                accounts:resutlVal,
                accountsLoader:false
              }})
            }}
          >{
            Object.keys(state.taxAccountRecord).length==0?
            <span style={{color:'silver'}}>Select Account</span>:
            <span style={{color:'black'}}>{state.taxAccountRecord.title}</span>
          }
          </div>
        </Col>
        <Col md={4} className="mt-3">
          <div className='grey-txt fs-14'>
            {/* 
            {(state.gainLossAmount>0 && payType!="Receivable") && <span style={{color:'red'}}><b>Loss</b></span>}
            {(state.gainLossAmount>0 && payType=="Receivable") && <span style={{color:'green'}}><b>Gain</b></span>}*/}
            {state.gainLossAmount==0.00 && <br/>}
            {state.gainLossAmount>0 && <span style={{color:'green'}}><b>Gain</b></span>}
            {state.gainLossAmount<0 && <span style={{color:'red'}}><b>Loss</b></span>} 
          </div>
          <div className="custom-select-input-small" >{Math.abs(state.gainLossAmount)}</div>
          {/* <div className="custom-select-input-small" >{state.gainLossAmount}</div> */}
        </Col>
        <Col className="mt-3" md={8}>
          <span className="grey-txt fs-14">Gain / Loss Account</span>
          <span style={{marginLeft:7, position:'relative', bottom:2}} className='close-btn'>
            <CloseCircleOutlined onClick={()=>set('gainLossAccountRecord', {})} />
          </span>
          <div className="custom-select-input-small"
            onClick={async()=>{
              dispatch({type:'setAll', payload:{
                accountsLoader:true,
                visible:true
              }})
              let resutlVal = await getAccounts('Adjust', companyId);
              dispatch({type:'setAll', payload:{
                variable:'gainLossAccountRecord',
                accounts:resutlVal,
                accountsLoader:false
              }})
            }}
          >
            {
              Object.keys(state?.gainLossAccountRecord).length==0?
              <span style={{color:'silver'}}>Select Account</span>:
              <span style={{color:'black'}}>{state.gainLossAccountRecord.title}</span>
            }
          </div>
        </Col>
      </Row>
    </Col>
  </Row>
  {!state.load && 
  <>  
    {state.invoices.length==0 && <Empty  />}
    {state.invoices.length>0 &&
    <div>
      <div style={{minHeight:300}}>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
      <Table className='tableFixHead' bordered>
        <thead>
          <tr className='fs-12'>
          <th></th>
          <th>Job #</th>
          <th>Inv/Bill #</th>
          <th>HBL</th>
          <th>MBL</th>
          <th>Curr</th>
          <th>Ex.</th>
          <th>Type</th>
          <th>Amount </th>
          <th>{state.payType=="Receivable"? 'Receiving Amount':'Paying Amount'}</th>
          <th>Balance</th>
          <th className='text-center'>
          <input type='checkbox' style={{cursor:'pointer'}} 
              checked={checked} 
              disabled={state.autoOn}
              onChange={() => {
                let tempState = [...state.invoices];
                tempState.forEach((x) => {
                  x.check = !checked
                  if(state.payType=="Receivable"){
                    x.receiving = x.check?
                    (
                      parseFloat(x.remBalance) + 
                      parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) /*<-this adds the current tran amoun previously received */ 
                    ):
                    0.00
                  } else {
                    x.receiving = x.check?
                    (
                      parseFloat(x.remBalance) + 
                      parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) /*<-this adds the current tran amoun previously received */ 
                    ):
                    0.00
                  }
                })
                setChecked(!checked)
                
                set('invoices', tempState);
              }}
            />
          </th>
          <th>Container</th>
          </tr>
        </thead>
        <tbody>
          

        {state.invoices.map((x, index) => {
        return (
        <tr key={index} className={`f fs-12 ${state.edit?'grey-row':''}`}>
          <td style={{width:30}}>{index + 1}</td>
          <td style={{width:100, paddingLeft:4, paddingTop:8}} className='row-hov blue-txt' 
            onClick={()=>{
              let type = x.operation;
              if(x?.SE_Job?.jobNo){
                dispatchNew(incrementTab({
                "label":type=="SE"?"SE JOB":type=="SI"?"SI JOB":type=="AE"?"AE JOB":"AI JOB",
                "key":type=="SE"?"4-3":type=="SI"?"4-6":type=="AE"?"7-2":"7-5",
                "id":x.SE_Job.id
                }))
                router.push(type=="SE"?`/seaJobs/export/${x.SE_Job.id}`:type=="SI"?`/seaJobs/import/${x.SE_Job.id}`:
                  type=="AE"?`/airJobs/export/${x.SE_Job.id}`:`/airJobs/import/${x.SE_Job.id}`
                )
              }
            }
          }>
            <b>{x?.SE_Job?.jobNo}</b>
          </td>
          <td style={{width:120}} className='row-hov blue-txt' 
            onClick={()=>{
              if(x?.SE_Job?.jobNo){
                dispatchNew(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}`}))
                router.push(`/reports/invoice/${x.id}`)
              }
            }
          }
          >
            <b>{x?.invoice_No}</b>
          </td>
          <td>{x?.SE_Job?.Bl?.hbl||'none'}</td>
          <td>{x?.SE_Job?.Bl?.mbl||'none'}</td>
          <td style={{width:20}} className='px-0 text-center'>{x.currency}</td>
          <td style={{width:45}} className='px-0 text-center'>{parseFloat(x.ex_rate).toFixed(2)}</td>
          <td style={{width:5}} className='blue-txt px-0 text-center'>
            <b>{x.payType=="Payble"?"CN":"DN"}</b>
          </td>
          <td style={{minWidth:140}} className='px-1'>{commas(x.inVbalance)}</td>
          <td style={{padding:3, width:150}}>
            <InputNumber style={{height:30, width:140, fontSize:12}} value={x.receiving} min="0.00" stringMode  disabled={state.autoOn}
              onChange={(e)=>{
                let tempState = [...state.invoices];
                tempState[index].receiving = e;
                set('invoices', tempState);
              }}
            />
          </td>
          <td className='px-1' style={{width:300}}> {commas(x.remBalance - x.receiving)} </td>
          <td style={{ width:50}} className='px-3 py-2'>
            <input type='checkbox' style={{cursor:'pointer'}} 
              checked={x.check} 
              disabled={state.autoOn}
              onChange={() => {
                let tempState = [...state.invoices];
                tempState[index].check = !tempState[index].check;
                if(state.payType=="Receivable"){
                  tempState[index].receiving = tempState[index].check?
                  (
                    parseFloat(x.remBalance) + 
                    parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) /*<-this adds the current tran amoun previously received */ 
                  ):
                  0.00
                } else {
                  tempState[index].receiving = tempState[index].check?
                  (
                    parseFloat(x.remBalance) + 
                    parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) /*<-this adds the current tran amoun previously received */ 
                  ):
                  0.00
                }
                set('invoices', tempState);
              }}
            />
          </td>
          <td>{getContainers(x)}</td>
        </tr>
        )})}
        </tbody>
      </Table>
      </div>
      </div>
        <>
        <div style={{position:'relative', top:20}}>
          Total {state.totalrecieving>0?"Recievable":"Payable"} Amount:{" "}
          <div style={{padding:3, border:'1px solid silver', minWidth:100, display:'inline-block', textAlign:'right'}}>
            {Math.abs(state.totalrecieving).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
          </div>
        </div>
        </>
        <button>
          {/* Submit */}
        </button>
        <div className='text-end'>
          <button onClick={submitPrices} className='btn-custom mb-2'>Make Transaction</button>
        </div>
    </div>
    }
  </>
  }
  {state.load && <div className='text-center' ><Spinner /></div>}
  {state.glVisible && <Gl state={state} dispatch={dispatch} companyId={companyId} />}
  </>
  )
}

export default React.memo(BillComp)