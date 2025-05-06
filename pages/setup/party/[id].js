import React from 'react';
import axios from "axios";
import Cookies from 'cookies';
import CreateOrEdit from '/Components/Layouts/Setup/Parties/CreateOrEdit';

const client = ({id, representativeData, clientData}) => {
  return (
    <>
        <CreateOrEdit id={id}  representativeData={representativeData} clientData={clientData} />
    </>
  )
}
export default client

export async function getServerSideProps(context) {
    const { params } = context;
    let clientData = null; // 👈 initialize to null (safe for serialization)
    const { companyId } = context.req.cookies;
  
    const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES, {
      headers: { "id": `${companyId}` }
    }).then((x) => x.data);
  
    if (params.id !== "new") {
      const fetchedClientData = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/parties/getPartyById`, {
        headers: { "id": `${params.id}` }
      }).then((x) => x.data);
  
      if (!fetchedClientData?.result) {
        return {
          notFound: true,
        };
      }
  
      clientData = fetchedClientData.result; // 👈 safe assignment
    }
  
    return {
      props: { 
        id: params.id,
        representativeData: representativesRequest,
        clientData: clientData // 👈 now guaranteed to be object or null
      }
    };
  }
  