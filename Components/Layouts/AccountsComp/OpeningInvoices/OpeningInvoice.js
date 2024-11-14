import { InputNumber, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'

const OpeningInvoice = (id, voucherData) => {
  const [payType, setPayType] = useState("Recievable");
  console.log(id)
  console.log(voucherData)
  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12}>
          <h5>Opening Invoice {id.id}</h5>
          <hr></hr>
        
        </Col>
        <Row md={12}>
          <Col md={2} style={{paddingRight: 0}}>
            <label style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>Currency:
                <Select
                  defaultValue={"PKR"}
                  dropdownStyle={{ minWidth: "5%", height: "100px", borderRadius: "10px" }}
                  style={{ minWidth: "65%", marginLeft: '5px', borderRadius: "15px", padding:0 }}
                >
                  <Option value="PKR">PKR</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
            </label>
          </Col>
          <Col md={2} style={{padding: 0}}>
            <label style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>Ex-Rate:
                <InputNumber style={{ minWidth: "60%", marginLeft: '5px', borderRadius: "5px", padding:0 }}></InputNumber>
            </label>
          </Col>
          <Col md={2} style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: 0 }}>
          <label style={{marginRight: '10px'}}>
            <input style={{ marginRight: '5px' }} type='radio' value={"Payable"} checked={payType === "Payable"} onChange={(e) => setPayType(e.target.value)}/><span style={{ marginBottom: '5px' }}>Payable</span>
          </label>
          <label>
            <input style={{ marginRight: '5px' }} type='radio' value={"Recievable"} checked={payType === "Recievable"} onChange={(e) => setPayType(e.target.value)}/><span style={{ marginBottom: '5px' }}>Recievable</span>
          </label>
          </Col>
        </Row>
      </Row>
    </div>
  )
}

export default OpeningInvoice