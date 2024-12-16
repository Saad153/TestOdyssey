import React from 'react';
import JobDetails from '../../Components/Layouts/JobsLayout/JobDetails';

const JobInfo = ({id}) => {
    return (
        <div className='base-page-layout'>
        {/* <div>JobInfo{id}</div> */}
        <JobDetails id={id}/>
        </div>
    )
}
export default JobInfo

export async function getServerSideProps(context) {
    const { params } = context;
    return {
      props: { id:params.id}
    }
  }