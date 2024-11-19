import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { setType, setPayType, setOperation, setCurrency, setExRate, setPartyId, setPartyName, setPaid, setRecieved, setRoundOff, setTotal, setPartyType, setNote, setCreatedAt } from '/redux/openingInvoices/openingInvoicesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Select } from 'antd'

const OpeningInvoice = () => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.openingInvoice);
  const { payType } = useSelector((state) => state.openingInvoice);
  const { operation } = useSelector((state) => state.openingInvoice);
  const { createdAt } = useSelector((state) => state.openingInvoice);
  const { currency } = useSelector((state) => state.openingInvoice);


  return (
    <div className='base-page-layout'>
      <Col>
      <h5>Opening Invoice</h5>
      <hr></hr>
      </Col>
      <Row style={{width:'100%', margin: 0}}>

        <Col style={{ padding: 0}} md={2}>
          <Row className='' style={{width:"100%", margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{width:"20%"}}>
              Type
            </div>
            <Select style={{ width: '60%', marginLeft: '5%' }} value={type} onChange={(e) => dispatch(setType(e))}>
              <Select.Option value="JI">Job Invoice</Select.Option>
              <Select.Option value="AI">Agent Invoice</Select.Option>
              <Select.Option value="JB">Job Bill</Select.Option>
              <Select.Option value="AB">Agent Bill</Select.Option>
            </Select>
          </Row>
        </Col>
        <Col style={{ padding: 0}} md={2}>
          <Row className='' style={{width:"100%", margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{width:"35%"}}>
              Pay Type
            </div>
            <Select style={{ width: '60%', marginLeft: '5%' }} value={payType} onChange={(e) => dispatch(setPayType(e))}>
              <Select.Option value="Recievable">Recievable</Select.Option>
              <Select.Option value="Payble">Payable</Select.Option>
            </Select>
          </Row>
        </Col>
        <Col style={{ padding: 0}} md={2}>
          <Row className='' style={{width:"100%", margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{width:"35%"}}>
              Operation
            </div>
            <Select style={{ width: '60%', marginLeft: '5%' }} value={operation} onChange={(e) => dispatch(setOperation(e))}>
              <Select.Option value="AE">Air Export</Select.Option>
              <Select.Option value="AI">Air Import</Select.Option>
              <Select.Option value="SE">Sea Export</Select.Option>
              <Select.Option value="SI">Sea Import</Select.Option>
            </Select>
          </Row>
        </Col>
        <Col style={{ padding: 0}} md={2}>
          <Row className='' style={{width:"100%", margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{width:"20%"}}>
              Date
            </div>
            <DatePicker style={{ width: '65%', marginLeft: '5%' }} value={createdAt} onChange={(e) => dispatch(setCreatedAt(e))}>
            </DatePicker>
          </Row>
        </Col>
        <Col style={{ padding: 0}} md={2}>
          <Row className='' style={{width:"100%", margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{width:"50%"}}>
              Currency
            </div>
            <Select style={{ width: '45%', marginLeft: '5%' }} value={currency} onChange={(e) => dispatch(setCurrency(e))}>
              <Select.Option value="PKR">PKR</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="EUR">EUR</Select.Option>
              <Select.Option value="GPB">GPB</Select.Option>
            </Select>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default OpeningInvoice