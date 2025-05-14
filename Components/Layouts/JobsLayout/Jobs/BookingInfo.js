import React, { useEffect, useState } from 'react';
import { Popover, Tag, Modal, Input, Select, DatePicker } from "antd";
import { checkEmployeeAccess} from '/functions/checkEmployeeAccess';
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import { Row, Col } from 'react-bootstrap';
import CustomBoxSelect from '/Components/Shared/Form/CustomBoxSelect';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import destinations from "/jsonData/destinations";
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab, removeTab } from '/redux/tabs/tabSlice';
import { getStatus } from './states';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import { addBlCreationId } from '/redux/BlCreation/blCreationSlice';
import Weights from './WeightComp';
import BLInfo from './BLInfo';
import airports from "/jsonData/airports";
import Carrier from './Carrier';
import AddPort from './AddPort';
import { FaPlus } from "react-icons/fa6";
import { getChargeHeads } from '../../../../apis/jobs';
import { checkEditAccess } from '../../../../functions/checkEditAccess';
import { Option } from 'antd/lib/mentions';
import { resetPartyState } from '../../../../redux/parties/partiesSlice';

const BookingInfo = (state) => {

  const [ deleteAccess, setDeleteAccess ] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if(checkEmployeeAccess()){
      setDeleteAccess(true)
    }else{
      // console.log("Not Approved")
      // console.log(deleteAccess)
    }
    console.log("STATE>>", state.state)
  }, [state])
  return (
    <div style={{fontSize: '12px'}}>
      <Row>
        <Col md={2}>
          <Row>
            <label>Job No.</label>
          </Row>
          <Input disabled></Input>
        </Col>
        <Col md={2}>
          <Row>
            <label>Job Type</label>
          </Row>
          <Select value={'direct'} style={{width :'100%'}}>
              <Select.Option value={'direct'}>Direct</Select.Option>
              <Select.Option value={'coloaded'}>Coloaded</Select.Option>
              <Select.Option value={'cross trade'}>Cross Trade</Select.Option>
              <Select.Option value={'liner agency'}>Liner Agency</Select.Option>
          </Select>
        </Col>
        <Col md={2}>
          <Row>
            <label>Job Kind</label>
          </Row>
          <Select value={'current'} style={{width :'100%'}}>
              <Select.Option value={'current'}>Current</Select.Option>
              <Select.Option value={'opening'}>Opening</Select.Option>
          </Select>
        </Col>
        <Col md={2}>
          <Row>
            <label>Job Date</label>
          </Row>
          <DatePicker
          style={{width :'100%'}} 
          // value={moment(state.registerDate)} 
          // onChange={(e) => dispatch(setField({ field: 'registerDate', value: e }))}
          ></DatePicker>
        </Col>
        <Col md={2}>
          <Row>
            <label>Ship Date</label>
          </Row>
          <DatePicker
          style={{width :'100%'}} 
          // value={moment(state.registerDate)} 
          // onChange={(e) => dispatch(setField({ field: 'registerDate', value: e }))}
          ></DatePicker>
        </Col>
        <Col md={2}>
          <Row>
            <label>Ship Status</label>
          </Row>
          <Select value={'booked'} style={{width :'100%'}}>
              <Select.Option value={'hold'}>Hold</Select.Option>
              <Select.Option value={'booked'}>Booked</Select.Option>
              <Select.Option value={'delivered'}>Delivered</Select.Option>
              <Select.Option value={'shipped'}>Shipped</Select.Option>
              <Select.Option value={'closed'}>Closed</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Col md={1}>
          <Row>
            <label>C. Center</label>
          </Row>
          <Select value={'khi'} style={{width :'100%'}}>
              <Select.Option value={'khi'}>KHI</Select.Option>
              <Select.Option value={'fsd'}>FSD</Select.Option>
          </Select>
        </Col>
        <Col md={1}>
          <Row>
            <label>Sub Type</label>
          </Row>
          <Select value={'fcl'} style={{width :'100%'}}>
              <Select.Option value={'fcl'}>FCL</Select.Option>
              <Select.Option value={'lcl'}>LCL</Select.Option>
          </Select>
        </Col>
        <Col md={1}>
          <Row>
            <label>DG Type</label>
          </Row>
          <Select value={'nondg'} style={{width :'100%'}}>
              <Select.Option value={'nondg'}>non-DG</Select.Option>
              <Select.Option value={'dg'}>DG</Select.Option>
              <Select.Option value={'mix'}>Mix</Select.Option>
          </Select>
        </Col>
        <Col md={1}>
          <Row>
            <label>Fr. Type</label>
          </Row>
          <Select value={'prepaid'} style={{width :'100%'}}>
              <Select.Option value={'prepaid'}>Prepaid</Select.Option>
              <Select.Option value={'collect'}>Collect</Select.Option>
          </Select>
        </Col>
        <Col md={2}>
          <Row>
            <label>Nomination</label>
          </Row>
          <Select value={'freehand'} style={{width :'100%'}}>
              <Select.Option value={'freehand'}>Free Hand</Select.Option>
              <Select.Option value={'nominated'}>Nominated</Select.Option>
              <Select.Option value={'b2b'}>B2B</Select.Option>
          </Select>
        </Col>
        <Col md={2}>
          <Row>
            <label>Inco Terms</label>
          </Row>
          <Select value={'EXW'} style={{ width: '100%' }}>
            <Option value="EXW">EXW</Option>
            <Option value="FCP">FCP</Option>
            <Option value="FAS">FAS</Option>
            <Option value="FOB">FOB</Option>
            <Option value="CFR">CFR</Option>
            <Option value="CIF">CIF</Option>
            <Option value="CIP">CIP</Option>
            <Option value="CPT">CPT</Option>
            <Option value="DAP">DAP</Option>
            <Option value="DPU">DPU</Option>
            <Option value="DDP">DDP</Option>
            <Option value="CNI">CNI</Option>
            <Option value="DTP">DTP</Option>
            <Option value="DPP">DPP</Option>
            <Option value="DAT">DAT</Option>
            <Option value="DDU">DDU</Option>
            <Option value="DES">DES</Option>
            <Option value="DEQ">DEQ</Option>
            <Option value="DAF">DAF</Option>
            <Option value="CNF">CNF</Option>
          </Select>
        </Col>
        <Col md={2}>
          <Row>
            <label>Customer Ref#</label>
          </Row>
          <Input></Input>
        </Col>
        <Col md={2}>
          <Row>
            <label>File #</label>
          </Row>
          <Input></Input>
        </Col>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Col style={{border: '1px solid silver', height: '20px', borderRadius: '5px', margin: '0px 10px', fontSize: '12px', color: 'grey'}}>
          No BL Attached
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col md={3} style={{ paddingRight: '20px' }}>
          <Row>
            <Row>
              <label style={{ cursor: 'default', color: '#007bff' }}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(resetPartyState());
                    dispatch(incrementTab({ label: 'Party', key: '2-21', id: 'new' }));
                    Router.push(`/setup/party/new`);
                  }}
                >
                  Client*
                </span>
              </label>
            </Row>
            <Select
              placeholder="Select a Client"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Consignee") || x.types.includes("Shipper") || x.types.includes("Notify")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label style={{ cursor: 'default', color: '#007bff' }}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(resetPartyState());
                    dispatch(incrementTab({ label: 'Party', key: '2-21', id: 'new' }));
                    Router.push(`/setup/party/new`);
                  }}
                >
                  Shipper*
                </span>
              </label>
            </Row>
            <Select
              placeholder="Select a Shipper"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Shipper")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label style={{ cursor: 'default', color: '#007bff' }}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(resetPartyState());
                    dispatch(incrementTab({ label: 'Party', key: '2-21', id: 'new' }));
                    Router.push(`/setup/party/new`);
                  }}
                >
                  Consignee*
                </span>
              </label>
            </Row>
            <Select
              placeholder="Select a Consignee"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Consignee")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label
              >Port of Loading</label>
            </Row>
            <Select></Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label
              >Port of Discharge*</label>
            </Row>
            <Select></Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label
              >Final Destination*</label>
            </Row>
            <Select></Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label style={{ cursor: 'default', color: '#007bff' }}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(resetPartyState());
                    dispatch(incrementTab({ label: 'Party', key: '2-21', id: 'new' }));
                    Router.push(`/setup/party/new`);
                  }}
                >
                  Forwarder/Coloader*
                </span>
              </label>
            </Row>
            <Select
              placeholder="Select a Forwarder / Coloader"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Forwarder/Coloader")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label
              >Sales Representator</label>
            </Row>
            <Select
              placeholder="Select a Sales Representator"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.sr?.map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
        </Col>
        <Col md={3} style={{ paddingRight: '20px', paddingLeft: '20px' }}>
          <Row>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Overseas Agent*</label>
            </Row>
            <Select
              placeholder="Select a Overseas Agent"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Overseas Agent")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Local Vendor*</label>
            </Row>
            <Select
              placeholder="Select a Local Vendor"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Local Vendor")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >SLine / Carrier*</label>
            </Row>
            <Select
              placeholder="Select a SLine / Carrier"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Shipping Line")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row>
            <Carrier state={state} dispatch={dispatch} />
          </Row>
        </Col>
        <Col md={3} style={{ paddingRight: '20px', paddingLeft: '20px' }}>
          <Row>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Commodity*</label>
            </Row>
            <Select
              showSearch
              placeholder="Select a Commodity"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.commodity?.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Transport*</label>
            </Row>
            <Select
              placeholder="Select a Transporter"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client?.filter((x) => x.types.includes("Transporter")).map((c) => {
                return (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Row>
              <label 
              style={{cursor: 'pointer', color: '#007bff'}}
              onClick={() => {
                dispatch(resetPartyState());
                dispatch(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
                Router.push(`/setup/party/new`);
              }}
              >Custom Clearance*</label>
            </Row>
            <Select
              placeholder="Select a Custom Clearance party"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {state?.state?.party?.client
                ?.filter((x) => x.types.includes("CHA/CHB"))
                .map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
            </Select>
          </Row>
          
        </Col>
        <Col md={3} style={{ paddingLeft: '20px' }}>
          <Row>
            <Col md={4}>
              <button
                type="submit"
                disabled={state.load}
                className="btn-custom mt-1 px-3"
              >
                {state.load ? (
                  <Spinner animation="border" size="sm" className="mx-3" />
                ) : (
                  'Save Job'
                )}
              </button>
            </Col>
            <Col md={6}>
              <button
                type="button"
                className={
                  !true
                    ? 'btn-red-disabled px-3 mt-1 disabled'
                    : 'btn-red mt-1 px-3'
                }
                style={{ cursor: true ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  PopConfirm(
                    'Confirmation',
                    'Are You Sure You Want To Delete This Job?',
                    () => {
                      axios
                        .post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_JOBS, {
                          id: allValues.id,
                        })
                        .then(async (x) => {
                          let oldTabs =
                            (await type) == 'SE'
                              ? tabs.filter((x) => x.key != '4-3')
                              : (await type) == 'SI'
                              ? tabs.filter((x) => x.key != '4-6')
                              : (await type) == 'AE'
                              ? tabs.filter((x) => x.key != '7-2')
                              : tabs.filter((x) => x.key != '7-5');
                          dispatchNew(await removeTab(oldTabs));
                          Router.push(
                            type == 'SE'
                              ? '/seaJobs/seJobList'
                              : type == 'SI'
                              ? '/seaJobs/siJobList'
                              : type == 'AE'
                              ? '/airJobs/aeJobList'
                              : '/airJobs/aiJobList'
                          );
                        });
                    }
                  );
                }}
              >
                Delete Job
              </button>
            </Col>
          </Row>
            <label className='mt-3'>Tracing Notes</label>
            <hr className='my-1'/>
            <Row>
              <Col md={5}>
                <button className="btn-custom mt-1 px-3">Add Notes</button>
              </Col>
              <Col md={5}>
                <button className="btn-custom mt-1 px-3">View Notes</button>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col md={2}>
                <button className="btn-custom mt-1 px-3">BL</button>
              </Col>
              <Col md={3}>
                <button className="btn-custom mt-1 px-3">Inv/Bill</button>
              </Col>
              <Col md={6}>
                <button className="btn-custom mt-1 px-3">Loading Program</button>
              </Col>
            </Row>
        </Col>
      </Row>
    </div>
  )
}
export default React.memo(BookingInfo)