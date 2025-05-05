import React from 'react';
import Parties from '/Components/Layouts/Setup/Parties';
import axios from 'axios';
import Cookies from 'cookies';

const parties = ({sessionData, partiesData}) => {
  return (
    <div>
      <Parties sessionData={sessionData} partiesData={partiesData}/>
    </div>
  )
}
export default parties;

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

//   const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,{
//     headers:{"id": `${cookies.get('companyId')}`}
//   }).then((x)=>x.data);

  const partiesRequest = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/parties/getAll`,{
    // headers:{"id": `${cookies.get('companyId')}`}
  }).then((x)=>x.data);
  return{
      props: { sessionData:sessionRequest, partiesData:partiesRequest }
  }
}