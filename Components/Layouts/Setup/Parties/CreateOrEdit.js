import axios from 'axios';
import * as yup from "yup";
import { Button, Checkbox, DatePicker, Input, Radio, Select, Tabs } from "antd";
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
import { MdDeleteForever } from 'react-icons/md';
import { SaveOutlined } from '@ant-design/icons';
import { incrementTab } from '/redux/tabs/tabSlice';

const CreateOrEdit = ({id, representativeData, clientData}) => {

    const state = useSelector((state) => state.parties);
    const dispatch = useDispatch();
    const [pAccountList, setPAccountList] = useState([]);
    const [Sr, setSr] = useState([]);
    const [Ar, setAr] = useState([]);
    const [Dr, setDr] = useState([]);

    const fetchParentAccounts = async () => {
        const pAccounts = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/coa/getParentAccounts`,{ headers:{companyid: Cookies.get('companyId')} }).then((x) => {return x.data.result});
        // console.log("Parent Accounts", pAccounts)
        setPAccountList(pAccounts);
    }
    const fetchEmployees = async () => {
        const RepEmps = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,).then((x) => {return x.data.result});
        // console.log("Rep Employees", RepEmps)
        // setPAccountList(pAccounts);
        setSr(RepEmps.Sr)
        setAr(RepEmps.Ar)
        setDr(RepEmps.Dr)
    }

    const handleSubmit = async () => {
        // console.log(state);
        const result = await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/parties/upsertParty`, state);
        // console.log("Result: ", result);

        dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": result.data.result.id }));
        Router.push(`/setup/party/${result.data.result.id}`);

    }

    useEffect(() => {
        fetchParentAccounts();
        fetchEmployees();
    }, []);
    dispatch(setField({ field: 'selectedCompany', value: Cookies.get('companyId') }))

    const partyTypes = [
        { label: "Shipper", value: "Shipper" },
        { label: "Consignee", value: "Consignee" },
        { label: "Notify", value: "Notify" },
        { label: "Potential Customer", value: "Potential Customer" },
        { label: "Invoice Party", value: "Invoice Party" },
        { label: "Non operational Party", value: "Non operational Party" },
        { label: "Forwarder/Coloader", value: "Forwarder/Coloader" },
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
        // console.log(clientData)
        // console.log(state)
        if(clientData != null){
            // dispatch(setField({ field: 'code', value: clientData.code }));
            dispatch(setFullPartyState(clientData));
        }
    }, [clientData])
    
    return (
        <div className='base-page-layout'>
            <Row>
                <br />
                <Col md={10}>
                    {id === "new" ? <h3>Party Create</h3> : <h3>Party Edit</h3>}
                </Col>
                <Col md={1}>
                    <Row  style={{padding: '10px'}}>
                        <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#1f2937", color: "white", borderRadius: 20 }}
                        onClick={()=>{
                            handleSubmit()
                        }}
                        ><span style={{marginRight: 5}}>{id=='new'?"Create":"Update"}</span><SaveOutlined style={{ fontSize: 14 }}/></button>
                    </Row>
                </Col>
                {id != "new" && <Col md={1}>
                    <Row style={{padding: '10px'}}>
                        <button style={{ fontSize: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#921a12", color: "white", borderRadius: 20 }}
                        onClick={()=>{}}
                        ><span style={{marginRight: 5}}>Delete</span> <MdDeleteForever style={{ fontSize: 16 }}/></button>
                    </Row>
                </Col>}
                    <hr />
            </Row>
            <Row>
                <Col>
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
                                    <Input placeholder='Enter Name' value={state.name} type='text' onChange={(e) => dispatch(setField({ field: 'name', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={1}>
                                    <Row>
                                        <label>Code</label>
                                    </Row>
                                    {/* {console.log(state)} */}
                                    <Input disabled value={state.code} type='number'></Input>
                                </Col>
                                {/* <Col md={3}></Col> */}
                                <Col md={1}>
                                    <Row>
                                        <label>Status</label>
                                    </Row>
                                    {/* <Input type='number'></Input> */}
                                    <Select value={state.active} style={{width :'100%'}} onChange={(e) => dispatch(setField({ field: 'active', value: e }))}>
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Col>
                                {/* <Col md={1}></Col> */}
                                <Col md={2}>
                                    <Row>
                                        <label>Register Date</label>
                                    </Row>
                                    <DatePicker value={moment(state.registerDate)} style={{width :'100%'}} onChange={(e) => dispatch(setField({ field: 'registerDate', value: e }))}></DatePicker>
                                </Col>
                                <Col md={2}>
                                    <Row>
                                        <label>City</label>
                                    </Row>
                                    <Input placeholder='Enter City' value={state.city} type='text' onChange={(e) => dispatch(setField({ field: 'city', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={2}>
                                    <Row>
                                        <label>Zip</label>
                                    </Row>
                                    <Input placeholder='Enter Zip' value={state.zip} type='text' onChange={(e) => dispatch(setField({ field: 'zip', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={6}>
                                    <Row>
                                        <label>Address 1</label>
                                    </Row>
                                    <Input placeholder='Enter First Address' value={state.address1} type='text' onChange={(e) => dispatch(setField({ field: 'address1', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={6}>
                                    <Row>
                                        <label>Address 2</label>
                                    </Row>
                                    <Input placeholder='Enter Second Address' value={state.address2} type='text' onChange={(e) => dispatch(setField({ field: 'address2', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <label>Person 1</label>
                                    </Row>
                                    <Input value={state.person1} placeholder='Enter Person 1' type='text' onChange={(e) => dispatch(setField({ field: 'person1', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Mobile 1</label>
                                    </Row>
                                    <Input value={state.mobile1} placeholder='Enter Mobile 1' type='text' onChange={(e) => dispatch(setField({ field: 'mobile1', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Person 2</label>
                                    </Row>
                                    <Input value={state.person2} placeholder='Enter Person 2' type='text' onChange={(e) => dispatch(setField({ field: 'person2', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Mobile 2</label>
                                    </Row>
                                    <Input value={state.mobile2} placeholder='Enter Mobile 2' type='text' onChange={(e) => dispatch(setField({ field: 'mobile2', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <label>Telephone 1</label>
                                    </Row>
                                    <Input value={state.telephone1} placeholder='Enter Telephone 1' type='text' onChange={(e) => dispatch(setField({ field: 'telephone1', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Telephone 2</label>
                                    </Row>
                                    <Input value={state.telephone2} placeholder='Enter Telephone 2' type='text' onChange={(e) => dispatch(setField({ field: 'telephone2', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Website</label>
                                    </Row>
                                    <Input placeholder='Enter Website' value={state.website} type='text' onChange={(e) => dispatch(setField({ field: 'website', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Info Mail</label>
                                    </Row>
                                    <Input placeholder='Enter Info Mail' value={state.infoMail} type='text' onChange={(e) => dispatch(setField({ field: 'infoMail', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={4}>
                                    <Row>
                                        <label>Accounts Mail</label>
                                    </Row>
                                    <Input placeholder='Enter Accounts Mail' value={state.accountsMail} type='text' onChange={(e) => dispatch(setField({ field: 'accountsMail', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>NTN No.</label>
                                    </Row>
                                    <Input placeholder='Enter NTN No.' value={state.ntnNo} type='text' onChange={(e) => dispatch(setField({ field: 'ntnNo', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>STRN No.</label>
                                    </Row>
                                    <Input placeholder='Enter STRN No.' value={state.strnNo} type='text' onChange={(e) => dispatch(setField({ field: 'strnNo', value: e.target.value }))}></Input>
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
                                            // console.log("CheckBox Group: ", newValue);
                                        }}
                                        value={state.operations ? state.operations.split(', ') : []}
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
                                <Col style={{ borderLeft: '1px solid #d7d7d7' }} md={4}>
                                <Row style={{ marginBottom: 10 }}>
                                    <label>Customer/Vendor</label>
                                </Row>
                                <Radio.Group
                                    onChange={(e) => {
                                    dispatch(setField({ field: 'partyType', value: e.target.value }));
                                    // console.log("Radio Group: ", e.target.value);
                                    }}
                                    value={state.partyType}
                                    style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '0px 0px',
                                    }}
                                >
                                    {partyRoles.map((item) => (
                                    <Radio style={{ margin: '1px' }} key={item.value} value={item.value}>
                                        {item.label}
                                    </Radio>
                                    ))}
                                </Radio.Group>
                                </Col>
                                <Col style={{borderLeft: '1px solid #d7d7d7'}} md={4}>
                                    <Row style={{marginBottom: 10}}>
                                        <label>Companies</label>
                                    </Row>
                                    {/* <br/> */}
                                    <Checkbox.Group
                                        disabled={id!='new'?true:false}
                                        onChange={(e) => {
                                            // const newValue = e.join(', ');
                                            // setState(prev => ({ ...prev, types: newValue }));
                                            dispatch(setField({ field: 'companyId', value: e }))
                                            // console.log("CheckBox Group: ", e);
                                        }}
                                        value={state.companyId.toString()}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
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
                            <Row style={{marginTop: '10px'}}>
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
                                            // console.log("CheckBox Group: ", newValue);
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
                        <Tabs.TabPane tab="Bank Info" key={"2"}>
                            <br/>
                            <Row>
                                <Col md={4}>
                                    <Row>
                                        <label>Bank Name</label>
                                    </Row>
                                    <Input value={state.bank} type='text' onChange={(e) => dispatch(setField({ field: 'bank', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>Branch Name</label>
                                    </Row>
                                    <Input value={state.branchName} type='text' onChange={(e) => dispatch(setField({ field: 'branchName', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>Branch Code</label>
                                    </Row>
                                    <Input value={state.branchCode} type='text' onChange={(e) => dispatch(setField({ field: 'branchCode', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={6}>
                                    <Row>
                                        <label>Account Number</label>
                                    </Row>
                                    <Input value={state.accountNo} type='text' onChange={(e) => dispatch(setField({ field: 'accountNo', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={6}>
                                    <Row>
                                        <label>IBAN</label>
                                    </Row>
                                    <Input value={state.iban} type='text' onChange={(e) => dispatch(setField({ field: 'iban', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <label>Routing No.</label>
                                    </Row>
                                    <Input value={state.routingNo} type='text' onChange={(e) => dispatch(setField({ field: 'routingNo', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Swift Code</label>
                                    </Row>
                                    <Input value={state.swiftCode} type='text' onChange={(e) => dispatch(setField({ field: 'swiftCode', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>IFSC Code</label>
                                    </Row>
                                    <Input value={state.ifscCode} type='text' onChange={(e) => dispatch(setField({ field: 'ifscCode', value: e.target.value }))}></Input>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>MICR Code</label>
                                    </Row>
                                    <Input value={state.micrCode} type='text' onChange={(e) => dispatch(setField({ field: 'micrCode', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <label>Bank Authorize Date</label>
                                    </Row>
                                    <DatePicker style={{width: '100%'}} value={state.bankAuthorizeDate?moment(state.bankAuthorizeDate):null} onChange={(e) => dispatch(setField({ field: 'bankAuthorizeDate', value: e?e.format('YYYY-MM-DD'):null }))}></DatePicker>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <label>Authorized By</label>
                                    </Row>
                                    <Input value={state.createdBy} type='text' onChange={(e) => dispatch(setField({ field: 'createdBy', value: e.target.value }))}></Input>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Account Info" key={"3"}>
                            <br/>
                            <Row>
                                <Col md={5}>
                                    <Row>
                                        <label>Parent Account</label>
                                    </Row>
                                    <Select
                                    disabled={state.partyType === 'nongl' ? true : false}
                                    value={state.coa?.parent?.id}
                                    style={{ width: '100%' }}
                                    onChange={(e) =>
                                        dispatch(setField({
                                        field: 'coa',
                                        value: {
                                            ...state.coa,
                                            parent: {
                                            ...state.coa.parent,
                                            id: e
                                            }
                                        }
                                        }))
                                    }
                                    >
                                        {pAccountList.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                ({item.code}) - {item.title}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col md={5}>
                                    <Row>
                                        <label>Account Name</label>
                                    </Row>
                                    <Input disabled={state.partyType === 'nongl' ? true : false} value={state.coa?.title} type='text'
                                        onChange={(e) => {
                                            dispatch(setField({
                                              field: 'coa',
                                              value: {
                                                ...state.coa,
                                                title: e.target.value
                                              }
                                            }));
                                          }}
                                    ></Input>
                                </Col>
                                <Col md={2}>
                                    <Row>
                                        <label>Currency</label>
                                    </Row>
                                    <Select value={state.currency} style={{width: '100%'}}></Select>
                                </Col>
                            </Row>
                            <br/>
                            <hr/>
                            <br/>
                            <Row>
                                <Col md={4}>
                                    <Row>
                                        <label>Accounts Representative</label>
                                    </Row>
                                    <Select value={state.AccRepId} style={{width: '100%'}} onChange={(e) => dispatch(setField({ field: 'AccRepId', value: e }))}>
                                        {Ar.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>Sales Representative</label>
                                    </Row>
                                    <Select value={state.SalesRepId} style={{width: '100%'}} onChange={(e) => dispatch(setField({ field: 'SalesRepId', value: e }))}>
                                        {Sr.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col md={4}>
                                    <Row>
                                        <label>Doc Representative</label>
                                    </Row>
                                    <Select value={state.DocRepId} style={{width: '100%'}} onChange={(e) => dispatch(setField({ field: 'DocRepId', value: e }))}>
                                        {Dr.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(CreateOrEdit)