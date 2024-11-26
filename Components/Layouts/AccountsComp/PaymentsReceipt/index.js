import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import { SearchOutlined, CloseCircleOutlined, SyncOutlined, PrinterOutlined, RollbackOutlined, PlusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { MdDeleteForever, MdHistory } from "react-icons/md";
import { Input, List, Radio, Modal, Select } from 'antd';
import { recordsReducer, initialState, getNewInvoices } from './states';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { Row, Col, Table } from 'react-bootstrap';
import Router, { useRouter } from 'next/router';
import BillComp from './BillComp';
import PrintTransaction from './PrintTransaction';
import moment from 'moment';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import ReactToPrint from 'react-to-print';
import DeleteVoucher from './DeleteVoucher';
import Pagination from '../../../Shared/Pagination';
import openNotification from "../../../Shared/Notification";
import {checkEditAccess} from "../../../../functions/checkEditAccess";
import {checkEmployeeAccess} from "../../../../functions/checkEmployeeAccess";
import { setField } from '/redux/paymentReciept/paymentRecieptSlice';
import Cookies from "js-cookie";

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const PaymentsReceipt = ({ id, voucherData, q }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.paymentReciept);
  const fetchOldVouchers = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OLD_PAY_REC_VOUCHERS, {
      headers: { companyid: Cookies.get('companyId') }
    }).then((x) => {
      console.log(x.data.result)
      const temp = [];
      temp.push(x.data.result.map((x) => {
        console.log(x)
        return {
          id: x.id,
          voucherNo: x.voucher_Id,
          name: x.partyName,
          party: x.partyType,
          type: x.vType,
          data: moment(x.createdAt).format('DD-MM-YYYY'),
          currency: x.currency,
          amount: x.Voucher_Heads.find((y) => y.accountType=='partyAccount').amount,
          partyId: x.partyId,
          x: x
        };
      }));
      console.log("Temp>",temp)

      dispatch(setField({ field: 'oldVouchers', value: temp[0] }));
    })
      
    }
    const [first, setFirst] = useState(false)
  useEffect(() => {
    if(state.oldVouchers.length == 0 && !first){
      // dispatch(setField({ field: 'selectedAccount', value: selectedAccount }));
      fetchOldVouchers();
      setFirst(true)
    }
  })

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH,
        { search: state.searchAccount, type: state.type }
      ).then((x) => {
        console.log(">>", x.data.result)
        dispatch(setField({ field: 'accounts', value: x.data.result }));
      })
    }
    fetchAccounts();
  }, [state.type])

  const columnDefs = [
    { title: "Voucher No.", dataIndex: "voucherNo", key: "voucherNo" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Party", dataIndex: "party", key: "party" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ]

  const back = async () => {
    dispatch(setField({ field: 'selectedAccount', value: undefined }));
    dispatch(setField({ field: 'invoices', value: [] }))
    dispatch(setField({ field: 'edit', value: false }))
    dispatch(setField({ field: 'bankChargesAccount', value: undefined }))
    dispatch(setField({ field: 'receivingAccount', value: undefined }))
    dispatch(setField({ field: 'taxAccount', value: undefined }))
    dispatch(setField({ field: 'gainLossAccount', value: undefined }))
    dispatch(setField({ field: 'gainLossAmount', value: 0 }))
    dispatch(setField({ field: 'taxAmount', value: 0 }))
    dispatch(setField({ field: 'bankChargesAmount', value: 0 }))
    dispatch(setField({ field: 'checkNo', value: '' }))
    dispatch(setField({ field: 'checkDate', value: moment() }))
    dispatch(setField({ field: 'exRate', value: 1.0 }))
    dispatch(setField({ field: 'transactionMode', value: 'Cash' }))
    dispatch(setField({ field: 'subType', value: 'Cheque' }))
    dispatch(setField({ field: 'currency', value: 'PKR' }))
    dispatch(setField({ field: 'payType', value: 'Recievable' }))
    dispatch(setField({ field: 'onAccount', value: 'Cash' }))
    dispatch(setField({ field: 'type', value: 'client' }))
    dispatch(setField({ field: 'voucherId', value: undefined }))
    setFirst(false)
    fetchOldVouchers();
  }

  const deleteVoucher = () => {
    axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_PAY_REC,{
      id: state.voucherId
    }).then((x) => {
      // console.log(x.data.status)
      if(x.data.status=="success"){
        back()
      }
    })
    
  }

  console.log(state)

  return (
    <div className='base-page-layout'>
      <div>
        <h5>Payment / Receipt</h5>
        <hr></hr>
      </div>
      <Row style={{ height: '30px'}}>
        <Col md={3}>
          <b>Type</b>
          <Radio.Group style={{marginLeft: 10}} value={state.type} onChange={(e)=>{
            if(e.target.value == 'client'){
              dispatch(setField({ field: 'type', value: e.target.value }));
              dispatch(setField({ field: 'payType', value: 'Recievable' }));
              dispatch(setField({ field: 'currency', value: 'PKR' }));
              dispatch(setField({ field: 'selectedAccount', value: undefined}));
            }
            if(e.target.value == 'vendor'){
              dispatch(setField({ field: 'type', value: e.target.value }));
              dispatch(setField({ field: 'payType', value: 'Payble' }));
              dispatch(setField({ field: 'currency', value: 'PKR' }));
              dispatch(setField({ field: 'selectedAccount', value: undefined }));
            }
            if(e.target.value == 'agent'){
              dispatch(setField({ field: 'type', value: e.target.value }));
              dispatch(setField({ field: 'payType', value: 'Payble' }));
              dispatch(setField({ field: 'currency', value: 'USD' }));
              dispatch(setField({ field: 'selectedAccount', value: undefined }));
            }
          }}>
            <Radio value={'client'}>Client</Radio>
            <Radio value={'vendor'}>Vendor</Radio>
            <Radio value={'agent'}>Agent</Radio>
          </Radio.Group>
        </Col>
        <Col md={3}>
          <b>Pay Type</b>
          <Radio.Group style={{marginLeft: 10}} disabled={state.type == 'agent' ? true : false} value={state.payType} onChange={(e)=>{dispatch(setField({ field: 'payType', value: e.target.value }))}}>
            <Radio value={'Payble'}>Payable</Radio>
            <Radio value={'Recievable'}>Receivable</Radio>
          </Radio.Group>
        </Col>
        <Col md={6}>
          <Row style={{ display: "flex", justifyContent: "flex-end", height: '30px' }}>
            {(!(state.selectedAccount==""||state.selectedAccount==undefined)&&state.edit)&&<Col md={2}>
              <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#921a12", color: "white", borderRadius: 20 }}
              onClick={()=>{
                dispatch(setField({ field: 'delete', value: true }))
              }}
              ><span style={{marginRight: 5}}>Delete</span> <MdDeleteForever style={{ fontSize: 16 }}/></button>
            </Col>}
            {/* {(!(state.selectedAccount==""||state.selectedAccount==undefined)&&state.edit)&&<Col md={3}>
              <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#1f2937", color: "white", borderRadius: 20 }}><span style={{marginRight: 5}}>Cheque Return</span> <RollbackOutlined style={{ fontSize: 16 }}/></button>
            </Col>} */}
            {(!(state.selectedAccount==""||state.selectedAccount==undefined)&&state.edit)&&<Col md={2}>
              <button onClick={async () =>{
                try{
                  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, {
                    headers: {
                      id: state.selectedAccount,
                      companyid: Cookies.get('companyId'),
                      invoicecurrency: state.currency,
                      pay: state.payType,
                      type: state.type,
                      edit: true,

                    }
                  }).then((x) => {
                    let temp = []
                    !state.edit?temp  = x.data.result.filter(y => parseFloat(y.total)-parseFloat(y.recieved) != 0.0 && parseFloat(y.total)-parseFloat(y.paid) != 0.0):
                    // temp = x.data.result
                    // let temp2  = [...state.invoices]
                    // temp.forEach((x) => {
                    //   x.receiving = 0.0;
                    //   let exists = false
                    //   temp2.forEach((y, i) => {
                    //     if(x.id == y.id){
                    //       exists = true
                    //     }
                    //     temp2.push(x)
                    //   })
                    // });
                    temp = x.data.result;
                    let temp2 = [...state.invoices];

                    // Create a Map to ensure uniqueness based on `id`
                    const map = new Map();

                    // Add all elements from temp2 to the map
                    temp2.forEach(item => map.set(item.id, item));

                    // Add all elements from temp to the map, ensuring `receiving` is set
                    temp.forEach(item => {
                      item.receiving = 0.0; // Add receiving property
                      map.set(item.id, item); // This will overwrite if the id already exists
                    });

                    // Get the union as an array
                    const union = Array.from(map.values());
                    console.log(union)
                    dispatch(setField({ field: 'invoices', value: union }))
                  })
                }catch(e){
                  console.log(e)
                }
              }} style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#438995", color: "white", borderRadius: 20 }}><span style={{marginRight: 5}}>Refresh</span> <SyncOutlined style={{ fontSize: 16 }}/></button>
            </Col>}
            {!(state.selectedAccount==""||state.selectedAccount==undefined)&&<Col md={2}>
              <button onClick={()=>{back()}} style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#438995", color: "white", borderRadius: 20 }}><ArrowLeftOutlined style={{ fontSize: 16 }}/><span style={{marginLeft: 5}}>Back</span></button>
            </Col>}
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col md={6}>
        <Select
          // allowClear
          showSearch
          style={{ width: '90%' }}
          placeholder={`Select ${state.type}`}
          value={state.selectedAccount}
          options={state.accounts.map((account) => ({
            label: `(${account.code}) ${account.name}`,
            value: account.id,
          }))}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(e) => {dispatch(setField({ field: 'selectedAccount', value: e }))}}
        />

        </Col>
        <Col md={1}>
          <Select 
            style={{ width: '90%' }}
            placeholder={`Curr`}
            value={state.currency}
            disabled={state.type != 'agent' ? true : false}
            onChange={(e)=>{dispatch(setField({ field: 'currency', value: e }))}}
          >
            <Select.Option value="PKR">PKR</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="EUR">EUR</Select.Option>
            <Select.Option value="GBP">GBP</Select.Option>
            <Select.Option vlaue="AED">AED</Select.Option>
            <Select.Option value="OMR">OMR</Select.Option>
            <Select.Option value="BDT">BDT</Select.Option>
            <Select.Option value="CHF">CHF</Select.Option>
          </Select>
        </Col>
        <Col md={5}>
          <Input
            placeholder='Search...'
            value={state.search}
            disabled={state.selectedAccount!=""&&state.selectedAccount!=undefined}
            onChange={(e) => {dispatch(setField({ field: 'search', value: e.target.value }))}}
          ></Input>
        </Col>
      </Row>
      <hr></hr>
      {(state.selectedAccount==""||state.selectedAccount==undefined)&&<table>
        <thead style={{backgroundColor: '#f3f3f3', color: 'black'}}>
          <tr>
            <th style={{ width: '7%', padding: 10 }}>Voucher No</th>
            <th style={{ width: '20%', padding: 10 }}>Name</th>
            <th style={{ width: '10%', padding: 10 }}>Party</th>
            <th style={{ width: '10%', padding: 10 }}>Type</th>
            <th style={{ width: '10%', padding: 10 }}>Date</th>
            <th style={{ width: '10%', padding: 10 }}>Currency</th>
            <th style={{ width: '10%', padding: 10 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {state.oldVouchers.filter((x) => {
            if(state.search.length > 0){
              if(x.name.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
              if(x.party.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
              if(x.type.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
              if(x.data.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
              if(x.currency.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
              if(x.amount.toLowerCase().includes(state.search.toLowerCase())){
                return x
              }
            }else{
              return x
            }
          }).map((x, i) => {
            return (
              <tr key={i} style={{borderBottom: '1px solid #d7d7d7', cursor: 'pointer'}} onClick={()=>{
                console.log(x);
                dispatch(setField({ field: 'type', value: x.party }))
                dispatch(setField({ field: 'edit', value: true }))
                dispatch(setField({ field: 'selectedAccount', value: parseInt(x.partyId) }))
                dispatch(setField({ field: 'currency', value: x.currency }))
                dispatch(setField({ field: 'date', value: moment(x.x.data) }))
                dispatch(setField({ field: 'checkNo', value: x.x.chequeNo }))
                dispatch(setField({ field: 'checkDate', value: moment(x.x.chequeDate) }))
                dispatch(setField({ field: 'exRate', value: x.x.exRate }))
                dispatch(setField({ field: 'voucherId', value: x.id }))
                dispatch(setField({ field: 'invoices', value: x.x.invoice }))
                x.x.Voucher_Heads.forEach((y) => {
                  console.log(y)
                  if(y.accountType=="payAccount"){
                    dispatch(setField({ field: 'receivingAccount', value: y.ChildAccountId }));
                    dispatch(setField({ field: 'receivingAmount', value: parseFloat(y.amount) }))
                  }
                  if(y.accountType=="partyAccount"){
                    dispatch(setField({ field: 'totalReceivable', value: parseFloat(y.amount) }));
                    // dispatch(setField({ field: 'selectedAccount', value: y.ChildAccountId }))
                  }
                  if(y.accountType=="Gain/Loss Account"){
                    dispatch(setField({ field: 'gainLossAmount', value: parseFloat(y.amount) }));
                    dispatch(setField({ field: 'gainLossAccount', value: y.ChildAccountId }))
                  }
                  if(y.accountType.includes('Charges Account')){
                    dispatch(setField({ field: 'bankChargesAmount', value: parseFloat(y.amount) }));
                    dispatch(setField({ field: 'bankChargesAccount', value: y.ChildAccountId }))
                  }
                  if(y.accountType.includes('Tax Account')){
                    dispatch(setField({ field: 'taxAmount', value: parseFloat(y.amount) }));
                    dispatch(setField({ field: 'taxAccount', value: y.ChildAccountId }))
                  }

                })
                if(x.type.includes('PV')){
                  dispatch(setField({ field: 'payType', value: 'Payble' }))
                }else{
                  dispatch(setField({ field: 'payType', value: 'Recievable' }))
                }
                if(x.type.includes('C')){
                  dispatch(setField({ field: 'transactionMode', value: 'Cash' }))
                }else{
                  dispatch(setField({ field: 'transactionMode', value: 'Bank' }))
                }

                }}>
                <td className='blue-txt fw-6 fs-12' style={{ padding: 10 }}>{x.voucherNo}</td>
                <td style={{ padding: 10 }}>{x.name}</td>
                <td style={{ padding: 10 }}>{x.party}</td>
                <td style={{ padding: 10 }}>{x.type}</td>
                <td style={{ padding: 10 }}>{x.data}</td>
                <td style={{ padding: 10 }}>{x.currency}</td>
                <td style={{ padding: 10 }}>{commas(x.amount)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>}
      {!(state.selectedAccount==""||state.selectedAccount==undefined)&&<BillComp back={back} companyId={Cookies.get('companyId')} state={state} dispatch={dispatch} />}
      <Modal 
        open={state.delete}
        onOk={()=>dispatch(setField({ field: 'delete', value: false }))}
        onCancel={()=> dispatch(setField({ field: 'delete', value: false }))}
        footer={false}
        maskClosable={false}
        title={<>Delete Voucher</>}
      >   
        <div>
          <h4>Are you sure?</h4>
          <div className='flex '>
            <button className='btn-red' onClick={()=>{
              deleteVoucher()
              dispatch(setField({ field: 'delete', value: false }))
            }}>Confirm</button>
            <button className='btn-custom mx-2 px-3'  onClick={() => dispatch(setField({ field: 'delete', value: false }))}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(PaymentsReceipt)