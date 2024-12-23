import React from 'react';
import moment from 'moment';
import { Container } from 'react-bootstrap';

const PrintTopHeader = ({company, from, to}) => {
  return (
    <>
    {console.log("company", company)}
    <div className="d-flex justify-content-between" >
        <div style={{width:"20%"}} className="text-center">
            <img src={company=='1' && "/cargolinkers-logo.png"} className="invert" width={company=='4'?250:130}/>
        </div>
        <div style={{width:"60%"}} className="text-center">
            <h5>
                <b>
                    {company=='1' && "CARGO LINKERS"}
                </b>
            </h5>
            <div className="fs-13">
                House# D-213, DMCHS, Siraj Ud Daula Road, Karachi
            </div>
            <b>
                <span>{from?'Dated: '+from:''}</span> <span className='mx-2'>-</span> <span>{to?to:''}</span>
            </b>
        </div>
        <div style={{width:"20%", paddingTop:20}}>
        </div>
    </div>
    </>
  )
}

export default PrintTopHeader
