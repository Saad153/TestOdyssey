import React from 'react';
import CompareReports from '../../Components/Layouts/Dashboard/CompareReports';
import Cookies from 'cookies';
import axios from 'axios';
// import Cookies from 'js-cookie';
// import CompareReports from '../../Components/Layouts/Dashboard/CompareReports';

const compareReports = ({sessionData}) => {
    return (
        <CompareReports sessionData={sessionData}/>
    )
}

export default compareReports

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
  
    return{
        props: { sessionData:sessionRequest,  }
    }
}