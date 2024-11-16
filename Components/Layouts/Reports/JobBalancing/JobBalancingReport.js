import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PrintTopHeader from '/Components/Shared/PrintTopHeader';
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from 'react-to-print';
import Cookies from "js-cookie";
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import Pagination from "/Components/Shared/Pagination";
import exportExcelFile from "/functions/exportExcelFile";
import ExcelJS from "exceljs";

const JobBalancingReport = ({ result, query }) => {

  let inputRef = useRef(null);
  const [load, setLoad] = useState(true);
  const [records, setRecords] = useState([]);
  const [username, setUserName] = useState("");
  const dispatch = useDispatch();
  const commas = (a) => a ? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.0';
  console.log(result)
  const getTotal = (type, list) => {
    let values = 0.00;
    list.forEach((x) => {
      if (type == x.payType) {
        values = values + x.total
      }
    })
    return commas(values);
  }

  const paidReceivedTotal = (list) => {
    let paid = 0.00, Received = 0.00, total = 0.00;
    list.forEach((x) => {
        if (x.payType == "Payble") {
            paid = paid + parseFloat(x.paid)
        } else {
            Received = Received + parseFloat(x.recieved)
        }
    })
    total = Received - paid
    return total > 0 ? commas(total) : (`${commas(total * -1)}`);
  }

  const ImageToBlob = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS if required
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(resolve);
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice Report');
  
    // Column definitions
    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Job. No', key: 'jobNo', width: 20  },
      { header: 'Job Date', key: 'jobDate', width: 15  },
      { header: 'Invoice/Bill#', key: 'invoiceNo', width: 20  },
      { header: 'Invoice/Bill Date', key: 'invoiceDate', width: 20  },
      { header: 'HBL.No/HAWB', key: 'hbl', width: 20  },
      { header: 'MBL.No/MAWB', key: 'mbl', width: 20  },
      { header: 'Sailing Date', key: 'sailingDate', width: 20 },
      { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
      { header: 'OP Code', key: 'opCode', width: 10  },
      { header: 'Voyage/Flight', key: 'voyageNo', width: 20 },
      { header: 'Party', key: 'party', width: 35 },
      { header: 'Client Code', key: 'clientCode', width: 20 },
      { header: 'Shipper', key: 'shipper', width: 35  },
      { header: 'Consignee', key: 'consignee', width: 35  },
      { header: 'Sales Rep', key: 'salesRep', width: 25  },
      { header: 'Shipping Line', key: 'shippingLine', width: 35  },
      { header: 'Vessel', key: 'vessel', width: 15  },
      { header: 'Final Destination', key: 'finalDestination', width: 20  },
      { header: 'J/Type', key: 'jType', width: 10  },
      { header: 'F/Type', key: 'fType', width: 10  },
      { header: 'Containers', key: 'containers', width: 25  },
      { header: 'Weight', key: 'weight', width: 10  },
      { header: 'Volume', key: 'volume', width: 10  },
      { header: 'Currency', key: 'currency', width: 10  },
      { header: 'Recievable', key: 'recievable', width: 15  },
      { header: 'Payable', key: 'payable', width: 15  },
      { header: 'Recieved', key: 'recieved', width: 15  },
      { header: 'Paid', key: 'paid', width: 15  },
      { header: 'Balance', key: 'balance', width: 15  },
      { header: 'Aging Days', key: 'agingDays', width: 15  },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } 
      };
      cell.border = {
        right: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        top: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
      }
      cell.font = {
        bold: true,
      };
    
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    });
    const data = result.result
      .filter((x) => (query.balance === 'exclude0' ? Math.floor(x.balance) !== 0 : x))
      .map((x, i) => ({
        index: i + 1,
        jobNo: x.SE_Job?.jobNo,
        jobDate: moment(x.SE_Job?.createdAt).format('DD-MM-YYYY'),
        invoiceNo: x.invoice_No,
        invoiceDate: moment(x.createdAt).format('DD-MM-YYYY'),
        hbl: x?.SE_Job?.Bl?.hbl,
        mbl: x?.SE_Job?.Bl?.mbl,
        sailingDate: x?.SE_Job?.shipDate?moment(x?.SE_Job?.shipDate).format('DD-MM-YYYY'):null,
        arrivalDate: x?.SE_Job?.arrivalDate?moment(x?.SE_Job?.arrivalDate).format('DD-MM-YYYY'):null,
        opCode: x?.SE_Job?.operation,
        voyageNo: x?.SE_Job?.Voyage.voyage,
        party: x.party_Name,
        clientCode: x?.SE_Job?.Client.code,
        shipper: x?.SE_Job?.shipper?.name,
        consignee: x?.SE_Job?.consignee?.name,
        salesRep: x?.SE_Job?.sales_representator?.name,
        shippingLine: x?.SE_Job?.shipping_line?.name,
        vessel: x?.SE_Job?.vessel?.name,
        finalDestination: x.SE_Job?.fd,
        jType: x.SE_Job?.subType,
        fType: x.Charge_Heads[0].pp_cc,
        containers: x.SE_Job?.container,
        weight: x.SE_Job?.weight,
        volume: x.SE_Job?.vol,
        currency: x.currency,
        recievable: x.payType == "Recievable" ?commas(x.total):'-',
        payable: x.payType != "Recievable" ?commas(x.total):'-',
        recieved: x.recieved,
        paid: x.paid,
        balance: x.payType != "Recievable" ?commas(x.total-x.paid):commas(x.total-x.recieved),
        agingDays: getAge(x.createdAt)+1,
      }));

  
      worksheet.addRows(data);
      worksheet.insertRow(1, ['']);
      worksheet.insertRow(1, ['']);
      worksheet.insertRow(1, ['', '', '', 'Date: From: ' + query.from + ' To: ' + query.to,]);
      worksheet.insertRow(1, ['', '', '', 'House# D-213, DMCHS, Siraj Ud Daula Road, Karachi']);
      query.company=='1' && worksheet.insertRow(1, ['', '', '', 'Seanet Shipping & Logistics']);
      query.company=='2' && worksheet.insertRow(1, ['', '', '', 'Air Cargo Services']);
      query.company!='1' && query.company!='2' && worksheet.insertRow(1, ['', '', '', 'Seanet Shipping & Logistics & Air Cargo Services']);
      worksheet.insertRow(1, ['']);
      worksheet.insertRow(1, ['']);

    worksheet.getCell('D3').font = {
      size: 16,  // Increase font size
      bold: true  // Make the text bold
    };
    worksheet.getCell('D4').font = {
      size: 16,  // Increase font size
      bold: true  // Make the text bold
    };
    worksheet.getCell('D5').font = {
      size: 14,  // Increase font size
      bold: true  // Make the text bold
    };

    const imageUrl = query.company=='1' ? '/seanet-colored.png' : query.company=='2' ? '/acs-colored.png' : '/sns-acs.png';

    // const imageUrl = '/public/seanet-logo-complete.png'
    const imageBlob = await ImageToBlob(imageUrl);

    const imageId = workbook.addImage({
      buffer: await imageBlob.arrayBuffer(), // Convert Blob to ArrayBuffer
      extension: 'png', // Image extension
    });

    worksheet.addImage(imageId, {
      tl: { col: 1, row: 1 }, // Top-left position (column, row)
      ext: { width: 150, height: 100 }, // Image width and height
    });

    try{
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'JobBalancing.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    }catch(e){
      console.log(e)
      console.error(e)
    }
  
    
  };

  const balanceTotal = (list) => {
    let balance = 0.00;
    list.forEach((x) => {
      if (x.payType == "Payble") {
        balance = balance - parseFloat(x.balance)
      } else {
        balance = balance + parseFloat(x.balance)
      }
    })
    return balance >= 0 ? commas(balance) : (`(${commas(balance * -1)})`);
  }

  const getAge = (date) => {
    let date1 = new Date(date);
    let date2 = new Date();
    let difference = date2.getTime() - date1.getTime();
    return parseInt(difference / 86400000)
  }

  useEffect(() => {
    // getValues(result);
    getUserName();
    async function getUserName() {
      let name = await Cookies.get("username");
      setUserName(name)
    }
    setLoad(false)

  }, [])

  // async function getValues(value) {
  //   if (value.status == "success") {
  //   let newArray = [...value.result];
  //   await newArray.forEach((y, i) => {
  //     y.no = i + 1;
  //     y.balance = y.total!="0"?y.payType == "Recievable" ?
  //       (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved)) :
  //       (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.paid)):(y.recieved*-1)
  //     y.total = (parseFloat(y.total)) + parseFloat(y.roundOff)
  //     y.paid = (parseFloat(y.paid)) + parseFloat(y.roundOff)
  //     y.recieved = (parseFloat(y.recieved)) + parseFloat(y.roundOff)
  //     y.age = getAge(y.createdAt);
  //     y.freightType = y?.SE_Job?.freightType == "Prepaid" ? "PP" : "CC"
  //     y.fd = y?.SE_Job?.fd;
  //     y.createdAt = moment(y.createdAt).format("DD-MMM-YY")
  //     y.hbl = y?.SE_Job?.Bl?.hbl
      
  //     y.Receivable = y.payType == "Recievable" ? commas(y.total) : "-";
  //     y.payble = y.payType != "Recievable" ? commas(y.total) : "-";
  //     y.balanced = y.payType == "Recievable" ? commas(y.recieved) : y.paid;
  //     // console.log(y.balanced, y.recieved, commas(y.recieved))
  //     y.finalBalance = y.payType != "Recievable" ? (`${commas(y.balance)}`) : commas(y.balance)

  //     // <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.total : "-"}</td>
  //     // <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? x.total : "-"}</td>
  //     // <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.recieved : x.paid}</td>
  //     // <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? (${x.balance}) : x.balance}</td>
  //   })
  //   if(query.options!="showall"){
  //     // console.log(newArray)
  //     newArray = await newArray.filter((x)=>{
  //       return x.balance!=0
  //     })
  //     // console.log(newArray)

  //   }
  //   setRecords(newArray);
  //   } else {}
  // }

  // Pagination Variables
  const [currentPage,setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage ;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = result.result ? result.result.slice(indexOfFirst,indexOfLast) : [];
  const noOfPages = records ? Math.ceil(records.length / recordsPerPage) : 0 ;
  // Pagination Variables
  
  const TableComponent = ({overflow}) => {
    return (
    <>
    {!load &&
      <>
      {result.result?.length > 0 &&
        <>
          <PrintTopHeader company={query.company} />
          <hr className='mb-2' />
          <div className='table-sm-1' style={{ maxHeight: overflow ? 530 : "50%", overflowY: 'auto' }}>
          <Table className='tableFixHead' bordered style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th className='text-center'>#</th>
                <th className='text-center' style={{ minWidth: 110 }}>Inv. No</th>
                <th className='text-center' style={{ minWidth: 110 }}>Job. No</th>
                <th className='text-center' style={{ minWidth: 90 }}>Job. Date</th>
                <th className='text-center' style={{ minWidth: 90 }}>Date</th>
                <th className='text-center' style={{ minWidth: 100 }}>HBL/HAWB</th>
                <th className='text-center' style={{ minWidth: 100 }}>MBL/MAWB</th>

                <th className='text-center' style={{ minWidth: 100 }}>Sailing Date</th>
                <th className='text-center'style={{ minWidth: 100 }}>Arrival Date</th>
                <th className='text-center'style={{ minWidth: 200 }}>Name</th>
                <th className='text-center'style={{ minWidth: 100 }}>Client Code</th>
                <th className='text-center'style={{ minWidth: 100 }}>Shipper</th>
                <th className='text-center' style={{ minWidth: 100 }}>Consignee</th>
                <th className='text-center'style={{ minWidth: 100 }}>Sales Representator</th>
                <th className='text-center'style={{ minWidth: 100 }}>Shipping Line</th>
                <th className='text-center' style={{ minWidth: 100 }}>Vessel</th>
                <th className='text-center'style={{ minWidth: 100 }}>F. Dest</th>
                <th className='text-center'>J/Tp</th>
                <th className='text-center'>F/Tp</th>
                <th className='text-center'>Weight</th>
                <th className='text-center'>Volume</th>
                <th className='text-center'>Currency</th>
                <th className='text-center' style={{ minWidth: 100 }}>Receivable</th>
                <th className='text-center'style={{ minWidth: 100 }}>Payable</th>
                <th className='text-center'style={{ minWidth: 100 }}>Recieved</th>
                <th className='text-center'style={{ minWidth: 100 }}>Paid</th>
                <th className='text-center'style={{ minWidth: 100 }}>Balance</th>
                <th className='text-center'>Age</th>
              </tr>
            </thead>
            <tbody>
              {/* without print  */}
              {overflow ? result.result.map((x,i)=>{
                const date = x.SE_Job?.jobDate;
                const formattedDate = moment(date).format('DD-MMM-YYYY');
                const sailDate = x.SE_Job?.shipDate;
                const formattedSailDate = moment(sailDate).format('DD-MMM-YYYY');
                const arrivalDate = x.SE_Job?.arrivalDate;
                let formattedArrivalDate;
                if(arrivalDate)
                {
                 formattedArrivalDate = moment(arrivalDate).format('DD-MMM-YYYY');

                }

              return (
                <tr key={i}>
                  <td style={{ maxWidth: 10 }}>{i + 1}</td>
                  <td 
                    className="blue-txt"
                    style={{ width: 90, cursor:"pointer"}}
                    onClick={async ()=>{
                      await Router.push(`/reports/invoice/${x.id}`)
                      dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}`}))
                    }}
                  >{x.invoice_No}</td>
                  <td 
                    style={{ width: 90, cursor:"pointer"}} 
                    className="blue-txt"
                    onClick={()=>{
                      let type = x?.SE_Job?.operation;
                      if(x?.SE_Job?.jobNo){
                        dispatch(incrementTab({
                        "label":type=="SE"?"SE JOB":type=="SI"?"SI JOB":type=="AE"?"AE JOB":"AI JOB",
                        "key":type=="SE"?"4-3":type=="SI"?"4-6":type=="AE"?"7-2":"7-5",
                        "id":x.SE_Job.id
                        }))
                        Router.push(type=="SE"?`/seaJobs/export/${x.SE_Job.id}`:type=="SI"?`/seaJobs/import/${x.SE_Job.id}`:
                          type=="AE"?`/airJobs/export/${x.SE_Job.id}`:`/airJobs/import/${x.SE_Job.id}`
                        )
                      }
                    }
                  }>
                    {x?.SE_Job?.jobNo}
                  </td>
                  <td style={{width:150}}>{moment(x.SE_Job?.createdAt).format('DD-MMM-YYYY')}</td>
                  <td style={{}}>{moment(x.createdAt).format('DD-MMM-YYYY')}</td>
                  <td style={{width:50}}>{x.SE_Job?.Bl?.hbl}</td>
                  <td style={{width:50}}>{x.SE_Job?.Bl?.mbl}</td>
                  <td style={{width:50}}>{moment(x.SE_Job?.shipDate).format('DD-MMM-YYYY')}</td>
                  <td style={{width:50}}>{x.SE_Job?.arrivalDate?moment(x.SE_Job?.arrivalDate).format('DD-MMM-YYYY'):null}</td> 
                  <td style={{width:150}}><b>{x.party_Name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.Client?.code}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.shipper?.name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.consignee?.name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.sales_representator?.name}</b></td>
                  <td style={{ maxWidth: 70 }}>{x.SE_Job?.shipping_line?.name}</td>
                  <td style={{ maxWidth: 70 }}>{x.SE_Job?.vessel?.name}</td>
                  <td style={{ maxWidth: 70 }}>{x.SE_Job?.fd}</td>
                  <td style={{width:20}}>{x.SE_Job?.subType}</td>
                  <td style={{width:20}}>{x.freightType}</td>
                  <td style={{width:20}}>{x.SE_Job?.weight}</td>
                  <td style={{width:20}}>{x.SE_Job?.vol}</td>
                  <td style={{width:20}}>{x.currency}</td>
                  <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ?commas(x.total):'-'}</td>
                  <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ?commas(x.total):'-'}</td>
                  <td style={{ textAlign: 'right' }} >{x.recieved}</td>
                  <td style={{ textAlign: 'right' }} >{x.paid}</td>
                  <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ?commas(x.total-x.paid):commas(x.total-x.recieved)}</td>
                  <td style={{ width: 1 }}>{getAge(x.createdAt)+1}</td>
                </tr>
              )}) : 
              // print mode 
              result.result.map((x, i) => {
                  return (
                  <tr key={i}>
                    <td style={{ maxWidth: 30 }}>{i + 1}</td>
                    <td style={{ maxWidth: 90, paddingLeft: 3, paddingRight: 3, cursor:"pointer"}} className="blue-txt"
                      onClick={async ()=>{
                        await Router.push(`/reports/invoice/${x.id}`)
                        dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}` }))
                      }}
                    >{x.invoice_No}</td>
                    <td style={{}}>{x.createdAt}</td>
                    <td style={{}}>{x.hbl}</td>
                    <td style={{}}>{x.party_Name}</td>
                    <td style={{ maxWidth: 90 }}>{x.fd}</td>
                    <td style={{}}>{x.freightType}</td>
                    <td style={{}}>{x.currency}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.total : "-"}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? x.total : "-"}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.recieved : x.paid}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? (`${x.balance}`) : x.balance}</td>
                    <td style={{ textAlign: 'center' }}>{x.age}</td>
                  </tr>
                  )
              })}
              {/* in print */}
              {!overflow && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'right' }}><b>Total</b></td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                  <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                  <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                  <td style={{ textAlign: 'center' }}>-</td>
                </tr>
              )}
              {/* showing total in the last page  */}
              {overflow && currentPage === noOfPages && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan={8} style={{ textAlign: 'right' }}><b>Total</b></td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                  <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                  <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                  <td style={{ textAlign: 'center' }}>-</td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          {overflow && <div className="d-flex justify-content-end mt-4">
            <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </div>
          }
        </>
      }
      {result.result.length == 0 && <>No Similar Record</>}
      </>
    }
    {load && <div className='text-center py-5 my-5'> <Spinner /> </div>}
    </>
  )}

  function dateCellFormatter(params) {
    const date = moment(params.value);
    return date.isValid() ? date.format('DD-MMM-YYYY') : null;
}

  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: '#', field: 'no', width: 50 },
    { headerName: 'Inv. No', field: 'invoice_No', filter: true,
          cellRenderer: params => {
              return <span style={{cursor:"pointer"}} onClick={ async()=>{
                  await Router.push(`/reports/invoice/${params.data.id}`)
                  dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${params.data.id}` }))
              }}>{params.data.invoice_No}</span>;
          }
    },
    { headerName: 'Job. No', field: 'SE_Job.jobNo', filter: true},
    { headerName: 'Job Date', field: 'SE_Job.jobDate', filter: true,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Date', field: 'createdAt', filter: true },
    { headerName: 'HBL/HAWB', field: 'hbl', filter: true },
    { headerName: 'MBL/MAWB', field: 'SE_Job.Bl.mbl', filter: true },
    { headerName: 'Sailing Date', field: 'SE_Job.shipDate', filter: true ,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Arrival Date', field: 'SE_Job.arrivalDate', filter: true ,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Name', field: 'party_Name', width: 224, filter: true },
    { headerName: 'Client Code', field: 'SE_Job.Client.code', width: 224, filter: true },
    { headerName: 'Shipper', field: 'SE_Job.Client.name', width: 224, filter: true },
    { headerName: 'Consignee', field: 'SE_Job.consignee.name', width: 224, filter: true },
    { headerName: 'Sales Representator', field: 'SE_Job.sales_representator.name', width: 224, filter: true },
    { headerName: 'Shipping Line', field: 'SE_Job.shipping_line.name', width: 224, filter: true },
    { headerName: 'Vessel', field: 'SE_Job.Vessel.name', width: 224, filter: true },
    { headerName: 'F. Dest', field: 'fd', filter: true },
    { headerName: 'J/Tp', field: 'subType', filter: true },
    { headerName: 'F/Tp', field: 'ppcc', filter: true },
    { headerName: 'Weight', field: 'SE_Job.weight', filter: true },
    { headerName: 'Vol', field: 'SE_Job.vol', filter: true },
    { headerName: 'Curr', field: 'currency', filter: true },
    {headerName: 'Debit', field: 'total', filter: true,
      cellRenderer: params => {
        return <>{params.data.payType != "Payble" ? commas(params.value) : "-"}</>;
      }
    },
    {
      headerName: 'Credit', field: 'total', filter: true,
      cellRenderer: params => {
        return <>{params.data.payType == "Payble" ? commas(params.value) : "-"}</>;
      }
    },
    {
      headerName: 'Paid/Rcvd', field: 'paid', filter: true,
      cellRenderer: params => {
        return <>{commas(params.data.payType == "Payble" ? params.data.paid : params.data.recieved)}</>;
      }
    },
    {
      headerName: 'Balance', field: 'balance', filter: true,
      cellRenderer: params => {
        return <>{commas(params.value)}</>;
      }
    },
    { headerName: 'Age', field: 'age', filter: true },
  ]);
  
  const defaultColDef = useMemo(() => ({ 
    sortable: true,
    resizable: true,
    filter: "agTextColumnFilter",
    floatingFilter: true,
  }));
  const getRowHeight = 38;


  return (
  <div className='base-page-layout'>
    {query.report == "viewer" && (
      <>
        <ReactToPrint content={() => inputRef} trigger={() => <AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
        {/* <---- Excel Download button ----> */}
        <div className="d-flex justify-content-end " >
          <button className="btn-custom-green px-3 mx-2" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </>
    )}
    {/* <---- Reports View only ----> */}
    {query.report == "viewer" && <TableComponent overflow={true}/>}
    {/* <---- list View only with filteration ----> */}
    {query.report != "viewer" &&
    <div className="ag-theme-alpine" style={{ width: "100%", height: '72vh' }}>
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowData={records} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection='multiple' // Options - allows click selection of rows
        getRowHeight={getRowHeight}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
    }
    {/* <---- Component that will be displaying in print mode  ----> */}
    <div style={{ display: 'none' }}>
      <div className="pt-5 px-3" ref={(response) => (inputRef = response)}>
        {/* <---- Setting overflow true while in printing ----> */}
        <TableComponent overflow={false}/>
        <div style={{ position: 'absolute', bottom: 10 }}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>Printed By: {username}</div>
      </div>
    </div>
  </div>
  )
};

export default React.memo(JobBalancingReport)