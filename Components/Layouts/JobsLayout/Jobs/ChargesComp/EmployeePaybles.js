import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import Cookies from "js-cookie";
import axios from "axios";
import { useWatch, useFieldArray, useForm } from "react-hook-form";
import PopConfirm from '/Components/Shared/PopConfirm';
import { getEmpList, getStatus } from "../states";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import openNotification from '../../../../Shared/Notification';
import { Select } from 'antd';

const EmployeeList = ({state, dispatch, jobNo, jobID}) => {
    // console.log("EmpPay"+jobID)
    const { register, handleSubmit, control, reset } = useForm();
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "EmpPay"
      });

    const [DeleteList, setDeleteList] = useState([]);
    let Delete = [];
    const [AllEmp, setAllEmp] = useState([]);
    const [AllAccounts, setAllAccounts] = useState([]);
    const [EmpData, setEmpData] = useState([]);

    const [temp1, setTemp1] = useState([]); 
    useEffect(() => {
        const fetchData = async () => {
            let temp2 = []
          const data = await getEmpList(jobID);
          data.map((x)=>temp2.push(
            {
                newid: x.id,
                requestedby: x.requestedby,
                amount: x.amount,
                preparedby: x.preparedby,
                approved: x.approved,
                paid: x.paid,
                accountid: x.accountid,
                employeeid: x.employeeid,
                jobid: x.jobid,
                new: false,
            }
          ))
          try{
            const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES)
            setAllEmp(result.data.result);
            result.data.result.forEach(element => {
                data.forEach(x => {
                    if(element.id == x.employeeid){
                        setEmpData(element)
                    }
                })
            });
            }catch(e){
                console.error(e)
            }
            try{
                const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS)
                // setAllAccounts(result.data.result);
                // const result1 = result.data
                console.log("data1",result.data);
                let temp =[]
                result.data.result.forEach(element => {
                    if(element.Parent_Account.title == "Employee Payables"){
                        temp.push(element)
                    }
                });
                setAllAccounts(temp);
            }catch(e){
                console.error(e)
            }
            setTimeout(() => {
                
            }, 5000);
            replace(temp2)

        };
    
        fetchData();
    }, [temp1]);
