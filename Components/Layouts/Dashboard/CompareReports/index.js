import { Button, Select, Table, Upload } from "antd";
import React, { use, useEffect, useState } from "react";
import  { CheckCircleOutlined, UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import companies from "/jsonData/companiesList.json";
import { set } from "react-hook-form";
import axios from "axios";
import snakeCaseConversion from "../../../../functions/SnakeCaseConversion";
const CompareReports = ({sessionData}) => {
  const [GdFile, setGdFile] = useState(null);
  const [InvoiceFile, setInvoiceFile] = useState(null);
  const [company, setCompany] = useState("");
  const [response, setResponse] = useState({
    // error: {},
    matched:{},
    not_matched:{},
  });
  // const [message, setMessage] = useState();
  const [isAllMatched, setIsAllMatched] = useState(null);
    useEffect(() => {
      setIsAllMatched(null);
        if(sessionData.isLoggedIn==false){
          Router.push('/login')
        }
      }, [sessionData]);

      useEffect(() => {
        console.log('GD:',GdFile,'Invoice:', InvoiceFile)
      },[GdFile, InvoiceFile])

      useEffect(() => {
        if(response){
          console.log("///data",response);
          // generateMessage(response);
        }
        
      },[response]);

      const compareReports = async () => {
        if(GdFile && InvoiceFile && company){
          const formData = new FormData();
          formData.append('gd_file', GdFile);
          formData.append('invoice_file', InvoiceFile);
          console.log("GD:",formData,'Invoice:', InvoiceFile)
          const response = await axios.post("http://192.168.50.33:8003/compare-files/", formData, {
            params: {
              Title: company
            },
        });
          console.log("data",response);
          // response.data.Country = false;
          // response.data.Name = false;
       response.data.error ? setResponse(response.data) : setResponse(response.data,{error:null});   
       generateMessage(response.data);
      }
      // console.log("data",response);
    }

    const generateMessage = (data) => {
      const result = Object.fromEntries(Object.entries(data.matched)?.filter(([key, value]) => {
       return value === false
      
      }));
      console.log('result',result);
      if(Object.keys(result).length > 0){
        setIsAllMatched(false);
    }  else {
      setIsAllMatched(true);
    }
      console.log("data",result);
    }
    return (
 <div className='base-page-layout'>
  <div style={{height:"22vh", display:"flex", padding:"1% 3% 0% 3%", marginTop:"3rem", justifyContent:"space-between"}}>
    <div style={{width:"48%", border:"2px dashed #bbbbbb", borderRadius:"10px", alignItems:"center", display:"flex", justifyContent:"center"}}>
      {/* <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/> */}
      Upload GD File
      <Upload beforeUpload= {(file) =>  setGdFile(file) } onRemove={() => setGdFile(null)} accept="application/pdf">
        <Button  icon={<UploadOutlined />} className="btn-primary" style={{ border:"0.5px solid lightgrey", marginLeft:"1rem", borderRadius:"6px", fontFamily:"Segoe UI"}}>Select PDF File</Button>
      </Upload >
    </div>
    <div style={{width:"48%", border:"2px dashed #bbbbbb", borderRadius:"10px", alignItems:"center", display:"flex", justifyContent:"center"}}>
    Upload Invoice File
      <Upload beforeUpload= {(file) =>  setInvoiceFile(file) } onRemove={() => setInvoiceFile(null)} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
        <Button  icon={<UploadOutlined />} className="btn-primary" style={{ border:"0.5px solid lightgrey", marginLeft:"1rem", borderRadius:"6px", fontFamily:"Segoe UI"}}>Select Excel File</Button>
      </Upload >
    </div>
  </div>
  <div className="flex gap-2 mt-4 " style={{ justifyContent:"right", paddingRight:"3%"}}>
  <Select placeholder="Select Company" variant="borderless" style={{width:"10rem", marginLeft:"2%"}} options={companies.map((company) => ({ label: company.name, value: company.id }))} onChange={(e) => setCompany(e)}/>
  <button className="btn-custom" onClick={compareReports} style={{width:"6rem", marginLeft:"3px", border:"0.5px solid #bbbbbb", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center"}} >Compare</button>
  </div>
  {/* {console.log('matched',isAllMatched)} */}
  <div className="" style={{width:"94%", height:"50%", display:"flex", alignItems:"center", justifyContent:"center" ,border:"2px dashed #bbbbbb", borderRadius:"10px", marginTop:"1.5rem",marginLeft:"3%", marginRight:"3%", padding:"1rem"}}>
    {response?.error!==null ? <p className="text-left" style={{width:"25rem", marginLeft:"2%", fontSize:"16px", fontWeight:"bold"}}><CloseCircleOutlined style={{fontSize:"18px", color:"red"}}/>Error in format please contact IT department</p> :
    isAllMatched === true? <p className="text-left" style={{width:"10rem", marginLeft:"2%", fontSize:"16px", fontWeight:"bold"}}><CheckCircleOutlined style={{fontSize:"18px", color:"green"}}/> All fields Matched</p>
    : isAllMatched === false ? (
    <div style={{width:"100%", height:"100%", overflow:"auto"}}>
    <Table 
            // className="tableFixHead"
            dataSource={Object?.keys(response?.not_matched?.gd_data)?.map((field) => ({
              key: field,
              field,
              ...Object?.keys(response?.not_matched).reduce((acc, source) => {
                acc[source] = response.not_matched[source][field] || "-";
                console.log('acc',acc)
                return acc;
              }, {}),
            }))}
            columns={[
              { title:<span style={{fontWeight:"bold"}}>Field</span>, dataIndex: "field", key: "field" },
              ...Object.keys(response?.not_matched)?.map((source) => ({
                title:<span style={{fontWeight:"bold"}}>{snakeCaseConversion(source)}</span>, 
                dataIndex: source,
                key: source,
              })),
            ]}
            pagination={false}
          />

    </div>
  ):  <p className="text-left" style={{width:"10rem", marginLeft:"2%", fontSize:"16px", fontWeight:"bold"}}>Please Upload Files</p>}
  </div>
  </div>
    )
}

export default React.memo(CompareReports);