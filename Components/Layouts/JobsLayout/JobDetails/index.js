// import { Table } from "antd"

import { useQuery } from "@tanstack/react-query";
import { use, useEffect } from "react";
import { Table } from "react-bootstrap"
import { getInvoiceByJobId } from "../../../../apis/invoices";

const JobDetails = ({id}) => {

    const { data,isSuccess } = useQuery({queryKey: ["id",{id}], queryFn: () => getInvoiceByJobId({id})});
    useEffect(() => {
       getData(); 
    },[isSuccess])

    const getData = async() => {
        console.log('data',data)
    }
    return (
        <div>
            <h6>Job details</h6>
            <div style={{borderTop:'1px solid silver', marginTop:10, padding:4, display:'flex'}}>
            <Table className='tableFixHead' >
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Client</th>
                        <th>Client Inv#</th>
                        <th>Job#</th>
                        <th>Invoice#</th>
                        <th>GD#</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((x, i) => {
                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{x.party_Name}</td>
                                <td>{x.SE_Job.customerRef}</td>
                                <td>{x.SE_Job.jobNo}</td>
                                <td>{x.invoice_No}</td>
                                <td>{x.SE_Job.gd}</td>
                                <td>{x.total}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <br />
            </div>
            <button className='btn-custom'>Print Invoice</button>
        </div>
    )
}

export default JobDetails