AllAccounts.forEach(x => {
    console.log(x.title)
})
// console.log(AllAccounts)
    return(
        <>
            <Row>
                <Col style={{ maxWidth: 150 }} className='text-center'>
                <div className="div-btn-custom text-center py-1 fw-8"
                onClick={() => {
                    console.log(jobID)
                    append({
                        requestedby: "",
                        amount: 0,
                        preparedby: Cookies.get("username"),
                        approved: false,
                        paid: false,
                        accountid: "",
                        employeeid: "",
                        jobid: jobID,
                        new: true,
                    })
                    // console.log("Added")
                }}
                >
                    Add+
                </div>
                </Col>
                <Col>
                <div className='div-btn-custom text-center mx-0 py-1 px-3' style={{float:'right'}}
                onClick={async () => {
                    let changes = false
                    fields.forEach(x => {
                        if(x.new == true){
                            changes = true
                        }
                    })
                    if(DeleteList.length == 0 && !changes){
                        openNotification("No Changes", "No Changes", "orange")
                    }
                    for(let x of DeleteList){
                        x.id = x.newid
                        const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_EMPLOYEE_PAYABLE, {
                            headers:{"id": `${x.id}`}
                        })
                    }
                    let tempo = fields
                    for(let x of tempo){
                        x.id = x.newid
                        if(x.newid == null){
                            delete x.id
                            delete x.newid
                        }
                        let check = false;
                        if(x.requestedby != "" && x.amount > 0 && x.accountid != "" && x.employeeid != ""){
                            check = true
                        }
                        
                        if(check && x.new == true){
                            console.log("x>>>",x)
                            delete x.new
                            console.log(x.jobid)
                            const result = await axios.post(`http://localhost:8088/EmployeePayables/EmployeePayableUpsert`, {
                                ...x
                            })
                            x.new = false
                            console.log(result)
                            // console.log(result.status)
                            openNotification("success", "Saved Successfully", "green")
                        }else if(check == false){
                            openNotification("Error", "Incomplete Data", "orange")
                            
                        }
                    }
                    // await tempo.forEach(x => {
                    //     x.id = x.newid
                    //     if(x.newid == null){
                    //         delete x.id
                    //         delete x.newid
                    //     }
                    //     let check = false;
                    //     if(x.requestedby != "" && x.amount > 0 && x.accountid != "" && x.employeeid != ""){
                    //         check = true
                    //     }
                        
                    //     if(check && x.new == true){
                    //         // process.env.NEXT_PUBLIC_CLIMAX_POST_EMPLOYEE_PAYABLE_UPSERT
                    //         delete x.new
                    //         console.log(x.jobid)
                    //         const result = await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/EmployeePayables/EmployeePayableUpsert`, {
                    //             ...x
                    //         })
                    //         x.new = false
                    //         console.log(result)
                    //         // console.log(result.status)
                    //         openNotification("success", "Saved Successfully", "green")
                    //     }else if(check == false){
                    //         openNotification("Error", "Incomplete Data", "orange")
                            
                    //     }
                    // })
                    replace(tempo)
                    console.log(fields)
                }}
                >
                Save Charges
                </div>
                </Col>
            </Row>
            <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
                <Table className='tableFixHead' bordered>
                    <thead>
                        <tr className='table-heading-center'>
                            <th style={{ width: 50}}>x</th>
                            <th style={{ width: 150}}>Employee</th>
                            <th>Account</th>
                            <th style={{ width: 175}}>Prepared By</th>
                            <th style={{ width: 75}}>Approved</th>
                            <th style={{ width: 175}}>Job No</th>
                            <th style={{ width: 175}}>Amount</th>
                            <th style={{ width: 175}}>Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    {fields.map((x, index) => {
                        const accountTitle = AllAccounts.find(account => account.id === x.accountid)?.title || x.accountid;
                                return(
                                    <tr key={index} className='f table-row-center-singleLine'>
                                        <td className='text-center'>
                                        <CloseCircleOutlined className='cross-icon' style={{ position: 'relative', bottom: 3 }}
                                            onClick={() => {
                                                console.log(x.approved)
                                            if((x.approved==false)) {
                                            PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
                                            () => {
                                                let temp = [...fields];
                                                Delete.push(temp[index]);
                                                console.log(Delete);
                                                setDeleteList(Delete);
                                                console.log(DeleteList)
                                                temp.splice(index, 1);
                                                replace(temp);
                                            })}}}
                                        />
                                        </td>
                                        <td className='text-center'>
                                            {!x.new && x.requestedby}
                                            {x.new && <Select className='table-dropdown' showSearch style={{ padding: 0 }} disabled={!x.new && getStatus("admin")} onChange={e => {
                                                const parts = e.split(',');
                                                x.employeeid = parts[1];
                                                x.requestedby = parts[0];
                                            }}>
                                                {AllEmp.map((x) => <Select.Option key={x.id} value={x.name + "," + x.id}>{x.name}</Select.Option>)}
                                            </Select>}
                                        </td>
                                        <td className='text-center'>
                                            {!x.new && accountTitle}
                                            {x.new && <Select className='table-dropdown' showSearch style={{ padding: 0 }} disabled={x.new && getStatus("admin")} onChange={e => x.accountid = e}>
                                            {AllAccounts.map((x) => <Select.Option key={x.id} value={x.id}>{x.title}</Select.Option>)}
                                            {console.log('AllAccounts',AllAccounts)}
                                            </Select>}
                                        </td>
                                        <td className='text-center'>{x.preparedby}</td>
                                        <td className='text-center'>{x.approved? <CheckCircleOutlined style={{ color: 'green' }} />: 'UnApproved'}</td>
                                        <td className='text-center'>{jobNo}</td>
                                        <td className='text-center'>
                                            {!x.new && x.amount}
                                            {x.new && <input className='table-dropdown' type="number" style={{ border: "1px solid #d7d7d7", padding: 0 }} onChange={(e) => x.amount = e.target.value}/>}
                                        </td>
                                        <td className='text-center'>{x.paid? <CheckCircleOutlined style={{ color: 'green' }} />: 'Unpaid'}</td>
                                    </tr>
                                )

                    })}
                            </tbody>

                </Table>

            </div>
        </>
    )
}

export default React.memo(EmployeeList)