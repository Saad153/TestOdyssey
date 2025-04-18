import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import PopConfirm from '/Components/Shared/PopConfirm';
import Pagination from '/Components/Shared/Pagination';
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import { Input } from 'antd';
import { checkEmployeeAccess } from '../../../../../functions/checkEmployeeAccess';
import { checkEditAccess } from '../../../../../functions/checkEditAccess';
import { resetState } from '/redux/vouchers/voucherSlice';
const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const ListData = ({ voucherData }) => {
  // console.log(voucherData)
  const [rowData, setRowData] = useState();
  const [originalData, setOriginalData] = useState();
  const [query, setQuery] = useState("");
  
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
    () => {
      axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
        id: id
      }).then((x) => {
        Router.push("/accounts/voucherList")
      })
    })
  };

  
  const handleEdit = async (voucherId) => {
    await Router.push(`/accounts/vouchers/${voucherId}`);
    dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${voucherId}` }));
  };

  useEffect(() => {
    setData(voucherData);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = rowData ? rowData.slice(indexOfFirst, indexOfLast) : [];
  const noOfPages = rowData ? Math.ceil(rowData.length / recordsPerPage) : 0;

  const setData = async (data) => {
    let tempData = data
    await tempData?.forEach((x, i) => {
      x.no = i + 1;
      x.amount = x.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0),
        x.date = moment(x.createdAt).format("YYYY-MM-DD")
    });
    setRowData(tempData);
    setOriginalData(tempData);
  };

  return (
    <>
      <Row>
        <Col md="6"><h5></h5></Col>
        <Col md="4">
          <div className='d-flex justify-content-end'>
            <Input type="text" placeholder="Enter Voucher No" size='sm' onChange={e => setQuery(e.target.value)} />
          </div>
        </Col>
        <Col md="2">
          <button className='btn-custom left'
            onClick={async () => {
              dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": "new" }))
              dispatch(resetState())
              await Router.push(`/accounts/vouchers/new`)
            }}
          > Create </button>
        </Col>
      </Row>
      <hr />
      <div className='mt-3' style={{ maxHeight: "55vh", overflowY: 'auto', overflowX: "scroll" }}>
        <Table className='tableFixHead'>
          <thead>
            <tr>
              <th style={{width:130}}>No #</th>
              <th style={{width:10}}>Type</th>
              <th style={{width:150}}>Cheque</th>
              <th>Paid to</th>
              <th style={{width:170}}>Amount</th>
              <th style={{width:120}}>Dated</th>
              <th style={{width:80}}>Made By</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {(query?originalData:currentRecords)?.filter((x)=>{
                return x.voucher_Id.toLowerCase().includes(query.toLowerCase()) ||
                x?.chequeNo?.toLowerCase().includes(query.toLowerCase()) ||
                x?.payTo?.toLowerCase().includes(query.toLowerCase()) ||
                x?.chequeDate?.toLowerCase().includes(query.toLowerCase()) ||
                x?.vType?.toLowerCase().includes(query.toLowerCase()) ||
                x?.currency?.toLowerCase().includes(query.toLowerCase()) ||
                x?.amount?.toString().includes(query)
              }).map((x, index) => {
                return (
                  <tr key={index}>
                    <td className='blue-txt fw-6 fs-12'>{x.voucher_Id}</td>
                    <td>{x.vType}</td>
                    <td>
                      Date: <span className='blue-txt'>{x.chequeDate ? moment(x.chequeDate).format("YYYY-MM-DD") : "-"}</span>
                      <br/>
                      No.: <span className='blue-txt'>{x.chequeNo}</span>
                    </td>
                    <td>{x.payTo}</td>
                    <td>
                      <span style={{ color: 'grey' }}>Rs. </span>
                      <span className='blue-txt fw-6'>{commas(x.amount)}</span>
                    </td>
                    <td>{moment(x.createdAt).format("YYYY-MM-DD")}</td>
                    <td>{x.createdBy}</td>
                    <td style={{cursor:"pointer"}} onClick={() => handleEdit(x.id)}>
                     {checkEditAccess() && <span className='fs-15 text-dark'><RiEdit2Fill /></span> } 
                    </td>
                    <td style={{cursor:"pointer"}} onClick={() => handleDelete(x.id)}>
                      {checkEmployeeAccess() && <span className='fs-15 text-danger'><RiDeleteBin2Fill /></span>}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      {(query==''||query==null) &&
       <div className='d-flex justify-content-end items-end my-4' style={{ maxWidth: "100%" }} >
        <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      }
    </>
  );
};

export default React.memo(ListData)