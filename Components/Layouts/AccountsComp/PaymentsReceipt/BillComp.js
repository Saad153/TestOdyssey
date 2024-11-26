import { getNetInvoicesAmount } from '/functions/amountCalculations';
import { getAccounts, totalRecieveCalc, getInvoices, getTotal } from './states';
import openNotification from '/Components/Shared/Notification';
import TransactionInfo from './TransactionInfo';
import { Empty, InputNumber, Checkbox, Radio, Input, DatePicker, Select, Modal } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import React, { useEffect, useReducer, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import Gl from './Gl';
import moment from 'moment';
import { setField } from '/redux/paymentReciept/paymentRecieptSlice';

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const BillComp = ({back, companyId, state, dispatch}) => {
  const [firstCall, setFirstCall] = useState(true);

  useEffect(() => {
    // console.log("SelectedAccount>>",state.selectedAccount)
    const fetchInvoices = async () => {
      dispatch(setField({ field: 'load', value: true }))
      try{
        // console.log(state)
        // console.log(companyId)
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, {
          headers: {
            id: state.selectedAccount,
            companyid: companyId,
            invoicecurrency: state.currency,
            pay: state.payType,
            type: state.type,
            // edit: false
          }
        }).then((x) => {
          // console.log(x.data.result)
          x.data.result.forEach((y)=>{
            // console.log(parseFloat(y.total), parseFloat(y.recieved), parseFloat(y.paid))
            // console.log(parseFloat(y.total)-parseFloat(y.recieved))
            // console.log(parseFloat(y.total)-parseFloat(y.paid))

          })
          let temp = []
          !state.edit?temp  = x.data.result.filter(y => parseFloat(y.total)-parseFloat(y.recieved) != 0.0 && parseFloat(y.total)-parseFloat(y.paid) != 0.0):
          temp = x.data.result
          // console.log("Invoices>>", temp)
          temp.forEach((x) => {
            x.receiving = 0.0;
          });
          dispatch(setField({ field: 'invoices', value: temp }))
          dispatch(setField({ field: 'load', value: false }))
        })
      }catch(e){
        console.log(e)
      }
    }
    if(state.selectedAccount && !state.edit){
      fetchInvoices()
    }
    if(state.currency=="PKR"){
      dispatch(setField({ field: 'exRate', value: 1.0 }))
    }
  }, [state.selectedAccount, state.payType])

  useEffect(() => {
    // console.log(state.receivingAccounts)
    const fetchreceivingAccount = async () => {
      dispatch(setField({ field: 'load', value: true }))
      try{
        // console.log(state)
        // console.log(companyId)
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION, {
          headers: {
            type: state.transactionMode,
            companyid: companyId,
          }
        }).then((x) => {
          // console.log(x.data.result)
          dispatch(setField({ field: 'receivingAccounts', value: x.data.result }))
          dispatch(setField({ field: 'load', value: false }))
        })
      }catch(e){
        console.log(e)
      }
    }
    fetchreceivingAccount()
  }, [state.transactionMode])

  useEffect(() => {
    const fetchreceivingAccount = async () => {
      dispatch(setField({ field: 'load', value: true }))
      try{
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION, {
          headers: {
            type: "Adjust",
            companyid: companyId,
          }
        }).then((x) => {
          dispatch(setField({ field: 'adjustAccounts', value: x.data.result }))
          dispatch(setField({ field: 'load', value: false }))
        })
      }catch(e){
        console.log(e)
      }
    }
    if(firstCall){
      setFirstCall(false)
    }
    fetchreceivingAccount()
  }, [state.transactionMode])

  useEffect(() => {
    let temp = 0.0
    let gainLoss = 0.0
    state.invoices.forEach((x) => {
      x.payType=="Recievable"?
      temp += x.receiving:
      temp -= x.receiving
      if(x.currency!="PKR"){
        const receiving = parseFloat(x.receiving) || 0;
        const exRate = parseFloat(x.ex_rate) || 0;
        const stateRate = parseFloat(state.exRate) || 0;

        if (x.payType !== "Payble") {
          gainLoss += (receiving * stateRate) - (receiving * exRate);
        } else {
          gainLoss += (receiving * exRate) - (receiving * stateRate);
        }
      }
    })
    dispatch(setField({ field: 'totalReceivable', value: temp }))
    dispatch(setField({ field: 'gainLossAmount', value: gainLoss }))
  },[state.invoices, state.exRate])

  useEffect(() => {
    let temp = 0.0
    if(state.percent){
      state.totalReceivable>0?
      temp = state.totalReceivable*(state.taxPercent/100):
      temp = (state.totalReceivable*-1)*(state.taxPercent/100)
      dispatch(setField({ field: 'taxAmount', value: temp }))
    }
  },[state.taxPercent, state.invoices])

  const submitTransaction = async () => {
    try{
          await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/voucher/makeTransaction`, {
            transactions: state.transactions,
            invoices: state.invoices,
            gainLoss: state.gainLossAmount,
            totalReceiving: state.totalReceivable,
            partyId: state.selectedAccount,
            partyName: state.accounts.find((x)=>x.id==state.selectedAccount).name,
            partyType: state.type,
            type: state.onAccount,
            transactionMode: state.transactionMode,
            payType: state.payType,
            currency: state.currency,
            checkNo: state.checkNo,
            checkDate: state.checkDate,
            transactionMode: state.transactionMode,
            subType: state.subType,
            exRate: state.exRate,
            date: state.date,
            companyId: companyId,
            tranDate: state.date,
            edit: state.edit,
            voucherId: state.voucherId
          }).then((x) => {
            back()
            x.data.status=="success"?openNotification('Success', `Transaction Saved`, 'green'):openNotification('Error', `Error saving transaction`, 'red')
          })

      }catch(e){
        console.error(e)
      }
      dispatch(setField({ field: 'modal', value: false }))
  }

  const makeTransaction = () => {
    // console.log("Selected Account", state.selectedAccount)
    // console.log("Receiving Amount", state.totalReceivable)
    // console.log("Receiving Account", state.receivingAccount)
    // console.log("Gain Loss Amount", state.gainLossAmount)
    // console.log("Gain Loss Account", state.gainLossAccount)
    // console.log("Bank Charges Amount", state.bankChargesAmount)
    // console.log("Bank Charges Account", state.bankChargesAccount)
    // console.log("Tax Amount", state.taxAmount)
    // console.log("Tax Account", state.taxAccount)
    if(state.currency!="PKR" && state.exRate<=50){
      openNotification('Failure', `Select Proper ExChange Rate`, 'red')
      return
    }
    if(state.totalReceivable==0){
      openNotification('Failure', `No transaction selected`, 'red')
      return
    }
    if(state.receivingAccount==undefined){
      openNotification('Failure', `Select Receiving Account`, 'red')
      return
    }
    if(state.transactionMode!="Cash"&&state.checkNo==""){
      openNotification('Failure', `Enter Cheque No.`, 'red')
      return
    }
    if((state.gainLossAmount!=0&&state.gainLossAmount!=undefined) && state.gainLossAccount==undefined){
      openNotification('Failure', `Select Gain Loss Account`, 'red')
      return
    }
    if(state.bankChargesAmount!=0 && state.bankChargesAccount==undefined){
      openNotification('Failure', `Select Bank Charges Account`, 'red')
      return
    }
    if((state.taxAmount!=0&&state.taxAmount!=undefined) && state.taxAccount==undefined){
      openNotification('Failure', `Select Tax Account`, 'red')
      return
    }


    // console.log(state.totalReceivable)
    let temp = []
    if(state.totalReceivable!=0){
      temp.push({
        partyId: state.selectedAccount,
        accountType: "partyAccount",
        accountName: state.accounts.find((x) => x.id === state.selectedAccount)?.name || "N/A",
        debit: state.totalReceivable<0?state.totalReceivable*-1:0,
        credit: state.totalReceivable>0?state.totalReceivable:0,
        type: state.totalReceivable<0?'debit':'credit'
      })
    }
    let accountAmount = state.totalReceivable<0?state.totalReceivable*-1:state.totalReceivable
    accountAmount -= state.bankChargesAmount
    accountAmount -= state.taxAmount
    accountAmount -= state.gainLossAmount/state.exRate
    // console.log(accountAmount)
    if(state.totalReceivable!=0){
      temp.push({
        partyId: state.receivingAccount,
        accountType: "payAccount",
        accountName: state.receivingAccounts.find((x) => x.id === state.receivingAccount)?.title || "N/A",
        debit: state.totalReceivable>0?accountAmount:0,
        credit: state.totalReceivable<0?accountAmount:0,
        type: state.totalReceivable>0?'debit':'credit'
      })
    }
    if(state.gainLossAmount!=0){
      temp.push({
        partyId: state.gainLossAccount,
        accountType: "Gain/Loss Account",
        accountName: state.adjustAccounts.find((x) => x.id === state.gainLossAccount)?.title || "N/A",
        debit: state.payType=="Recievable"?state.gainLossAmount>0?state.gainLossAmount/state.exRate:0:state.gainLossAmount<0?(state.gainLossAmount*-1)/state.exRate:0,
        credit: state.payType!="Recievable"?state.gainLossAmount>0?state.gainLossAmount/state.exRate:0:state.gainLossAmount<0?(state.gainLossAmount*-1)/state.exRate:0,
        type: state.payType!="Recievable"?state.gainLossAmount>0?'credit':'debit':state.gainLossAmount<0?'credit':'debit'
      })
    }
    if(state.bankChargesAmount!=0){
      temp.push({
        partyId: state.bankChargesAccount,
        accountType: state.transactionMode=="Cash"?"Cash Charges Account":state.transactionMode=="Cash"?"Bank Charges Account":"Adjust Charges Account",
        accountName: state.adjustAccounts.find((x) => x.id === state.bankChargesAccount)?.title || "N/A",
        debit: state.payType=="Recievable"?state.bankChargesAmount:0,
        credit: state.payType!="Recievable"?state.bankChargesAmount:0,
        type: state.payType=="Recievable"?'debit':'credit'
      })
    }
    if(state.taxAmount!=0){
      temp.push({
        partyId: state.taxAccount,
        accountType: "Tax Account",
        accountName: state.adjustAccounts.find((x) => x.id === state.taxAccount)?.title || "N/A",
        debit: state.payType=="Recievable"?state.taxAmount:0,
        credit: state.payType!="Recievable"?state.taxAmount:0,
        type: state.payType=="Recievable"?'debit':'credit'
      })
    }
    let totalDebit = 0.0
    let totalCredit = 0.0
    temp.forEach((x)=>{
      totalDebit+=x.debit
      totalCredit+=x.credit
    })
    temp.push({
      accountType: "",
      accountName: "Total",
      debit: totalDebit,
      credit: totalCredit
    })
    dispatch(setField({ field: 'transactions', value: temp }))
    dispatch(setField({ field: 'modal', value: true }))


    // try{
    //   axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/voucher/makeTransaction`, {
    //     id: state.selectedAccount,
    //     receivingAmount: state.totalReceivable,
    //     receivingAccount: state.receivingAccount,
    //     gainLossAmount: state.gainLossAmount,
    //     gainLossAccount: state.gainLossAccount,
    //     bankChargesAmount: state.bankChargesAmount,
    //     bankChargesAccount: state.bankChargesAccount,
    //     taxAmount: state.taxAmount,
    //     taxAccount: state.taxAccount,
    //     type: state.type,
    //     payType: state.payType,
    //     currency: state.currency,
    //     checkNo: state.checkNo,
    //     transactionMode: state.transactionMode,
    //     subType: state.subType,
    //     exRate: state.exRate,
    //     checkDate: state.checkDate,
    //     date: state.date,
    //     companyId: companyId,
    //   }).then((x) => {
        
    //   })
    // }catch(e){
    //   console.error(e)
    // }
  }

  const calculateColor = (invoice) => {
    if (state.edit === false) {
      if (invoice.total - invoice.recieved - invoice.receiving > 0) {
        return 'green';
      } else if (invoice.total - invoice.recieved - invoice.receiving < 0) {
        return 'red'
      } else {
        return 'black'
      }
    } else {
      if(invoice.receiving == 0){
        if(invoice.total - invoice.recieved > 0){
          return 'green';
        }else if(invoice.total - invoice.recieved < 0){
          return 'red'
        }else{
          return 'black'
        }
      }else{
        if(invoice.total - invoice.receiving > 0){
          return 'green';
        }else if(invoice.total - invoice.receiving < 0){
          return 'red'
        }else{
          return 'black'
        }
      }
    }
  };

  return (
  <>
  <Row>

    <Col md={7}>
      <Row>
        <Col md={5}>
          <span style={{marginLeft: '5px'}}>Transaction Mode</span>
          <Radio.Group style={{display: 'flex', marginLeft: '5px', marginTop: '5px'}} value={state.transactionMode} onChange={(e) => {dispatch(setField({ field: 'transactionMode', value: e.target.value })); e.target.value=="Cash"?dispatch(setField({ field: 'subType', value: "Cash" })):dispatch(setField({ field: 'subType', value: "Cheque" })); dispatch(setField({field: "receivingAccount", value: undefined}))}}>
            <Radio value={"Cash"}>  Cash  </Radio>
            <Radio value={"Bank"}>  Bank  </Radio>
            <Radio value={"Adjust"}>Adjust</Radio>
          </Radio.Group>
        </Col>
        <Col md={2}>
        <span style={{marginLeft: '5px'}}>Date</span>
          <DatePicker style={{width: '100%'}} value={state.date} onChange={(e) => dispatch(setField({ field: 'date', value: e }))}></DatePicker>
        </Col>
        <Col md={2}>
        <span style={{marginLeft: '5px'}}>SubType</span>
          <Select style={{width: '100%'}} value={state.subType} onChange={(e) => dispatch(setField({ field: 'subType', value: e }))}>
            <Select.Option value="Cheque">Cheque</Select.Option>
            <Select.Option value="Credit Cart">Credit Card</Select.Option>
            <Select.Option value="Online Transfer">Online Transfer</Select.Option>
            <Select.Option value="Wire Transfer">Wire Transfer</Select.Option>
            <Select.Option value="Cash">Cash</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row style={{marginTop: '25px'}}>
        <Col md={3}>
          <span style={{marginLeft: '5px'}}>Cheque/Tran #</span>
          <Input disabled={state.transactionMode=="Cash"} value={state.checkNo} onChange={(e) => dispatch(setField({ field: 'checkNo', value: e.target.value }))}></Input>
        </Col>
        <Col md={2}>
        <span style={{marginLeft: '5px', width: '100%'}}>Cheque Date</span>
          <DatePicker disabled={state.transactionMode=="Cash"} style={{width: '100%'}} value={state.checkDate} onChange={(e) => dispatch(setField({ field: 'checkDate', value: e }))}></DatePicker>
        </Col>
        <Col md={4}>
        <span style={{marginLeft: '5px'}}>{state.payType!="Recievable"?"Paying":"Receiving"} Account*</span>
        <Select
          allowClear
          showSearch
          style={{ width: '100%' }}
          placeholder={`Select Account`}
          value={state.receivingAccount}
          options={state.receivingAccounts.map((account) => ({
            label: `(${account.code}) ${account.title}`,
            value: account.id,
          }))}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(e) => {dispatch(setField({ field: 'receivingAccount', value: e }))}}
        />
        </Col>
        <Col md={3}>
        <span style={{marginLeft: '5px'}}>On Account</span>
          <Select value={state.onAccount} onChange={(e)=>{dispatch(setField({field: 'onAccount', value: e.target.value}))}} style={{width: '100%'}}>
            <Select.Option value="client">Client</Select.Option>
            <Select.Option value="shipper">Shipper</Select.Option>
            <Select.Option value="importer">Importer</Select.Option>
            <Select.Option value="clearingAgent">Clearing Agent</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Col md={8}>
        <span style={{marginLeft: '5px'}}>Drawn At</span>
        <Input></Input>
        </Col>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Col md={3}>
        <span style={{marginLeft: '5px'}}>Bank Charges</span>
        <InputNumber
        disabled={state.bankChargesAccount==undefined}
        formatter={(value) =>
          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas as thousands separators
        }
        parser={(value) =>
          value?.replace(/,/g, '') // Remove commas for the actual value
        }
        style={{width: '100%'}} value={state.bankChargesAmount} onChange={(e) => dispatch(setField({ field: 'bankChargesAmount', value: e }))}></InputNumber>
        </Col>
        <Col md={6}>
        <span style={{marginLeft: '5px'}}>Bank Charges Account</span>
        <Select
          allowClear
          showSearch
          style={{ width: '100%' }}
          placeholder={`Select Account`}
          value={state.bankChargesAccount}
          options={state.adjustAccounts.map((account) => ({
            label: `(${account.code}) ${account.title}`,
            value: account.id,
          }))}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(e) => {dispatch(setField({ field: 'bankChargesAccount', value: e })); e==undefined?dispatch(setField({ field: 'bankChargesAmount', value: 0.0 })):null}}
        />
        </Col>
      </Row>
    </Col>
    
    <Col md={5} style={{borderLeft: '1px solid #dee2e6', paddingLeft: '10px'}}>
        {/* <span style={{marginLeft: '5px'}}>Auto KnockOff</span> */}
        <Row>
          <Col md={3}>
            <span style={{marginLeft: '5px', fontWeight: 'bold'}}>Ex. Rate</span>
            <InputNumber disabled={state.currency=='PKR'} style={{width: '100%'}} value={state.exRate} onChange={(e) => dispatch(setField({ field: 'exRate', value: e }))}></InputNumber>
          </Col>
          <Col md={4}>
          {state.totalReceivable<0?<span style={{fontWeight: 'bold'}}>Total Payable Amount</span>:<span style={{fontWeight: 'bold'}}>Total Receivable Amount</span>}
          <span style={{width: '100%', height: '60%', display: 'flex', justifyContent: 'left', alignItems: 'center', border: '1px solid #d7d7d7', paddingLeft: '10px'}}>{state.totalReceivable>=0?commas(state.totalReceivable):commas(state.totalReceivable*-1)}</span>
          </Col>
          <Col md={5} style={{float: 'right'}}>
            <button onClick={()=>{makeTransaction()}} style={{ fontSize: 14, marginTop: '20px', width: "65%", display: "flex", justifyContent: "center", alignItems: "center", height: "60%", backgroundColor: "#1f2937", color: "white", borderRadius: 20 }}>Make Transaction</button>
          </Col>
        </Row>
        <Row style={{marginTop:'10px'}}>
          <Col md={3}>
            <Checkbox style={{marginTop: '25px'}} onChange={(e) => {dispatch(setField({ field: 'autoKnockOff', value: e.target.checked }))}} checked={state.autoKnockOff}>Auto KnockOff</Checkbox>
          </Col>
          <Col md={6}>
            <span style={{marginLeft: '5px'}}>Amount</span>
            <InputNumber disabled={!state.autoKnockOff} style={{width: '100%'}}></InputNumber>
          </Col>
        </Row>
        <Row>

        </Row>
        <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col md={3} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px'}}>Tax Amount</span>
            <InputNumber
            disabled={state.percent}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas as thousands separators
            }
            parser={(value) =>
              value?.replace(/,/g, '') // Remove commas for the actual value
            }
            style={{width: '100%'}} value={state.taxAmount} onChange={(e) => dispatch(setField({ field: 'taxAmount', value: e }))}></InputNumber>
          </Col>
          <Col md={1} style={{ paddingTop: '5%'}}>
            <Checkbox checked={state.percent} onChange={(e) => {dispatch(setField({ field: 'percent', value: e.target.checked })); dispatch(setField({ field: 'taxPercent', value: 0 })); dispatch(setField({ field: 'taxAmount', value: 0 }))}}>%</Checkbox>
          </Col>
          <Col md={2} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px'}}>Tax %</span>
            <InputNumber value={state.taxPercent} onChange={(e) => {
              dispatch(setField({ field: 'taxPercent', value: e }))
            }} disabled={!state.percent} style={{width: '100%'}}></InputNumber>
          </Col>
          <Col md={6} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px'}}>Tax Account</span>
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder={`Select Account`}
              value={state.taxAccount}
              options={state.adjustAccounts.map((account) => ({
                label: `(${account.code}) ${account.title}`,
                value: account.id,
              }))}
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => {dispatch(setField({ field: 'taxAccount', value: e })), e==undefined?dispatch(setField({ field: 'taxAmount', value: 0.0 })):null}}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px', color: state.gainLossAmount > 0 ? 'green' : 'black', fontWeight: state.gainLossAmount > 0 ? 'bold' : 'normal'}}>Gain</span>
            <span style={{marginLeft: '5px'}}>/</span>
            <span style={{marginLeft: '5px', color: state.gainLossAmount < 0 ? 'red' : 'black', fontWeight: state.gainLossAmount < 0 ? 'bold' : 'normal'}}>Loss</span>
            <span style={{width: '100%', height: '60%', display: 'flex', justifyContent: 'left', alignItems: 'center', border: '1px solid #d7d7d7', paddingLeft: '10px'}}>{commas(state.gainLossAmount)}</span>
            </Col>
          <Col md={6} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px', color: state.gainLossAmount != 0 && state.gainLossAccount == null ? 'red' : 'black', fontWeight: state.gainLossAmount != 0 ? 'bold' : 'normal'}}>Gain/Loss Account {state.gainLossAmount!=0?"*":null}</span>
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder={`Select Account`}
              value={state.gainLossAccount}
              options={state.adjustAccounts.map((account) => ({
                label: `(${account.code}) ${account.title}`,
                value: account.id,
              }))}
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => {dispatch(setField({ field: 'gainLossAccount', value: e }))}}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col md={3} style={{marginTop: '10px'}}>
            <span style={{marginLeft: '5px'}}>Ex. Rate</span>
            <InputNumber disabled={state.autoKnockOff} style={{width: '100%'}}></InputNumber>
          </Col>
        </Row> */}
    </Col>
  </Row>
    {!state.load&&<Col md={12} style={{marginTop: '25px'}}>
          <table style={{width: '100%'}}>
            <thead style={{backgroundColor: '#f3f3f3'}}>
              <tr>
                <th style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>#</th>
                <th style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Job #</th>
                <th style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Inv/Bill #</th>
                <th style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>HBL</th>
                <th style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>MBL</th>
                <th style={{width: '5%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Curr</th>
                <th style={{width: '7%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Ex. Rate</th>
                <th style={{width: '5%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Type</th>
                <th style={{width: '12%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Amount</th>
                <th style={{width: '12%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Recieving Amount</th>
                <th style={{width: '12%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>Balance</th>
                <th style={{width: '3%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>-</th>
                <th style={{width: '10%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', padding: '10px 10px'}}>Container</th>
              </tr>
            </thead>
            <tbody>
              {state.invoices.length>0&&state.invoices.map((invoice, index) => (
                <tr key={index} style={{borderBottom: '1px solid #dee2e6', padding: '10px 0px'}}>
                  <td style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{index + 1}</td>
                  <td className='row-hov blue-txt' style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}><b>{invoice.SE_Job.jobNo}</b></td>
                  <td className='row-hov blue-txt' style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}><b>{invoice.invoice_No}</b></td>
                  <td style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{invoice.SE_Job.Bl.hbl}</td>
                  <td style={{width: '8%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{invoice.SE_Job.Bl.mbl}</td>
                  <td style={{width: '5%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{invoice.currency}</td>
                  <td style={{width: '7%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{invoice.ex_rate}</td>
                  <td className='blue-txt' style={{width: '5%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}><b>{invoice.payType=="Recievable"?"DN":"CN"}</b></td>
                  <td style={{width: '12%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{commas(invoice.total)}</td> 
                  <td style={{width: '12%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>{
                    <InputNumber style={{width: '100%'}} value={invoice.receiving}
                    disabled={invoice.total - invoice.recieved == 0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas as thousands separators
                    }
                    parser={(value) =>
                      value?.replace(/,/g, '') // Remove commas for the actual value
                    }
                    onChange={(e) => {
                      e<0?e = e *-1:null
                      const value = e || 0; // Use 0 if `e` is null
                      const updatedInvoiceList = [...state.invoices]; // Create a shallow copy of the array
                      updatedInvoiceList[index] = {
                        ...updatedInvoiceList[index], // Create a shallow copy of the object
                        receiving: value, // Update the `receiving` field
                      };
                      dispatch(setField({ field: 'invoices', value: updatedInvoiceList })); // Update the Redux state
                    }}
                    ></InputNumber>
                    }</td>
                  <td
                    style={{
                      width: '12%',
                      paddingLeft: '5px',
                      borderLeft: '1px solid #dee2e6',
                      padding: '10px 10px',
                      color: calculateColor(invoice),
                    }}
                  >
                    {state.edit==false?commas(invoice.total - invoice.recieved - invoice.receiving):invoice.receiving==0?commas(invoice.total - invoice.recieved):commas(invoice.total - invoice.receiving)}
                  </td>
                  <td style={{width: '3%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px'}}>
                    <input type="checkbox" checked={invoice.total - invoice.recieved - invoice.receiving == 0} onChange={(e) => {
                      // console.log(e.target.checked)
                      let value = 0
                      if(e.target.checked){
                        value = invoice.total - invoice.recieved; // Use 0 if `e` is null
                      }else{
                        value = 0
                      }
                      const updatedInvoiceList = [...state.invoices]; // Create a shallow copy of the array
                      updatedInvoiceList[index] = {
                        ...updatedInvoiceList[index], // Create a shallow copy of the object
                        receiving: value, // Update the `receiving` field
                      };
                      dispatch(setField({ field: 'invoices', value: updatedInvoiceList })); // Update the Redux state
                    }} />
                  </td>
                  <td style={{width: '10%', paddingLeft: '5px', borderLeft: '1px solid #dee2e6', padding: '10px 10px', borderRight: '1px solid #dee2e6'}}>{invoice.container}</td>
                </tr>
              ))}
            </tbody>
          </table>
    </Col>}
    <Modal title={`Proceed with transaction?`} open={state.modal} onOk={()=>dispatch(setField({ field: 'modal', value: false }))} 
        onCancel={()=>dispatch(setField({ field: 'modal', value: false }))} footer={false} maskClosable={false} width={'80%'} centered
      >
        <table style={{width: '100%'}}>
          <thead style={{backgroundColor: '#d7d7d7'}}>
            <tr style={{borderBottom: '1px solid #d7d7d7', padding: '10px 0px'}}>
              <th style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>Account Type</th>
              <th style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>Account Name</th>
              <th style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>Debit</th>
              <th style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', borderRight: '1px solid #d7d7d7', padding: '10px 10px'}}>Credit</th>
            </tr>
          </thead>
          <tbody>
            {/* {console.log(state.transactions)} */}
            {state.transactions.map((x)=>(
              <tr key={x.id} style={{borderBottom: '1px solid #d7d7d7', padding: '10px 0px'}}>
                <td style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>{x.accountType}</td>
                <td style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>{x.accountName}</td>
                <td style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', padding: '10px 10px'}}>{commas(x.debit)}</td>
                <td style={{width: '2%', paddingLeft: '5px', borderLeft: '1px solid #d7d7d7', borderRight: '1px solid #d7d7d7', padding: '10px 10px'}}>{commas(x.credit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={()=>{submitTransaction()}} style={{border: '1px solid #1d1d1f', borderRadius: '15px', marginTop: '10px', backgroundColor: '#1d1d1f', color: '#f3f3f3', padding: '2px 10px'}}>Approve & Save</button>
    </Modal>
  </>
  )
}

export default React.memo(BillComp)