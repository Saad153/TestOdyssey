import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import inWords from '/functions/numToWords';

const SLPrint = ({ records, invoice }) => {
  // console.log("invoicet",invoice)
  // console.log("records",records)
  
  const [gst, setGst] = useState("");
  useEffect(() => {
    const invoiceNumber = invoice?.invoice_No;

    if (invoiceNumber) {
      const [prefix, , , suffix] = invoiceNumber.split(/[-\/]/);
       const gstInv = `${prefix}-SI-${suffix}`;
       setGst(gstInv);
    } else {
      // console.log('Invoice number is undefined or not properly formatted.');
    }
  }, [invoice]);


    const [values, setValues] = useState({
        tax: 0,
        taxPercent:0.00,
        serviceCharges:0,
        total: 0,
        netBalance: 0,
    });
    const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }
    useEffect(() => {
      // console.log("incvoice", invoice)
      let result = 0;
      let temptax = 0;
      let taxPercent = 0;
      let netBalance = 0;
      let tempServiceCharges = 0;
      records.forEach((x) => {
          console.log('x',x)
        if(x.charge!='57'){
          // console.log('amount',x.local_amount)
          temptax = temptax + parseFloat(x.tax_amount);
          taxPercent = parseFloat(x.tax_amount)
          result = result + parseFloat(x.local_amount);
        } else {
          // console.log("Temp Service Charges: "+tempServiceCharges)
          // console.log("Local Amount: "+x.local_amount)
          // console.log('amount',x.amount)
          temptax = temptax + parseFloat(x.tax_amount);
          tempServiceCharges = tempServiceCharges + parseFloat(x.amount);
        }
        netBalance = netBalance + parseFloat(x.local_amount) + parseFloat(x.tax_amount)
      });
      // console.log("temptax",tempServiceCharges)
      setValues({
          tax: temptax,
          total: result,
          netBalance: netBalance,
          taxPercent: taxPercent,
          serviceCharges: tempServiceCharges
      });

      // console.log("values",values)
  }, [records])

    return (
    <div className='pb-5 px-5 pt-2'>
      <Row>
        <Col>
            <header className='justify-content-center text-center'>
            {/* <span className='fs-6'><strong>CARGO LINKERS</strong></span> <br /> */}
            <img src={'/cargolinkers-logo.png'} style={{filter:"invert(1)"}} className='my-2' height={80} />
            <br/>
            <span className='fs-12' style={{ lineHeight: "-20px" }}>F-50 BLOCK-6 SHAHRAH-E-FAISAL KARACHI</span>
            <br/>
            <span>Phone: 34315481-5 </span>
            </header>
        </Col>
      </Row>
      <Row>
        <Col>
            <header className='justify-content-center text-center'>
                <span className='fs-17'>SNTN#.5322935-2</span> <br />
            </header>
        </Col>
      </Row>
      <Row>
        <Row>
        <div className='text-center fs-17'>
                <strong>Sindh Sales Tax Invoice</strong>
            </div>
        </Row>
        <Col md={4}>
        <div>GST Invoice #: {gst}
       {/* <span style={{marginLeft: '5px'}}>  
        
        </span>  */}
            </div> 
        <div>Form-E #: {invoice?.SE_Job?.fileNo}</div>

        </Col>

        <Col md={4}>

        </Col>
        <Col md={4}>
        <div>Invoice No: {invoice?.invoice_No} </div>
        <div>Invoice Date #:{invoice.createdAt ? moment(invoice.createdAt).format('DD MMM, YYYY') : ""}</div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md="12" >
        <div> <b>Name of the Recipient : </b> {invoice?.SE_Job?.Client ? invoice?.SE_Job?.Client?.name : ""} </div> 
        <div> <b>Address of the Recipient :</b>{invoice?.SE_Job?.Client ? invoice?.SE_Job?.Client?.address1 : ""} </div>
        
        <hr />
     
      </Col>
      </Row>


      <Row>
        {/* {console.log('client',invoice.SE_Job?.Client)} */}
        <Col  md='6'>
        <div> <b>NTN No. of the Recipient : </b> {invoice?.SE_Job?.Client ? invoice?.SE_Job?.Client?.ntn : ""}</div>
        </Col>
        <Col md='6'>
        <div> <b>GD/Shipping Bill :  </b>{invoice?.SE_Job?invoice?.SE_Job?.gd : ""}</div> 

        </Col>

      </Row>
      <Row>
        <Col md='6'>
        <div> <b>Client.Inv.# : </b> {invoice?.SE_Job?invoice?.SE_Job?.customerRef : ""}</div>
        </Col>
        <Col md="6">
        <div> <b>Tax Invoice for the Clearance of : </b></div>
        </Col>

      </Row>
    
      <hr style={{marginTop:'30px' }} />  
      <Row style={{marginTop:'30px' }}> 
    <Col  md="4">
    </Col>
    <Col md="4" className='text-end'>
        <div >
            <b>
            Service Charges

            </b>
            </div>
    </Col>
    <Col md="4" className='text-end'>
    {commas(values.serviceCharges)}
    </Col>
        </Row>
       
        <Row> 
    <Col  md="4">
    </Col>
    <Col md="4" className='text-end'>
        <div>
            <b>
            Sales Tax @ {values.taxPercent} %

            </b>
            </div>
    </Col>
    <Col md="4" className='text-end'>
    {commas(values.tax)}
    </Col>
        </Row>

        <Row> 
    <Col  md="2">
    </Col>
    <Col md="6" className='text-end'>
        <div>
            <b>
            Amount of Additional Sales Tax (if any)

            </b>
            </div>
    </Col>
    <Col md="4" className='text-end'>
   0.00
    </Col>
        </Row>

        <Row> 
    <Col  md="2">
    </Col>
    <Col md="6" className='text-end'>
        <div>
            <b>
            Total Value of Service inclusive of tax

            </b>
            </div>
    </Col>
    <Col md="4" className='text-end'>
   1,130.00
    </Col>
        </Row>
        <div style={{marginTop: '12px'}}>
            <b>
               Amount In Words: 
            </b> {' '}
           
              Rupees One Thousand One Hundred Thirty Only 
           
        </div>
        <div>
            
        </div>


      <Row style={{marginTop: '30px'}}>

        <Col md="12" className='text-end'>
            <span className='fs-15 pe-3 fw-bold'>For :</span>
            <span className='fs-15 fw-bold'>CARGO LINKERS</span>
        </Col>
      </Row>
    </div>
    )
}

export default SLPrint