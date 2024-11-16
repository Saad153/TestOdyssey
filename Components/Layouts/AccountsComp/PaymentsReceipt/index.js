import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import { SearchOutlined, CloseCircleOutlined, SyncOutlined, PrinterOutlined, RollbackOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { MdHistory } from "react-icons/md";
import { Input, List, Radio, Modal, Select } from 'antd';
import { recordsReducer, initialState, getNewInvoices } from './states';
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
import {
  setTranVisible, 
  setSelectedParty, 
  setEdit, 
  // setOldInvoices, 
  setId, 
  setPayType, 
  setPartyType, 
  setInvoiceCurrency 
} from '../../../../redux/paymentReciept/paymentRecieptSlice';


const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const PaymentsReceipt = ({ id, voucherData, q }) => {

  let inputRef = useRef(null);
  const gridRef = useRef();
  const dispatchNew = useDispatch();
  const [state, dispatch] = useReducer(recordsReducer, initialState);
  const setAll = (x) => dispatch({ type: 'setAll', payload: x })
  const router = useRouter()
  const companyId = useSelector((state) => state.company.value);
  const tranVisible = useSelector((state) => state.paymentReciept.tranVisible);
  const selectedParty = useSelector((state) => state.paymentReciept.selectedParty);
  const payType = useSelector((state) => state.paymentReciept.payType);
  const partytype = useSelector((state) => state.paymentReciept.partytype);
  const invoiceCurrency = useSelector((state) => state.paymentReciept.invoiceCurrency);
  const edit = useSelector((state) => state.paymentReciept.edit);
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
    dispatchNew(setPartyType('client'));
    if (router?.query?.id == 'undefined') {
      router.push({ pathname: "/accounts/paymentReceipt/new" }, undefined, { shallow: true });
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
      dispatchNew(setTranVisible(true),)
      dispatchNew(setSelectedParty({ id: router.query.partyid.toString(), name: router.query.name }))
      dispatchNew(setPayType(router.query.paytype))
      dispatchNew(setPartyType(router.query.type))
      dispatchNew(setInvoiceCurrency(router.query.currency))

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
      console.log(voucherData.invoices)
      setAll({
        voucherHeads: voucherData.Voucher_Heads,
        id: id,
        createdAt: voucherData.createdAt,  
        edit: true,
        oldInvoices: voucherData.invoices,
        selectedParty: { id: voucherData.partyId, name: voucherData.partyName },
        partytype: voucherData.partyType,
        payType: voucherData.vType == "BRV" ?
          "Recievable" :
          voucherData.vType == "CRV" ? "Recievable" : "Payble",
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
        bankCharges: bankAc.amount/voucherData.exRate,
        taxAccountRecord: taxAc.acc,
        taxAmount: taxAc.amount,
        gainLossAccountRecord: gainLoss.acc,
        onAccount: voucherData.onAccount,
        drawnAt: voucherData.drawnAt,
        manualExRate: voucherData.exRate,
        subType: voucherData.subType
      })
      dispatchNew(setTranVisible(true));
      dispatchNew(setSelectedParty({ id: voucherData.partyId.toString(), name: voucherData.partyName }));
      dispatchNew(setEdit(true));
      // dispatchNew(setOldInvoices(voucherData.invoices));
      dispatchNew(setId(voucherData.id));
      dispatchNew(setPayType(voucherData.vType === "BRV" ? "Recievable" :
        voucherData.vType === "CRV" ? "Recievable" : "Payble"));
      dispatchNew(setPartyType(voucherData.partyType));
      dispatchNew(setInvoiceCurrency(voucherData.currency));


    }

    setDel(checkEmployeeAccess())
  }, [router]);

  useEffect(() => {
    console.log(selectedParty)
    console.log(tranVisible)
  },[selectedParty, tranVisible])


  // const addNew = () => router.push("/accounts/paymentReceipt/new");
  const addNew = () => {
    setAll({ selectedParty: { id: '', name: '' }, partytype: 'client', payType: 'Recievable', invoiceCurrency: 'USD', tranVisible: false })
    dispatchNew(setTranVisible(false))
    dispatchNew(setSelectedParty({ id: '', name: '' }))
    dispatchNew(setPayType('Recievable'))
    dispatchNew(setPartyType('client'))
    dispatchNew(setInvoiceCurrency('PKR') )
    router.push("/accounts/paymentReceipt/new")
    
  }
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
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH,
        { search: state.search, type: partytype }
      ).then((x) => {
        if (x.data.status === "success") {


          setAll({ partyOptions: x.data.result });

        } else {
          setAll({ partyOptions: [] });
        }
      });
    } else {
      setShowTable(true);
    }
  };

  const refetch = async () => {
    getNewInvoices(id, state, companyId, dispatch)
  }

  const ListComp = ({ data }) => {
    return (
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="searched-item"
            onClick={() => {
              router.push({
                pathname: "/accounts/paymentReceipt/new",
                query: {
                  name: item.name,
                  partyid: item.id,
                  type: partytype,
                  paytype: payType,
                  currency: invoiceCurrency,
                },
              },
              undefined,
              { shallow: true });
              // dispatchNew(  
              //   incrementTab({
              //     label: "Payment/ Reciept Details",
              //     key: "3-13",
              //     id: `new?name=${item.name}&partyid=${item.id}&type=${partytype}&paytype=${payType}&currency=${invoiceCurrency}`,
              //   })
              // );
              setAll({
                selectedParty: { id: item.id, name: item.name },
                tranVisible: true,
                search: "",
              });
              dispatchNew(setTranVisible(true))
              dispatchNew(setSelectedParty({ id: item.id.toString(), name: item.name }))
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
    router.push(`/accounts/paymentReceipt/${e.data.id}`)
  }, []);

  const cellClickListener = useCallback((e)=> {
    dispatchNew(incrementTab({"label": "Payment / Receipt","key": "3-4","id":e.id}))
    router.push(`/accounts/paymentReceipt/${e.id}`)
  }, []);

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={4}>
          <b>Type: </b>
          <Radio.Group className='mt-1' size='small' value={partytype}
            onChange={(e) => {
              let value = "", TempInvoiceCurrency = "";
              if (e.target.value == "vendor") {
                value = "Payble"
                TempInvoiceCurrency = "PKR"
              } else if (e.target.value == "client") {
                value = "Recievable";
                TempInvoiceCurrency = "PKR"
              } else if (e.target.value == "agent") {
                value = "Payble";
                TempInvoiceCurrency = "USD"
              }
              setAll({
                selectedParty: { id: "", name: "" }, partytype: e.target.value,
                search: "", payType: value, invoiceCurrency: TempInvoiceCurrency
              })
              dispatchNew(setPartyType(e.target.value),)
              dispatchNew(setSelectedParty({ id: '', name: '' }))
              dispatchNew(setPayType(value))
              dispatchNew(setInvoiceCurrency(TempInvoiceCurrency))
            }}>
            <Radio value={"client"} defaultChecked>Client</Radio>
            <Radio value={"vendor"}>Vendor</Radio>
            <Radio value={"agent"} >Agent </Radio>
          </Radio.Group>
        </Col>
        <Col md={3}>
          <b>Pay Type: </b>
          <Radio.Group className='mt-1' value={payType} onChange={(e) => {setAll({ search: "", payType: e.target.value }); dispatchNew(setPayType(e.target.value))}}
            disabled={partytype == "agent"}
          >
            <Radio value={"Payble"}>Payable</Radio>
            <Radio value={"Recievable"}>Receivable</Radio>
          </Radio.Group>
        </Col>

        <Col md={5} style={{ display: 'flex', justifyContent: 'end' }}>
          {edit &&
            <ReactToPrint
              content={() => inputRef}
              trigger={() => (
                <div className="div-btn-custom text-center p-1 mx-1" style={{ width: 80, fontSize: 14 }}>Print <PrinterOutlined style={{ fontSize: 16 }}/></div>
              )}
            />
          }
          <button className='btn-custom text-center px-3' style={{ fontSize: 14, marginRight: '5px' }}
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
          >Show Old <MdHistory style={{ fontSize: 16 }}/></button>

          {id != "new" && del && <DeleteVoucher companyId={companyId} setAll={setAll} state={state} id={id} setShowTable={setShowTable} />}
          {!isPaymentReceiptNew && (
        <button className='btn-custom px-3' style={{ fontSize: 14 }} onClick={chkReturn}>
          Cheque Return <RollbackOutlined style={{ fontSize: 16 }}/>
        </button>
      )}
      {id!='new'&&<button className='btn-custom-green text-center py-1 px-3 mx-1' style={{ fontSize: 14 }} onClick={() => refetch()}>Refresh <SyncOutlined style={{ fontSize: 16 }}/></button>}




        </Col>
        <Col md={6} className='mt-3'>
          {!selectedParty.name && <>
            <Input placeholder="Search type" size='small'
              suffix={state.search.length > 2 ? <CloseCircleOutlined onClick={() => setAll({ search: "" })} /> : <SearchOutlined />}
              value={state.search} onChange={(e) => {setAll({ search: e.target.value })}}
            />
            {state.search.length > 2 &&
              <div style={{ position: "absolute", zIndex: 10 }}>
                {/* <ListComp data={state.partyOptions} /> */}
                <ListComp data={state.partyOptions} style={{ maxHeight: '300px', overflowY: 'auto' }} />

              </div>
            }
          </>
          }
          {selectedParty.name && <>
            <button
              className="btn-custom-green px-3 h-screen flex items-center justify-evenly"
              onClick={addNew}
            >
              <span className='mx-1'>Add New</span><PlusOutlined style={{ fontSize: 16 }}/>
            </button>
          </>
          }
        </Col>
        {!tranVisible && <Col md={1} className='mt-3'>
          <Select disabled={partytype != "agent" ? true : false} value={invoiceCurrency} size='small'
            onChange={(e) => {setAll({ invoiceCurrency: e }); dispatchNew(setInvoiceCurrency(e))}}
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
        {!tranVisible && <Col md={4} className='mt-3'>
          <div className='d-flex justify-content-end'>
            <Input type="text" placeholder="Search..." size='small' onChange={e => setQuery(e.target.value)} />
          </div>
        </Col>
        }

        {/* <Col md={4} className='mt-3'style={{border:'1px solid silver'}}>{selectedParty.name}</Col> */}
        <Col md={12}><hr className='p-0 my-3' /></Col>
      </Row>
      {/* table start */}
      {showTable && !tranVisible && (
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

      {tranVisible && <BillComp companyId={companyId} state={state} dispatch={dispatch}/>}
      <div className="d-none">
        <div ref={(res) => (inputRef = res)} className="px-2">
          <PrintTransaction companyId={companyId} state={state} dispatch={dispatch} />
        </div>
      </div>
      <Modal
        width={'80%'}
        open={state.oldVouchers}
        onOk={() => {setAll({ oldVouchers: false }) }}
        onCancel={() => {setAll({ oldVouchers: false }) }}
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