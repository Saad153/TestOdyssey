import React, { useEffect, useState } from 'react';
import { Popover, Tag, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import InputNumComp from "/Components/Shared/Form/InputNumComp";
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
import EquipmentInfo from './EquipmentInfo';
// import airports from "/jsonData/airports";
import Carrier from './Carrier';
import AddPort from './AddPort';
import { FaPlus } from "react-icons/fa6";
import airports from "/jsonData/airports";
import polAir from "/jsonData/polAir.json";
import polSea from "/jsonData/polSea.json";
// import QRCode from 'qrcode';
import { current } from '@reduxjs/toolkit';
import QRPageComp from './QRcode';
import { getChargeHeads } from '../../../../apis/jobs';

const BookingInfo = ({ handleSubmit, onEdit, companyId, register, control, errors, state, useWatch, dispatch, reset, id, type }) => {
  const tabs = useSelector((state) => state.tabs.tabs)
  //const companyId = useSelector((state) => state.company.value);
  const dispatchNew = useDispatch();
  const transportCheck = useWatch({ control, name: "transportCheck" });
  const transporterId = useWatch({ control, name: "transporterId" });
  const customCheck = useWatch({ control, name: "customCheck" });
  const customAgentId = useWatch({ control, name: "customAgentId" });
  const vesselId = useWatch({ control, name: "vesselId" });
  const VoyageId = useWatch({ control, name: "VoyageId" });
  const ClientId = useWatch({ control, name: "ClientId" });
  const commodityId = useWatch({control, name:"commodityId"});
  const shipperId = useWatch({ control, name: "shipperId" });
  const consigneeId = useWatch({ control, name: "consigneeId" });
  const overseasAgentId = useWatch({ control, name: "overseasAgentId" });
  const airLineId = useWatch({ control, name: "airLineId" });
  const forwarderId = useWatch({ control, name: "forwarderId" });
  const shippingLineId = useWatch({ control, name: "shippingLineId" });
  const localVendorId = useWatch({ control, name: "localVendorId" });
  const approved = useWatch({ control, name: "approved" });
  let allValues = useWatch({ control });
  const [isOpen, setIsOpen] = useState(false);
  const Space = () => <div className='mt-2' />
  const approved1 = useSelector((state) => state.invoice);
  const [charges, setCharges] = useState(false)

  useEffect(() => {
    const fetchChargeHeads = async () => {
      const result = await getChargeHeads({ id: state.selectedRecord.id });
      console.log("Charges:", result);
      let check = false
      result.charges.forEach((x)=>{
        x.status=='1'?check = true : null
      })
      setCharges(check)
    };
  
    fetchChargeHeads();
  });

  useEffect(() => {
    if (allValues.freightType == "Prepaid") {
      reset({ ...allValues, freightPaybleAt: 'Karachi, Pakistan' });
    } else {
      reset({ ...allValues, freightPaybleAt: 'Destination' });
    }
  }, [allValues.freightType])

// useEffect(() => {
//   console.log(id);
//   QRcode(id);
// },[])
  const handleOk = () => {
    allValues.approved = approved
    handleSubmit(onEdit(allValues))
    dispatch({
      type: "set", payload: {
        isModalOpen: false,
      }
    })
  };

  const handleCancel = () => {
    dispatch({
      type: "set", payload: {
        isModalOpen: false,
      }
    })
    reset({ ...allValues, approved: approved[0] != 1 ? ['1'] : [] })
  };

  const pageLinking = (pageType, value) => {
    let route = "";
    let obj = {};

    if (pageType === "client") {
      // Checking if id is defined and not null
      if (value !== undefined && value !== null && value !== "") {
        route = `/setup/client/${value}`;
        obj = {
          label: "Client",
          key: "2-7",
          id: value,
        };
      } else {
        // Navigating to a default/new page if id is undefined or null
        route = "/setup/client/new";
        obj = {
          label: "Client",
          key: "2-7",
          id: "new",
        };
      }
    } else if (pageType === "vendor") {
      // Checking if id is defined and not null
      if (value !== undefined && value !== null && value !== "") {
        route = `/setup/vendor/${value !== "" && value !== null ? value : "new"}`;
        obj = {
          label: "Vendor",
          key: "2-8",
          id: value !== "" && value !== null ? value : "new",
        };
      } else {
        // Navigating to a default/new page if id is undefined or null
        route = "/setup/vendor/new";
        obj = {
          label: "Vendor",
          key: "2-8",
          id: "new"
        }
      }
    } else if (pageType === "vessel") {
      route = "/setup/voyage/";
      obj = {
        label: "Voyages",
        key: "2-4",
      };
    }else if(pageType=="commodity"){
      route=`/commodity/`
      obj={
        label:"commodity",
        key:"2-3"
      }
    };
    dispatchNew(incrementTab(obj));
    Router.push(route);
  };

  // console.log(state)
  const packages = [
    {id:'BAGS', value:'BAGS'},
    {id:'BALES', value:'BALES'},
    {id:'BARRELS', value:'BARRELS'},
    {id:'CARTONS', value:'CARTONS'},
    {id:'BLOCKS', value:'BLOCKS'},
    {id:'BOATS', value:'BOATS'},
    {id:'BOBBIN', value:'BOBBIN'},
    {id:'BOTTLES', value:'BOTTLES'},
    {id:'BOXES', value:'BOXES'},
    {id:'BRIQUETTES', value:'BRIQUETTES'},
    {id:'BUNDLES', value:'BUNDLES'},
    {id:'CABLE DRUM', value:'CABLE DRUM'},
    {id:'CANS', value:'CANS'},
    {id:'CARBOY', value:'CARBOY'},
    {id:'CARTONS', value:'CARTONS'},
    {id:'CASE', value:'CASE'},
    {id:'CASKS', value:'CASKS'},
    {id:'COILS', value:'COILS'},
    {id:'COLLI', value:'COLLI'},
    {id:'CRATES', value:'CRATES'},
    {id:'CYLINDERS', value:'CYLINDERS'},
    {id:'DOZENS', value:'DOZENS'},
    {id:'DRUMS', value:'DRUMS'},
    {id:'FUBRE DRUMS', value:'FUBRE DRUMS'},
    {id:'ITEMS', value:'ITEMS'},
    {id:'JOTTAS', value:'JOTTAS'},
    {id:'KEGS', value:'KEGS'},
    {id:'LOOSE', value:'LOOSE'},
    {id:'METAL DRUMS', value:'METAL DRUMS'},
    {id:'METERS', value:'METERS'},
    {id:'MODULES', value:'MODULES'},
    {id:'PACKETS', value:'PACKETS'},
    {id:'PACKAGES', value:'PACKAGES'},
    {id:'PAILS', value:'PAILS'},
    {id:'PALLETS', value:'PALLETS'},
    {id:'PARCELS', value:'PARCELS'},
    {id:'PIECES', value:'PIECES'},
    {id:'PLASTIC DRUMS', value:'PLASTIC DRUMS'},
    {id:'REELS', value:'REELS'},
    {id:'ROLLS', value:'ROLLS'},
    {id:'SACKS', value:'SACKS'},
    {id:'SETS', value:'SETS'},
    {id:'SHEETS', value:'SHEETS'},
    {id:'SKIDS', value:'SKIDS'},
    {id:'SLABS', value:'SLABS'},
    {id:'STEEL PACKAGES', value:'STEEL PACKAGES'},
    {id:'STEEL PLATES', value:'STEEL PLATES'},
    {id:'STEEL TRUNKS', value:'STEEL TRUNKS'},
    {id:'TES CHESTS', value:'TES CHESTS'},
    {id:'TONS', value:'TONS'},
    {id:'UNIT', value:'UNIT'}
  ];
  // const QRcode = (id) => {
  //   let currentUrl = '';
  //   if (typeof window !== 'undefined') {
  //     currentUrl = window.location.origin;
  //     console.log('count',currentUrl); // Outputs the current origin, e.g., https://example.com
  //   }
  //   const url =  `${currentUrl}/jobInfo/${id}`;
  //   const qrCode = QRcode.toDataURL(url);
  // }
  const ShipperComp = () => {

    return (
      <>
        <div className='custom-link mt-2' onClick={() => pageLinking("client", shipperId)}>
          Shipper *
        </div>
        <SelectSearchComp register={register}
          name='shipperId'

          control={control}
          clear={true}
          label=''
          disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.shipper}
        />
        <Space />
      </>
    )
  }
  return (
    <>
      <Row style={{ fontSize: 12 }}>
        <Col md={2} className=''>
          <div className="mt-1">Job No.</div>
          <div className="dummy-input">
            {state.edit ? (state.selectedRecord?.jobNo) : <span style={{ color: 'white' }}>.</span>}
          </div>
        </Col>
        <Col md={2} className='py-1'>
          <DateComp register={register} name='jobDate' control={control} label='Job Date' width={"100%"} disabled={getStatus(approved)} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
        </Col>
        <Col md={2} className='py-1'>     
        <DateComp register={register} name='shipDate' control={control} label='Sailing/Flight Date'  width={"100%"} />
      </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='jobType' control={control} label='Job Type' width={"100%"} disabled={getStatus(approved)}
            options={[
              {id:'Clearing Only', name:'Clearing Only'},
              {id:'Clearing + Tpt', name:'Clearing + Tpt'},
              {id:'Tpt Only', name:'Tpt Only'},
            ]} />
        </Col>
        <Col md={2} className='py-1'>
        <SelectComp register={register} name='subType' control={control} label='Shipment Type' width={"100%"} 
          options={[
            {id:'FCL', name:'FCL'},
            {id:'LCL', name:'LCL'},
            {id:'PART', name:'PART'},
            {id:'EPZ', name:'EPZ'},
          ]}
        />
      </Col>
      <Col md={1} className='py-1'>
        <InputComp register={register} name='customerRef' control={control} label='Invoice #' width={"100%"}  />
      </Col>
      <Col md={1} className='py-1'>
        <InputComp register={register} name='regPageNo' control={control} label='S/R Page#' width={"100%"}  />
      </Col>
      </Row>
      <hr className='mb-0' />
      <Row style={{ fontSize: 12 }}>
        <Col md={3} className=''>
          <div className='custom-link mt-2' onClick={() => pageLinking("client", ClientId)} >Client *</div>
          <SelectSearchComp register={register}
            clear={true}
            name='ClientId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.party.client} />
          {(type == "SE" || type == "SI") && 
          <>
          <SelectSearchComp register={register} name='pol' control={control} label='Port Of Shipment'  width={"100%"}
              options={polSea.ports} /><Space/>
            <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge'  width={"100%"}
              options={ports.ports} /><Space/>
            </>
            }
            {(type=="AE" || type=="AI") &&<>
            <SelectSearchComp register={register} name='pol' control={control} label='Airport Of Shipment'  width={"100%"}
              options={polAir.ports} /><Space/>
            <SelectSearchComp register={register} name='pod' control={control} label='Airport Of Discharge'  width={"100%"}
              options={airports} /><Space/>
            </>}
            <SelectSearchComp register={register}
              clear={true}
              name='fd' control={control} label='Final Destination ' disabled={getStatus(approved)} width={"100%"}
              options={destinations}
            />
          <Space />
        </Col>
        <Col md={3}><Space />
          {/* <div className='custom-link mt-2' onClick={() => pageLinking("vendor", overseasAgentId)} >Overseas Agent *</div>
          <SelectSearchComp register={register}
            clear={true}

            name='overseasAgentId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.overseasAgent} width={"100%"} /> */}

          <div className='custom-link mt-2' onClick={() => pageLinking("vendor", localVendorId)} >Local Vendor </div>
          <SelectSearchComp register={register}
            clear={true}

            name='localVendorId' control={control} label=''
            disabled={getStatus(approved)} options={state.fields.vendor.localVendor} width={"100%"}
          />
          <div className='custom-link mt-2' onClick={()=>pageLinking("commodity", commodityId)} >Commodity</div>
          <SelectSearchComp register={register} name='commodityId' control={control} label='' width={"100%"}
              options={state.fields.commodity} 
            />
            {(type == "SE" || type == "SI") && <>
          <div className='custom-link mt-2' onClick={() => pageLinking("vendor", forwarderId)} >Freight Forwarder {"(CHA/CHB)"}</div>
          <SelectSearchComp register={register}
            clear={true}
            name='forwarderId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.vendor.forwarder} /> </>}
             {(type=="AE" || type=="AI") &&<> 
            <InputComp register={register} name='airwayBill' control={control} label='Airway Bill#' width={"100%"}  />
            </> }
            {(type=="AE" || type=="AI") &&<>
            <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", airLineId)} >Airline</div>
            <SelectSearchComp register={register} name='airLineId' control={control} label='' width={"100%"}
              options={state.fields.vendor.airLine} 
            />
                 </>
            }
          {(type == "SE" || type == "SI") && <>
            <div className='custom-link mt-2' onClick={() => pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
            <SelectSearchComp register={register}
              clear={true} name='shippingLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.sLine} width={"100%"} />
          </>}
        </Col>
        
        <Col md={3}><Space />

          <div className='mt-2' />
          <Row>
            <Col md={1}>
              <CheckGroupComp register={register} name='transportCheck' control={control} label='' disabled={getStatus(approved)}
                options={[{ label: "", value: "Transport" }]} />
            </Col>
            <Col md={3}>
              <div className='custom-link' onClick={() => pageLinking("vendor", transporterId)} >Transporter</div>
            </Col>
            <Col>.</Col>
          </Row>
          <SelectSearchComp register={register}
            clear={true}
            name='transporterId' control={control} label=''
            options={state.fields.vendor.transporter} disabled={getStatus(approved) || transportCheck.length == 0} width={"100%"} />
          {/* <div className='mt-2'></div> */}
          <Row>
            <Col md={4}>
            <InputNumComp register={register} name='pcs' control={control}  label='No of Pkgs' width={"120%"}  />
            </Col>
            <Col md={8}>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"}  options={packages}  />
            </Col>
            {/* <Col>.</Col> */}
          </Row>
        </Col>
        <Col md={3}><Space />
          {state.edit && <Notes state={state} dispatch={dispatch} />}
          {approved == "1" && <img src={'/approve.png'} height={100} />}
        {charges != true && <div onClick={() => dispatch({ type: "set", payload: { isModalOpen: true, } })}>
          <CheckGroupComp register={register} name='approved' control={control} label=''
            options={[{ label: "Vessel Sailed", value: "1" }]}
          />
        </div>}
          <hr />
          {id != "new" && <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {/* <button className='btn-custom px-4' type="button"
              onClick={
                async () => {
                  if (id != "new") {
                    let oldTabs = await type == "SE" ? tabs.filter((x) => { return x.key != "4-3" }) :
                      await type == "SI" ? tabs.filter((x) => { return x.key != "4-6" }) :
                        await type == "AE" ? tabs.filter((x) => { return x.key != "7-2" }) :
                          await tabs.filter((x) => { return x.key != "7-5" })
                    dispatchNew(await removeTab(oldTabs)); // First deleting Job Tab
                    dispatchNew(await incrementTab({ // Then Re adding Job Tab with updated info
                      "label": `${type} JOB`,
                      "key": type == "SE" ? "4-3" : type == "SI" ? "4-6" : type == "AE" ? "7-2" : "7-5",
                      "id": state.selectedRecord.id
                    }));
                    dispatchNew(await addBlCreationId(id)); // Sending JobId to Bl
                    dispatchNew(await incrementTab({ // Now Adding a BL Tab
                      "label": `${type} ${type == "SE" || type == "SI" ? "" : "AW"}BL`,
                      "key": type == "SE" ? "4-4" : type == "SI" ? "4-7" : type == "AE" ? "7-3" : "7-6",
                      "id": state.selectedRecord.Bl != null ? `${state.selectedRecord.Bl.id}` : "new"
                    }));
                    await Router.push(`${type == "SE" ? "/seaJobs/export/bl/" : type == "SI" ? "/seaJobs/import/bl/" : type == "AE" ? "/airJobs/export/bl/" : "/airJobs/import/bl/"}${state.selectedRecord.Bl != null ? state.selectedRecord.Bl.id : "new"}`);
                  }
                }}
            >{(type == "SE" || type == "SI") ? "BL" : "AWBL"}</button> */}
            <Popover
              content={
                <>{state.InvoiceList?.map((x, i) =>
                (<div key={i} className='my-1'>
                  <Tag color="geekblue" style={{ fontSize: 15, cursor: "pointer", width: 130, textAlign: 'center' }}
                    onClick={() => {
                      dispatch({
                        type: 'set',
                        payload: { selectedInvoice: x.invoice_No, tabState: "5" }
                      })
                    }}>
                    {x.invoice_No}
                  </Tag>
                </div>))}
                </>}>
              <button type="button" className="btn-custom">Invoice/Bills {`(${state.InvoiceList.length})`}</button>
            </Popover>
            {/* <br/> */}

            {/* {(type == "AE" || type == "SE") &&
              <button className='btn-custom px-4' type='button' onClick={() => dispatch({ type: 'set', payload: { loadingProgram: 1, tabState: "6" } })}
              >Loading Program</button>}

            {(type == "AI" || type == "SI") && <button className='btn-custom px-4' type='button' onClick={() => dispatch({ type: 'set', payload: { do: 1, tabState: "7" } })}>
              DO
            </button>} */}
          </div>}
          <br/>

        </Col>
        {(type=="SE"||type=="SI") &&<>
      <Col md={7} style={{ display:'flex', marginRight:"10rem", marginTop:"1rem"}}><Space />
        <EquipmentInfo state={state} dispatch={dispatch} />
      </Col>
      </> }
      <Col md={3} style={{ display:'flex'}}><Space />
      <QRPageComp id={id} />
      </Col>
      
      </Row>
      {(state.voyageVisible && approved[0] != "1") &&
        <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} state={state} dispatch={dispatch} />
      }
      <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
        {approved == "1" ? "Mark Vessel Sailed? " : "Unmark Vessel Sailed? "}
      </Modal>
    </>
  )
}
export default React.memo(BookingInfo)