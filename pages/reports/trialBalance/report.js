import React from 'react';
import Report from '/Components/Layouts/Reports/TrialBalance/Report';
import axios from 'axios';

const report = ({query, result}) => {
  return (
    <div className='base-page-layout'>
      <Report query={query} result={result} />
    </div>
  )
}

export default report

export async function getServerSideProps(context) {
  const { query } = context;
  console.log(query)
  const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_TRIAL_BALANCE,{
    headers:{
      "company":query.company,
      "from":query.from,
      "to":query.to,
      "accountid":query.accountid,
      "currency":query.currency,
      "old": query.old
    }
  }).then((x)=>x.data);

  return{ 
    props: {
      result,
      query
    }
  }
}