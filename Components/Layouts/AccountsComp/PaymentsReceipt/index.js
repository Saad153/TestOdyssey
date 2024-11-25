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
  useEffect(() => {
    const fetchOldVouchers = async () => {
      axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OLD_PAY_REC_VOUCHERS, {
        headers: { companyid: Cookies.get('companyId') }
      }).then((x) => {
        console.log(x.data.result)
        const temp = [];
        temp.push(...x.data.result.map((x) => { // Use spread syntax to flatten the result
          return {
            id: x.id,
            voucherNo: x.voucher_Id,
            name: x.partyName,
            party: x.partyType,
            type: x.vType,
            data: moment(x.createdAt).format('DD-MM-YYYY'),
            currency: x.currency,
            amount: x.Voucher_Heads[0].amount,
            partyId: x.partyId,
            x: x
          };
        }));

        dispatch(setField({ field: 'oldVouchers', value: temp }));
      })
        
      }
    if(state.oldVouchers.length == 0){
      // dispatch(setField({ field: 'selectedAccount', value: selectedAccount }));
      fetchOldVouchers();
    }
  })

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH,
        { search: state.searchAccount, type: state.type }
      ).then((x) => {
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
              <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#921a12", color: "white", borderRadius: 20 }}><span style={{marginRight: 5}}>Delete</span> <MdDeleteForever style={{ fontSize: 16 }}/></button>
            </Col>}
            {(!(state.selectedAccount==""||state.selectedAccount==undefined)&&state.edit)&&<Col md={3}>
              <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#1f2937", color: "white", borderRadius: 20 }}><span style={{marginRight: 5}}>Cheque Return</span> <RollbackOutlined style={{ fontSize: 16 }}/></button>
            </Col>}
            {(!(state.selectedAccount==""||state.selectedAccount==undefined)&&state.edit)&&<Col md={2}>
              <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#438995", color: "white", borderRadius: 20 }}><span style={{marginRight: 5}}>Refresh</span> <SyncOutlined style={{ fontSize: 16 }}/></button>
            </Col>}
            {!(state.selectedAccount==""||state.selectedAccount==undefined)&&<Col md={2}>
              <button onClick={()=>{
                dispatch(setField({ field: 'selectedAccount', value: undefined }));
                dispatch(setField({ field: 'invoices', value: [] }))
                dispatch(setField({ field: 'edit', value: false }))
                }} style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#438995", color: "white", borderRadius: 20 }}><ArrowLeftOutlined style={{ fontSize: 16 }}/><span style={{marginLeft: 5}}>Back</span></button>
            </Col>}
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col md={6}>
        <Select
          allowClear
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
                dispatch(setField({ field: 'selectedAccount', value: x.partyId }))
                dispatch(setField({ field: 'currency', value: x.currency }))
                if(x.type=='BPV'||x.type=='CPV'){
                  dispatch(setField({ field: 'payType', value: 'Payble' }))
                }else{
                  dispatch(setField({ field: 'payType', value: 'Recievable' }))
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
      {!(state.selectedAccount==""||state.selectedAccount==undefined)&&<BillComp companyId={Cookies.get('companyId')} state={state} dispatch={dispatch} />}
    </div>
  )
}

export default React.memo(PaymentsReceipt)