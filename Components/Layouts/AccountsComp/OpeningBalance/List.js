import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from "react-bootstrap";
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import PopConfirm from '/Components/Shared/PopConfirm';
import Cookies from 'js-cookie';


const OpeningBalance = ({sessionData, openingBalancesList}) => {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(openingBalancesList.result)
  }, [])

  const getData = async() => {
    let openingBalances = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OPENING_BALANCES,{
      headers:{"id": `${Cookies.get('companyId')}`}
    }).then((x)=>x.data);
    setRecords(openingBalances.result)
  }

  const handleDelete = (id) => {
    console.log(id)
    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
    async () => {
      console.log(id)
      const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
        id: id
      })
      console.log(result)
      getData();
    })
  };

  return (
  <div className='base-page-layout'>
    <Row>
      <Col md={10}>
        <h5>Opening Balance List</h5>
      </Col>
      <Col>
        <button className='btn-custom' style={{float:'right'}} onClick={()=>Router.push("/accounts/openingBalance/new")}
        >Create</button>
      </Col>
    </Row>
    <hr/>
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
    <Table className='tableFixHead' bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Voucher Id</th>
          <th>Cost Center</th>
          <th>Currency</th>
          <th>Ex. Rate</th>
          <th>Date</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
      {records?.map((x, index) => {
      return (
      <tr key={index} className='f table-row-center-singleLine row-hov'
        
      >
        <td>{x?.voucher_No}</td>
        <td onClick={()=>Router.push(`/accounts/openingBalance/${x.id}`)}>{x?.voucher_Id}</td>
        <td>{x?.costCenter}</td>
        <td>{x?.currency}</td>
        <td>{x.exRate}</td>
        <td>{moment(x?.createdAt).format("YYYY-MM-DD")}</td>
        <td><DeleteOutlined onClick={(e) => { e.stopPropagation(); handleDelete(x.id) }} /></td>
      </tr>
      )})}
      </tbody>
    </Table>
    </div>
  </div>
  )
}

export default OpeningBalance