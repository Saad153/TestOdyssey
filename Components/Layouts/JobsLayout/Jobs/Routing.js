import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import InputComp from '/Components/Shared/Form/InputComp';
import DateComp from '/Components/Shared/Form/DateComp';
import { Row, Col } from 'react-bootstrap';
import ports from "/jsonData/ports";
import airports from "/jsonData/airports";
import React from 'react';
import { DatePicker, Select } from 'antd';

const Routing = ({setJobField, state}) => {


  return (
    <div>
        <Row>

            <Col md={6}>
                <Row>
                    <label>Port Of Loading</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
                <Row className='mt-3'>
                    <label>Port Of Discharge</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
                <Row className='mt-3'>
                    <label>Final Destination</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
                <Row className='mt-3'>
                    <label>Freight Payable At</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
                <Row className='mt-3'>
                    <label>Terminal</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
                <Row className='mt-3'>
                    <label>Delivery</label>
                </Row>
                <Select style={{width: '100%'}}></Select>
            </Col>
            <Col md={6} className='px-4'>
                <Row>
                    <Row>
                        <label>POL Date</label>
                    </Row>
                    <DatePicker style={{width: '30%'}}></DatePicker>
                </Row>
                <Row className='mt-3'>
                    <Row>
                        <label>POD Date</label>
                    </Row>
                    <DatePicker style={{width: '30%'}}></DatePicker>
                </Row>
            </Col>
        </Row>
    </div>
  )
}

export default React.memo(Routing)