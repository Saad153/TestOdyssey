import { Row, Col, Table, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { Input, Select } from 'antd';
import openNotification from '/Components/Shared/Notification';
import Pagination from '/Components/Shared/Pagination';
import { resetPartyState } from '../../../../redux/parties/partiesSlice';

const Parties = ({ sessionData, partiesData }) => {
  const dispatchNew = useDispatch();
  const [searchBy, setSearchBy] = useState("name");
  const [records, setRecords] = useState([]);
  const [parties, setParties] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // new
  const pageSize = 50; // new, can change to 20, 50, etc

  useEffect(() => {
    setRecords(partiesData.result);
    setParties(partiesData.result);
  }, [partiesData]);

  const onSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const data = parties.filter((x) =>
      x.name.toLowerCase().includes(searchValue) ||
      x?.code?.toLowerCase().includes(searchValue)
    );
    setRecords(data);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={3}><h5>Parties</h5></Col>
        <Col md={7} style={{ display: "inline-block" }}>
          <span>Search By :</span>
          <Select
            placeholder="Search"
            onChange={(e) => setSearchBy(e)}
            style={{ width: "150px", marginLeft: "5px", borderRadius: "8px" }}
            options={[
              { value: "name", label: "Name" },
              { value: "code", label: "Code" }
            ]}
            defaultValue={"name"}
          />
          <Input
            style={{ width: "290px", marginLeft: "5px", borderRadius: "5px" }}
            placeholder={searchBy === 'name' ? "Type Name" : "Type Code"}
            onChange={(e) => onSearch(e)}
          />
        </Col>
        <Col md={2}>
          <button className='btn-custom right'
            onClick={() => {
              dispatchNew(resetPartyState());
              dispatchNew(incrementTab({ "label": "Party", "key": "2-21", "id": "new" }));
              Router.push(`/setup/party/new`);
            }}
          >
            Create
          </button>
        </Col>
      </Row>

      <hr className='my-2' />

      <Row style={{ maxHeight: '69vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Col md={12}>
          <div className='table-sm-1 mt-3' style={{ maxHeight: 500, overflowY: 'auto' }}>
            <Table className='tableFixHead'>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Contact Persons</th>
                  <th>Telephones</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords?.map((x, index) => (
                  <tr key={index} className='f row-hov'>
                    {/* All your existing <td> rendering here */}
                    <td onClick={() => {
                      dispatchNew(incrementTab({ "label": "Party", "key": "2-21", "id": x.id }));
                      Router.push(`/setup/party/${x.id}`);
                    }}>{x.code}</td>
                    <td onClick={() => {
                      dispatchNew(incrementTab({ "label": "Party", "key": "2-21", "id": x.id }));
                      Router.push(`/setup/party/${x.id}`);
                    }}><span className='blue-txt fw-7'>{x.name}</span></td>
                    <td>{x.person1} {x.mobile1}<br /> {x.person2} {x.mobile2}<br /></td>
                    <td>{x.telephone1}<br />{x.telephone2}</td>
                    <td>{x.address1?.slice(0, 30)}<br /> {x.address2?.slice(0, 30)}<br /></td>
                    <td style={{ textAlign: 'center' }}>
                      {x.active ? <b className='green-txt'>Active</b> : <b className='red-txt'>Disabled</b>}
                    </td>
                    <td style={{ textAlign: 'center' }}
                      onClick={() => {
                        if (!x.active) {
                          // deleteClient(x.id, x.active)
                        } else {
                          openNotification('Error', 'Disable Client first', 'Red');
                        }
                      }}
                    >
                      {!x.active
                        ? <DeleteOutlined style={{ fontSize: '16px', color: '#D11A2A', cursor: 'pointer' }} />
                        : <DeleteOutlined style={{ fontSize: '16px', color: 'grey', cursor: 'pointer' }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>


          </div>
            <div className='d-flex justify-content-end items-end my-4' style={{ maxWidth: "100%" }} >
                <Pagination noOfPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        </Col>
      </Row>
    </div>
  )
}

export default React.memo(Parties);
