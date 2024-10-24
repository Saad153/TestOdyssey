import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { MdHistory } from "react-icons/md";
import { Input, List, Radio, Modal, Select } from 'antd';
import { recordsReducer, initialState } from './states';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { Row, Col, Table } from 'react-bootstrap';
import Router, { useRouter } from 'next/router';
import BillComp from './BillComp';
import PrintTransaction from './PrintTransaction';
import moment from 'moment';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import ReactToPrint from 'react-to-print';
import DeleteVoucher from './DeleteVoucher';
import Pagination from '../../../Shared/Pagination';
import openNotification from "../../../Shared/Notification";
import {checkEditAccess} from "../../../../functions/checkEditAccess";
import {checkEmployeeAccess} from "../../../../functions/checkEmployeeAccess";

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const PaymentsReceipt = ({ id, voucherData }) => {


  let inputRef = useRef(null);
  const gridRef = useRef();

  const dispatchNew = useDispatch();
  const [state, dispatch] = useReducer(recordsReducer, initialState);
  const setAll = (x) => dispatch({ type: 'setAll', payload: x })
  const router = useRouter()
  const companyId = useSelector((state) => state.company.value);
  const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") };
  const rowData = state.oldVouchersList;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = rowData ? rowData.slice(indexOfFirst, indexOfLast) : [];
  const noOfPages = rowData ? Math.ceil(rowData.length / recordsPerPage) : 0;
  const [showTable, setShowTable] = useState(true);
  const [isPaymentReceiptNew, setIsPaymentReceiptNew] = useState(false);

  const [del, setDel] = useState(false);


  useEffect(() => {
    // Ensure companyId is available before making the request
    if (companyId) {
      axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OLD_PAY_REC_VOUCHERS, {
        headers: { companyid: companyId }
      })
        .then((response) => {
          let tempData = [];
          response.data?.result?.forEach((item, index) => {
            tempData.push({
              ...item, no: index + 1,
              amount: (item.Voucher_Heads?.reduce((sum, cur) => sum + Number(cur.amount), 0) || 0) / Number(item.exRate)
            });
          });
          setAll({ oldVouchers: false, oldVouchersList: tempData });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [companyId]);



  useEffect(() => {
    setAll({ partytype: 'client' });
    if (router?.query?.id == 'undefined') {
      Router.push({ pathname: "/accounts/paymentReceipt/new" }, undefined, { shallow: true });
      dispatchNew(incrementTab({
        "label": "Payment / Receipt",
        "key": "3-4",
        "id": "new"
      }))
    } else if (router.query.name != 'undefined' && router.query.partyid != 'undefined' && router.query.partyid) {
      setAll({
        selectedParty: { id: router.query.partyid, name: router.query.name },
        partytype: router.query.type,
        payType: router.query.paytype,
        invoiceCurrency: router.query.currency,
        tranVisible: true
      })
    } else if (router?.query?.id != 'undefined' && router?.query?.id != 'new') {
      let payAcc = {}, partyAcc = {}, taxAc = { acc: {}, amount: 0 }, bankAc = { acc: {}, amount: 0 }, gainLoss = { acc: {}, amount: 0 }
      voucherData?.Voucher_Heads.forEach((x) => {
        if (x.accountType == 'payAccount') {
          payAcc = x.Child_Account
        }
        if (x.accountType == "partyAccount") {
          partyAcc = x.Child_Account
        }
        if (x.accountType == "Tax") {
          taxAc.acc = x.Child_Account
          taxAc.amount = x.amount
        }
        if (x.accountType == "BankCharges") {
          bankAc.acc = x.Child_Account
          bankAc.amount = x.amount
        }
        if (x.accountType == "gainLoss") {
          gainLoss.acc = x.Child_Account
        }
      });
      setAll({
        voucherHeads: voucherData.Voucher_Heads,
        id: id,
        createdAt: voucherData.createdAt,
        edit: true,
        oldInvoices: voucherData.invoices,
        selectedParty: { id: voucherData.partyId, name: voucherData.partyName },
        partytype: voucherData.partyType,
        payType: voucherData.vType == "BRV" ?
          "Receivable" :
          voucherData.vType == "CRV" ? "Receivable" : "Payble",
        invoiceCurrency: voucherData.currency,
        tranVisible: true,
        transaction:
          (voucherData.vType == "BRV" || voucherData.vType == "BPV") ? "Bank" :
            (voucherData.vType == "CRV" || voucherData.vType == "CPV") ? "Cash" : "Adjust",
        date: moment(voucherData.tranDate),
        checkNo: voucherData.chequeNo,
        payAccountRecord: payAcc,
        partyAccountRecord: partyAcc,
        bankChargesAccountRecord: bankAc.acc,
        bankCharges: bankAc.amount,
        taxAccountRecord: taxAc.acc,
        taxAmount: taxAc.amount,
        gainLossAccountRecord: gainLoss.acc,
        onAccount: voucherData.onAccount,
        drawnAt: voucherData.drawnAt,
        manualExRate: voucherData.exRate,
        subType: voucherData.subType
      })
    }

    setDel(checkEmployeeAccess())
  }, [router]);


  const addNew = () => router.push("/accounts/paymentReceipt/new");
  const chkReturn = async () => {
    let vv_id = voucherData
    let InvoiceId = vv_id.invoices;
    let vheads = voucherData?.Voucher_Heads
    let debitEntry = vheads?.filter(entry => entry.type === "credit");
    const { VoucherId, ChildAccountId, accountType, settlement, amount, defaultAmount } = debitEntry[0];
    const narration = "Cheaque Returned"
    const type = "debit"

    const data = {
      InvoiceId, VoucherId, ChildAccountId, accountType, settlement, amount, defaultAmount, type, narration

    }
    const checkreturn = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CHEAQUE_RETURNED, data)

    dispatch({
      type: "receiving",
      payload: {
        'receiving': '0',
        'remBalance': '0'
      }
    });

    openNotification("Success", "Cheaque Returned Successfully!", "green")
  }

  useEffect(() => { searchParties() }, [state.search, state.partyType]);

  useEffect(() => {
    setIsPaymentReceiptNew(router.asPath === '/accounts/paymentReceipt/new');
  }, [router.asPath]);

  const searchParties = async () => {
    if (state.search.length > 2) {
      setShowTable(false); // Hide table and pagination
      // console.log(state.partyType)
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH,
        { search: state.search, type: state.partytype }
      ).then((x) => {
        if (x.data.status === "success") {


          setAll({ partyOptions: x.data.result });


        } else {
          setAll({ partyOptions: [] });
        }
      });
      // console.log(state.partyOptions)
    } else {
      setShowTable(true); // Show table and pagination if search is cleared
    }
  };

  const ListComp = ({ data }) => {
    return (
      // <List
      //   size="small"
      //   bordered
      //   dataSource={data}
      //   renderItem={(item) =>

      //     <List.Item key={item.id} className='searched-item'

      //       onClick={() => {
      //         Router.push({
      //           pathname: "/accounts/paymentReceipt/new",
      //           query: {
      //             name: item.name, partyid: item.id, type: state.partytype,
      //             paytype: state.payType, currency: state.invoiceCurrency
      //           }
      //         },
      //           undefined,
      //           { shallow: true }
      //         );
      //         dispatchNew(incrementTab({
      //           "label": "Payment/ Reciept Details",
      //           "key": "3-13",
      //           "id": `new?name=${item.name}&partyid=${item.id}&type=${state.partytype}&paytype=${state.payType}&currency=${state.invoiceCurrency}`
      //         }))
      //         setAll({ selectedParty: { id: item.id, name: item.name }, tranVisible: true, search: "" });
      //       }}
      //     >{`${item.code} ${item.name}`}</List.Item>
      //   }
      // />
      <List
  size="small"
  bordered
  dataSource={data}
  renderItem={(item) => (
    <List.Item
      key={item.id}
      className="searched-item"
      onClick={() => {
        Router.push({
          pathname: "/accounts/paymentReceipt/new",
          query: {
            name: item.name,
            partyid: item.id,
            type: state.partytype,
            paytype: state.payType,
            currency: state.invoiceCurrency,
          },
        },
        undefined,
        { shallow: true });
        dispatchNew(
          incrementTab({
            label: "Payment/ Reciept Details",
            key: "3-13",
            id: `new?name=${item.name}&partyid=${item.id}&type=${state.partytype}&paytype=${state.payType}&currency=${state.invoiceCurrency}`,
          })
        );
        setAll({
          selectedParty: { id: item.id, name: item.name },
          tranVisible: true,
          search: "",
        });
      }}
    >
      {`${item.code} ${item.name}`}
    </List.Item>
  )}
  style={{ maxHeight: "300px", overflowY: "auto" }} // Adjust maxHeight as needed
/>

    )
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: '#', field: 'no', width: 50, filter: false },
    { headerName: 'Voucher No.', field: 'voucher_Id', filter: true },
    { headerName: 'Name', field: 'partyName', flex: 1, minWidth: 100, filter: true },
    { headerName: 'Party', field: 'partyType', filter: true, width: 100, },
    { headerName: 'Type', field: 'vType', width: 104, filter: true },
    { headerName: 'Date', field: 'tranDate', filter: true },
    {
      headerName: 'Currency', field: 'currency', filter: true, width: 90,
      cellRenderer: (params) => {
        return (
          <>
            <span style={{ fontWeight: 600, color: params.data.currency == "PKR" ? 'green' : '#2EA2D5' }}>{params.data.currency}</span>
          </>
        )
      }
    },
    {
      headerName: 'Amount', field: 'amount', filter: true,
      cellRenderer: (params) => {
        return (
          <>{commas(params.value)}</>
        )
      }
    },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: "agTextColumnFilter",
    floatingFilter: true,
    resizable: true
  }));

  const cellClickedListener = useCallback((e) => {
    dispatchNew(incrementTab({ "label": "Payment / Receipt", "key": "3-4", "id": e.data.id }))
    Router.push(`/accounts/paymentReceipt/${e.data.id}`)
  }, []);

  const cellClickListener = useCallback((e) => {
    let containsCR = false;
      for (const [key, value] of Object.entries(e)) {
      if (key === 'voucher_Id' && value.includes('-CR-')) {
        containsCR = true;
        break; 
      }
    }
  
    if (!containsCR) {
      dispatchNew(incrementTab({ "label": "Payment / Receipt", "key": "3-4", "id": e.id }));
      Router.push(`/accounts/paymentReceipt/${e.id}`);
    }
  }, []);

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={4}>
          <b>Type: </b>
          <Radio.Group className='mt-1' size='small' value={state.partytype}
            onChange={(e) => {
              let value = "", TempInvoiceCurrency = "";
              if (e.target.value == "vendor") {
                value = "Payble"
                TempInvoiceCurrency = "PKR"
              } else if (e.target.value == "client") {
                value = "Receivable";
                TempInvoiceCurrency = "PKR"
              } else if (e.target.value == "agent") {
                value = "Payble";
                TempInvoiceCurrency = "USD"
              }
              // console.log(e.target.value)
              setAll({
                selectedParty: { id: "", name: "" }, partytype: e.target.value,
                search: "", payType: value, invoiceCurrency: TempInvoiceCurrency
              })
            }}>
            <Radio value={"client"} defaultChecked>Client</Radio>
            <Radio value={"vendor"}>Vendor</Radio>
            <Radio value={"agent"} >Agent </Radio>
          </Radio.Group>
        </Col>
        <Col md={4}>
          <b>Pay Type: </b>
          <Radio.Group className='mt-1' value={state.payType} onChange={(e) => setAll({ search: "", payType: e.target.value })}
            disabled={state.partytype == "agent"}
          >
            <Radio value={"Payble"}>Payable</Radio>
            <Radio value={"Receivable"}>Receivable</Radio>
          </Radio.Group>
        </Col>

        <Col md={4} style={{ display: 'flex', justifyContent: 'end' }}>
          {state.edit &&
            <ReactToPrint
              content={() => inputRef}
              trigger={() => (
                <div className="div-btn-custom text-center p-1 px-2 mx-3" style={{ width: 80 }}>Print</div>
              )}
            />
          }
          <button className='btn-custom px-3' style={{ fontSize: 11 }}
            onClick={() => {
              axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OLD_PAY_REC_VOUCHERS, { headers: { companyid: companyId } })
                .then((x) => {
                  let tempData = [];
                  x.data?.result?.forEach((y, i) => {
                    tempData.push({
                      ...y, no: i + 1,
                      amount: (y.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0) || 0) / Number(y.exRate)
                    })
                  });
                  setAll({ oldVouchers: true, oldVouchersList: tempData });
                })
            }}
          >Show Old <MdHistory /></button>

          {id != "new" && del && <DeleteVoucher companyId={companyId} setAll={setAll} state={state} id={id} setShowTable={setShowTable} />}
          {!isPaymentReceiptNew && (
        <button className='btn-custom px-3' style={{ fontSize: 11 }} onClick={chkReturn}>
          Cheque Return
        </button>
      )}




        </Col>
        <Col md={6} className='mt-3'>
          {!state.selectedParty.name && <>
            <Input placeholder="Search type" size='small'
              suffix={state.search.length > 2 ? <CloseCircleOutlined onClick={() => setAll({ search: "" })} /> : <SearchOutlined />}
              value={state.search} onChange={(e) => {setAll({ search: e.target.value });}}
            />
            {state.search.length > 2 &&
              <div style={{ position: "absolute", zIndex: 10 }}>
                {/* <ListComp data={state.partyOptions} /> */}
                <ListComp data={state.partyOptions} style={{ maxHeight: '300px', overflowY: 'auto' }} />

              </div>
            }
          </>
          }
          {state.selectedParty.name && <>
            <button
              className="btn-custom-green"
              onClick={addNew}
            >
              Add New
            </button>
          </>
          }
        </Col>
        {!state.tranVisible && <Col md={1} className='mt-3'>
          <Select disabled={state.partytype != "agent" ? true : false} value={state.invoiceCurrency} size='small'
            onChange={(e) => setAll({ invoiceCurrency: e })}
            options={[
              { value: "PKR", label: "PKR" },
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "GBP", label: "GBP" },
              { value: "AED", label: "AED" },
              { value: "OMR", label: "OMR" },
              { value: "BDT", label: "BDT" },
              { value: "CHF", label: "CHF" },
            ]}
          />
        </Col>
        }
        {!state.tranVisible && <Col md={4} className='mt-3'>
          <div className='d-flex justify-content-end'>
            <Input type="text" placeholder="Search..." size='small' onChange={e => setQuery(e.target.value)} />
          </div>
        </Col>
        }

        {/* <Col md={4} className='mt-3'style={{border:'1px solid silver'}}>{state.selectedParty.name}</Col> */}
        <Col md={12}><hr className='p-0 my-3' /></Col>
      </Row>
      {/* table start */}
      {showTable && !state.tranVisible && (
        <>
          <div className='mt-3' style={{ maxHeight: "55vh", overflowY: 'auto', overflowX: "scroll" }}>
            <Table className='tableFixHead'>
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Voucher No #</th>
                  <th style={{ width: 150 }}>Name</th>
                  <th style={{ width: 50 }}>Party</th>
                  <th style={{ width: 50 }}>Type </th>
                  <th style={{ width: 70 }}>Date </th>
                  <th style={{ width: 80 }}>Currency </th>
                  <th style={{ width: 80 }}>amount</th>

                </tr>
              </thead>
              <tbody>
                {
                  currentRecords?.filter((x) => {
                    return x.voucher_Id.toLowerCase().includes(query.toLowerCase()) ||
                      x?.partyName?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.partyType?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.vType?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.vType?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.createdAt?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.currency?.toLowerCase().includes(query.toLowerCase()) ||
                      x?.amount?.toString().includes(query)
                  })
                    .map((x, index) => {
                      return (
                        <tr onClick={() => cellClickListener(x)} key={index} style={{ cursor: 'pointer' }}>
                          <td className='blue-txt fw-6 fs-12' >{x.voucher_Id}</td>
                          <td>{x.partyName}</td>
                          <td>{x.partyType}</td>
                          <td>{x.vType}</td>
                          <td>
                            Date: <span className='blue-txt'>{x.createdAt ? moment(x.createdAt).format("YYYY-MM-DD") : "-"}</span>
                          </td>
                          <td>{x.currency}</td>
                          <td>{commas(x.amount)}</td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </Table>
          </div>
          {(query == '' || query == null) &&
            <div className='d-flex justify-content-end items-end my-4' style={{ maxWidth: "100%" }} >
              <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
          }
        </>
      )}


      {/* table ends */}

      {state.tranVisible && <BillComp companyId={companyId} state={state} dispatch={dispatch}/>}
      <div className="d-none">
        <div ref={(res) => (inputRef = res)} className="px-2">
          <PrintTransaction companyId={companyId} state={state} dispatch={dispatch} />
        </div>
      </div>
      <Modal
        width={'80%'}
        open={state.oldVouchers}
        onOk={() => setAll({ oldVouchers: false })}
        onCancel={() => setAll({ oldVouchers: false })}
        footer={false}
        centered
        maskClosable={false}
        title={<>Old Vouchers</>}
      >
        {state.oldVouchers &&
          <div className="ag-theme-alpine" style={{ width: "100%", height: '72vh' }}>
            <AgGridReact
              ref={gridRef} // Ref for accessing Grid's API
              rowData={state.oldVouchersList} // Row Data for Rows
              columnDefs={columnDefs} // Column Defs for Columns
              defaultColDef={defaultColDef} // Default Column Properties
              animateRows={true} // Optional - set to 'true' to have rows animate when sorted
              rowSelection='multiple' // Options - allows click selection of rows
              onCellClicked={cellClickedListener}
              getRowHeight={30}
            />
          </div>
        }
      </Modal>
    </div>
  )
}

export default React.memo(PaymentsReceipt)