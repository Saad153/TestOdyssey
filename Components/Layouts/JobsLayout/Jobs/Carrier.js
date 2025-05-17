import React, { useEffect } from 'react';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import InputComp from '/Components/Shared/Form/InputComp';
import Dates from './Dates';
import { DatePicker, Popover, Select, TimePicker } from "antd";
import { Row, Col } from "react-bootstrap";

const Carrier = ({state, dispatch}) => {

  return (
    <div className='px-2 pb-2 mt-3' style={{border:'1px solid silver'}}>
        <Row className='mt-2'>
            <Row>
                <label 
              style={{cursor: 'pointer', color: '#007bff', marginLeft: '7.5px'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Vessel*</label>
            </Row>
            <Select style={{margin: '1% 5%', width: '90%'}} placeholder='Select Vessel'></Select>
        </Row>
        <Row className='mt-2'>
            <Row>
                <label 
              style={{cursor: 'pointer', color: '#007bff', marginLeft: '7.5px'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Voyage*</label>
            </Row>
            <Select style={{margin: '1% 5%', width: '90%'}} placeholder='Select Voyage'></Select>
        </Row>
        <Row className='mt-2'>
          <Col md={6}>
          <Row>
            <label 
              style={{marginLeft: '7.5px'}}
              >ETD</label>
          </Row>
          <DatePicker style={{margin: '1% 5%', width: '90%'}} placeholder='Select Date'></DatePicker>
          </Col>
          <Col md={6}>
          <Row>
            <label 
              style={{marginLeft: '7.5px'}}
              >ETA</label>
          </Row>
          <DatePicker style={{margin: '1% 5%', width: '90%'}} placeholder='Select Date'></DatePicker>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col md={6}>
          <Row>
            <label 
              style={{marginLeft: '7.5px'}}
              >Cut Off</label>
          </Row>
          <DatePicker style={{margin: '1% 5%', width: '90%'}} placeholder='Select Date'></DatePicker>
          </Col>
          <Col md={6}>
          <Row>
            <label 
              style={{marginLeft: '7.5px'}}
              >Time</label>
          </Row>
          <TimePicker style={{margin: '1% 5%', width: '90%'}} placeholder='Select Time'></TimePicker>
          </Col>
        </Row>
    </div> 
  )}

export default React.memo(Carrier)