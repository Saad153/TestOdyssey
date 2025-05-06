import axios from 'axios';
import * as yup from "yup";
import { Checkbox, DatePicker, Input, Radio, Select, Tabs } from "antd";
import moment from 'moment';
import Cookies from 'js-cookie';
import Router from 'next/router';
import React, { useEffect ,useState} from 'react';
import { getJobValues } from '/apis/jobs';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
// import { createHistory } from './historyCreation';
import { Row, Col, Spinner } from 'react-bootstrap';
import { yupResolver } from "@hookform/resolvers/yup";
import DateComp from '/Components/Shared/Form/DateComp';
import { useForm, useFormContext, useWatch } from "react-hook-form";
import InputComp from '/Components/Shared/Form/InputComp';
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import openNotification from '/Components/Shared/Notification';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import { setField, setFullPartyState } from '../../../../redux/parties/partiesSlice';

const CreateOrEdit = ({id, representativeData, clientData}) => {

    const state = useSelector((state) => state.parties);
    const dispatch = useDispatch();

    const partyTypes = [
        { label: "Shipper", value: "Shipper" },
        { label: "Consignee", value: "Consignee" },
        { label: "Notify", value: "Notify" },
        { label: "Potential Customer", value: "Potential Customer" },
        { label: "Invoice Party", value: "Invoice Party" },
        { label: "Non operational Party", value: "Non operational Party" },
        { label: "Forwarder / Coloader", value: "Forwarder/Coloader" },
        { label: "Local Vendor", value: "Local Vendor" },
        { label: "Overseas Agent", value: "Overseas Agent" },
        { label: "Commission Agent", value: "Commission Agent" },
        { label: "Indentor", value: "Indentor" },
        { label: "Transporter", value: "Transporter" },
        { label: "CHA/CHB", value: "CHA/CHB" },
        { label: "Shipping Line", value: "Shipping Line" },
        { label: "Delivery Agent", value: "Delivery Agent" },
        { label: "Warehouse", value: "Warehouse" },
        { label: "Buying House", value: "Buying House" },
        { label: "Air Line", value: "Air Line" },
        { label: "Trucking", value: "Trucking" },
        { label: "Drayman", value: "Drayman" },
        { label: "Cartage", value: "Cartage" },
        { label: "Stevedore", value: "Stevedore" },
        { label: "Principal", value: "Principal" },
        { label: "Depot", value: "Depot" },
        { label: "Terminal", value: "Terminal" },
        { label: "Buyer", value: "Buyer" },
        { label: "Slot Operator", value: "Slot Operator" },
      ]
    const partyOperations = [
        { label: "Sea Export", value: "Sea Export" },
        { label: "Sea Import", value: "Sea Import" },
        { label: "Air Export", value: "Air Export" },
        { label: "Air Import", value: "Air Import" },
      ]
    const partyRoles = [
        { label: "Client", value: "client" },
        { label: "Vendor", value: "vendor" },
        { label: "Client / Vendor", value: "c/v" },
        { label: "Non-Gl", value: "nongl" },
      ]
    const partyCompany = [
        { label: "Sea Net Services", value: "1" },
        { label: "Air Cargo Services", value: "3" },
      ]
      
    useEffect(() => {
        console.log(clientData)
        console.log(state)
        if(clientData != null){
            // dispatch(setField({ field: 'code', value: clientData.code }));
            dispatch(setFullPartyState(clientData));
        }
    }, [clientData])
    
    return (
        <div className='base-page-layout'>
            <Row>
                <Col>
                    <br />
                    {id === "new" ? <h3>Party Create</h3> : <h3>Party Edit</h3>}
                    <hr />
                </Col>
            </Row>
            <Tabs defaultActiveKey='1'>
                <Tabs.TabPane tab="Basic Info" key={"1"}>
                    <Row>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={4}>
                            <Row>
                                <label>Name</label>
                            </Row>
                            <Input placeholder='Enter Name' value={state.name} type='text'></Input>
                        </Col>
                        <Col md={1}>
                            <Row>
                                <label>Code</label>
                            </Row>
                            {console.log(state)}
                            <Input disabled value={state.code} type='number'></Input>
                        </Col>
                        {/* <Col md={3}></Col> */}
                        <Col md={1}>
                            <Row>
                                <label>Status</label>
                            </Row>
                            {/* <Input type='number'></Input> */}
                            <Select value={state.active} style={{width :'100%'}}>
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Inactive</Select.Option>
                            </Select>
                        </Col>
                        {/* <Col md={1}></Col> */}
                        <Col md={2}>
                            <Row>
                                <label>Register Date</label>
                            </Row>
                            <DatePicker value={moment(state.registerDate)} style={{width :'100%'}}></DatePicker>
                        </Col>
                        <Col md={2}>
                            <Row>
                                <label>City</label>
                            </Row>
                            <Input placeholder='Enter City' value={state.city} type='text'></Input>
                        </Col>
                        <Col md={2}>
                            <Row>
                                <label>Zip</label>
                            </Row>
                            <Input placeholder='Enter Zip' value={state.zip} type='text'></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <label>Address 1</label>
                            </Row>
                            <Input placeholder='Enter First Address' value={state.address1} type='text'></Input>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <label>Address 2</label>
                            </Row>
                            <Input placeholder='Enter Second Address' value={state.address2} type='text'></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={3}>
                            <Row>
                                <label>Person 1</label>
                            </Row>
                            <Input value={state.person1} placeholder='Enter Person 1' type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Mobile 1</label>
                            </Row>
                            <Input value={state.mobile1} placeholder='Enter Mobile 1' type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Person 2</label>
                            </Row>
                            <Input value={state.person2} placeholder='Enter Person 2' type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Mobile 2</label>
                            </Row>
                            <Input value={state.mobile2} placeholder='Enter Mobile 2' type='text'></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={3}>
                            <Row>
                                <label>Telephone 1</label>
                            </Row>
                            <Input value={state.telephone1} placeholder='Enter Telephone 1' type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Telephone 2</label>
                            </Row>
                            <Input value={state.telephone2} placeholder='Enter Telephone 2' type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Website</label>
                            </Row>
                            <Input placeholder='Enter Website' value={state.website} type='text'></Input>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <label>Info Mail</label>
                            </Row>
                            <Input placeholder='Enter Info Mail' value={state.infoMail} type='text'></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={4}>
                            <Row>
                                <label>Accounts Mail</label>
                            </Row>
                            <Input placeholder='Enter Accounts Mail' value={state.accountsMail} type='text'></Input>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <label>NTN No.</label>
                            </Row>
                            <Input placeholder='Enter NTN No.' value={state.ntnNo} type='text'></Input>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <label>STRN No.</label>
                            </Row>
                            <Input placeholder='Enter STRN No.' value={state.strnNo} type='text'></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={4}>
                            <Row style={{marginBottom: 10}}>
                                <label>Operations</label>
                            </Row>
                            {/* <br/> */}
                            <Checkbox.Group
                                onChange={(e) => {
                                    const newValue = e.join(', ');
                                    // setState(prev => ({ ...prev, types: newValue }));
                                    dispatch(setField({ field: 'operations', value: newValue }))
                                    console.log("CheckBox Group: ", newValue);
                                }}
                                value={state.types ? state.operations.split(', ') : []}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '0px 0px',
                                }}
                            >
                                {partyOperations.map((item) => (
                                    <Checkbox style={{ margin: '1px' }} key={item.value} value={item.value}>
                                        {item.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Col>
                        <Col style={{borderLeft: '1px solid #d7d7d7'}} md={4}>
                            <Row style={{marginBottom: 10}}>
                                <label>Customer/Vendor</label>
                            </Row>
                            {/* <br/> */}
                            <Checkbox.Group
                                onChange={(e) => {
                                    // const newValue = e.join(', ');
                                    // setState(prev => ({ ...prev, types: newValue }));
                                    dispatch(setField({ field: 'partyType', value: e }))
                                    console.log("CheckBox Group: ", e);
                                }}
                                value={state.partyType}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '0px 0px',
                                }}
                            >
                                {partyRoles.map((item) => (
                                    <Checkbox style={{ margin: '1px' }} key={item.value} value={item.value}>
                                        {item.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Col>
                        <Col style={{borderLeft: '1px solid #d7d7d7'}} md={4}>
                            <Row style={{marginBottom: 10}}>
                                <label>Companies</label>
                            </Row>
                            {/* <br/> */}
                            <Checkbox.Group
                                onChange={(e) => {
                                    // const newValue = e.join(', ');
                                    // setState(prev => ({ ...prev, types: newValue }));
                                    dispatch(setField({ field: 'companyId', value: e }))
                                    console.log("CheckBox Group: ", e);
                                }}
                                value={state.companyId.toString()}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '0px 0px',
                                }}
                            >
                                {partyCompany.map((item) => (
                                    <Checkbox style={{ margin: '1px' }} key={item.value} value={item.value}>
                                        {item.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={12}>
                            <Row style={{marginBottom: 10}}>
                                <label>Types</label>
                            </Row>
                            {/* <br/> */}
                            {/* <Checkbox.Group
                                options={partyTypes}
                                style={{ fontSize:16, width: '100%' }}
                            /> */}
                            <Checkbox.Group
                                onChange={(e) => {
                                    const newValue = e.join(', ');
                                    // setState(prev => ({ ...prev, types: newValue }));
                                    dispatch(setField({ field: 'types', value: newValue }))
                                    console.log("CheckBox Group: ", newValue);
                                }}
                                value={state.types ? state.types.split(', ') : []}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '0px 0px',
                                }}
                            >
                                {partyTypes.map((item) => (
                                    <Checkbox style={{ margin: '1px' }} key={item.value} value={item.value}>
                                        {item.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>


                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Bank Info" key={"2"}></Tabs.TabPane>
                <Tabs.TabPane tab="Account Info" key={"3"}></Tabs.TabPane>
                <Tabs.TabPane tab="Company Info" key={"4"}></Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default React.memo(CreateOrEdit)