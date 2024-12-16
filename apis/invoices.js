import axios from "axios";

export async function getInvoiceByJobId({id}) {
    console.log("Function>>", id)
    let result = [];
    await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/invoice/getClientInvoiceByJobId`,{
        headers:{"id": `${id}`}
    }).then((x)=>x.data.status=="success"?result = x.data.result:[]);
    return result;
}