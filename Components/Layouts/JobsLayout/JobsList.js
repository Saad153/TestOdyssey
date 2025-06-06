import { addValues } from '/redux/persistValues/persistValuesSlice';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Router from 'next/router';
import Pagination from '../../Shared/Pagination';
import { Input } from 'antd';
import moment from 'moment';
import JobsBackupData from './Backup/BackupModal';
import { delay } from "/functions/delay"
import axios from 'axios';
import Cookies from 'js-cookie';

const SEJobList = ({ jobsData, sessionData, type }) => {
  const state = useSelector((state) => state);
  const companyId = Cookies.get('companyId');
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  //search state
  const [query, setQuery] = useState(null);
  //pagination states
  const [currentPage,setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(30);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = (query!='' && query!=null && query!=undefined)?records.filter((x)=>{
    return  x.jobNo.toLowerCase().includes(query.toLowerCase()) ||
      x?.Client?.name.toLowerCase().includes(query.toLowerCase()) ||
      x?.fd.toLowerCase().includes(query.toLowerCase()) ||
      x?.freightType.toLowerCase().includes(query.toLowerCase()) ||
      x?.nomination.toLowerCase().includes(query.toLowerCase()) ||
      x?.pod.toLowerCase().includes(query.toLowerCase()) ||
      x?.pol.toLowerCase().includes(query.toLowerCase()) ||
      x?.weight.toLowerCase().includes(query.toLowerCase()) ||
      x?.Bl?.hbl.toLowerCase().includes(query.toLowerCase()) ||
      x?.Bl?.mbl.toLowerCase().includes(query.toLowerCase()) 
  }) : records?.slice(indexOfFirst, indexOfLast);
  const noOfPages = Math.ceil(records?.length / recordsPerPage);

  useEffect(() => {
    if (jobsData.status == "success") {
      setRecords(jobsData.result);
    }
  }, [])
  
  useEffect(() => {
    setRecords(jobsData.result)
    console.log("Jobs Data: ", jobsData)
  }, [jobsData])

  const [firstCall, setFirstCall] = useState(false)

  useEffect(() => {
    if (currentRecords?.length > 0 && !firstCall) {
      console.log("Records: ", currentRecords);
      getCounts(records);
      setFirstCall(true);
    }
  }, [currentRecords, firstCall]); // Include firstCall here to avoid React warning
  

  const getCounts = async (data) => {
    console.log("Job IDs", data);
    if (data.length > 0) {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getCounts`,
        { data } // data goes in the body
      );
      console.log("Result:", result.data.result);
      setRecords(result.data.result);
    }
  };

  return (
    <>
      {companyId &&
        <div className='base-page-layout'>
          <Row>
            <Col md={2}>
              <h5>
                {type == "SE" ? "SEA Export" : type == "SI" ? "SEA Import" : type == "AE" ? "AIR Export" : type == "AI" ? "AIR Import" : ""} Job List
              </h5>
            </Col>
            <Col md={4}>
              <Input type="text" placeholder="Enter client,wieght or Job no" size='sm' onChange={e => setQuery(e.target.value)} />
            </Col>
            <Col md={5}></Col>
            <Col md={1}>
              <button className='btn-custom left'
                onClick={() => {
                  // queryClient.removeQueries({ queryKey: ['jobData', { type }] })
                  // let obj = { ...changedValues.value }
                  // obj[type] = ""
                  // dispatch(addValues(obj));
                  dispatch(incrementTab({
                    "label": type == "SE" ? "SE JOB" : type == "SI" ? "SI JOB" : type == "AE" ? "AE JOB" : "AI JOB",
                    "key": type == "SE" ? "4-3" : type == "SI" ? "4-6" : type == "AE" ? "7-2" : "7-5",
                    "id": "new"
                  }));
                  Router.push(
                    type == "SE" ? `/seaJobs/export/new` :
                      type == "SI" ? `/seaJobs/import/new` :
                        type == "AE" ? `/airJobs/export/new` :
                          `/airJobs/import/new`
                  )
                }}
              >Create</button>
            </Col>
          </Row>
          <hr className='my-2' />
          <div className='mt-3' style={{ maxHeight: "65vh", overflowY: 'auto' }}>
            <Table className='tableFixHead'>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Basic Info</th>
                  <th>Shipment Info</th>
                  <th>Weight Info</th>
                  <th>Other Info</th>
                  <th>Status</th>
                  <th>Dates</th>
                </tr>
              </thead>
              <tbody>
                {
                  currentRecords?.map((x, index) => {
                    return (
                      <tr key={index} className='f row-hov'
                        onClick={() => {
                          queryClient.removeQueries({ queryKey: ['jobData', { type }] })
                          let obj = { ...changedValues.value }
                          obj[type] = ""
                          dispatch(addValues(obj));
                          dispatch(incrementTab({
                            "label": type == "SE" ? "SE JOB" : type == "SI" ? "SI JOB" : type == "AE" ? "AE JOB" : "AI JOB",
                            "key": type == "SE" ? "4-3" : type == "SI" ? "4-6" : type == "AE" ? "7-2" : "7-5",
                            "id": x.id
                          }))
                          Router.push(
                            type == "SE" ? `/seaJobs/export/${x.id}` :
                              type == "SI" ? `/seaJobs/import/${x.id}` :
                                type == "AE" ? `/airJobs/export/${x.id}` :
                                  `/airJobs/import/${x.id}`
                          )
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <span className='blue-txt fw-7'>{x.jobNo}</span>
                          <br />{(type=="SE"||type=="SI")?'HBL:':'AWBL'} <span className='blue-txt'>{x?.Bl?.hbl}</span>
                          <br />{(type=="SE"||type=="SI")?'MBL:':'MWBL'}<span className='blue-txt'>{x?.Bl?.mbl}</span>
                          <br />Nomination: <span className='grey-txt'>{x.nomination}</span>
                          <br />Freight Type: <span className='grey-txt'>{x.freightType}</span>
                        </td>
                        <td>
                          POL: <span className='grey-txt'>{x.pol}</span><br />
                          POD: <span className='grey-txt'>{x.pod}</span><br />
                          FLD: <span className='grey-txt'> {x.fd}</span>
                        </td>
                        <td>
                          {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
                          Weight: <span className='grey-txt'>{x.weight}</span>
                        </td>
                        <td>
                          Party:<span className='blue-txt fw-5'> {x.Client === null ? "" : x.Client.name}</span><br />
                          Transportion: <span className='blue-txt fw-5'>{x.transportCheck != '' ? 'Yes' : 'No'}</span>
                          <br />
                          Custom Clearance: <span className='blue-txt fw-5'>{x.customCheck != '' ? 'Yes' : 'No'}</span>
                        </td>
                        <td>
                        { x.approved === 'true' ? (
                            x.iLength > 0 || x.bLength > 0 ? (
                              <>
                                <img src='/approve.png' height={70} />
                              </>
                            ) : (
                              <span>Approved, Invoices pending</span>
                            )
                          ) : (
                            <span>Not Approved</span>
                          )
                        }
                        </td>
                        <td>
                          <span className='blue-txt fw-6'>
                            {x.created_by?.name}
                          </span>
                          <br/>
                          Created at:{" "} 
                          <span className='grey-txt '>
                            {x.createdAt ? moment(x.createdAt).format("DD-MM-YY") : "-"}
                          </span>
                          <br/>
                          Invoices:{" "} 
                          <span className='grey-txt '>
                            {x.iLength ? x.iLength : "0"}
                          </span>
                          <br/>
                          Bills:{" "} 
                          <span className='grey-txt '>
                            {x.bLength ? x.bLength : "0"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </div>
          {(query=="" || query==null || query==undefined ) &&
          <div className='d-flex justify-content-end items-end my-4'style={{maxWidth:"100%"}} >
            <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </div>}
        </div>
      }
      {!companyId &&
      <div className='base-page-layout text-center'>
        Please select company to view jobs list
      </div>
      }
    </>
  )
}

export default SEJobList;