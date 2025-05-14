import React, { useEffect, useReducer } from 'react';
import { recordsReducer, initialState } from './states';
import { getJobValues, getJobById } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

const SeJob = ({id, type}) => {
  

  return (
  <div className='base-page-layout'>
    {
      <CreateOrEdit id={id} type={type}/>
    }
  </div>
  )
}

export default React.memo(SeJob);