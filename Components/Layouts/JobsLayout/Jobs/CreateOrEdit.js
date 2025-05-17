import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic'
import moment from 'moment';
import { Tabs } from "antd";
import Routing from './Routing';
import Cookies from 'js-cookie';
import Router from "next/router";
import { Spinner } from 'react-bootstrap';
import { checkEmployeeAccess} from '/functions/checkEmployeeAccess';
import { setJobField, setFullJobState } from '../../../../redux/Job/jobSlice';

const Invoice = dynamic(() => import('./Invoice'), {loading: () => <p>Loading...</p>,})
const BookingInfo = dynamic(() => import('./BookingInfo'), {loading: () => <p>Loading...</p>,})
const ChargesComp = dynamic(() => import('./ChargesComp'), {loading: () => <p>Loading...</p>,})
const EquipmentInfo = dynamic(() => import('./EquipmentInfo'), {loading: () => <p>Loading...</p>,})
const DelieveryOrder = dynamic(() => import('./Delievery Order'), {loading: () => <p>Loading...</p>,})
const LoadingProgram = dynamic(() => import('./Loading Program'), {loading: () => <p>Loading...</p>,})

import { incrementTab, removeTab } from '/redux/tabs/tabSlice';
import PopConfirm from '/Components/Shared/PopConfirm';
import { createNotification } from '/functions/notifications';
import openNotification from '/Components/Shared/Notification';
import FullScreenLoader from '/Components/Shared/FullScreenLoader';
import { useDispatch, useSelector } from 'react-redux';

const CreateOrEdit = ({id}) => {
  const state = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [ first, setFirst ] = useState(true);

  const fetchValues = async () => {
    const result = axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getValues`, {
      headers: {
        companyId: Cookies.get('companyId')
      }
    }).then((x) => x.data);
    result.then((x) => {
      console.log(x)
      dispatch(setJobField({ field: 'parties', value: x.result.party.client }));
      setLoading(false);
    })
  }

  useEffect(()=>{
    if(id == 'new' && first){
      fetchValues();
      setFirst(false);
    }
  }, [id])

  useEffect(() => {
    console.log("STATE: ", state)
  }, [state])
  return(
    <div  className='client-styles'  style={{overflowY:'auto', overflowX:'hidden'}}>
      {loading ? <Spinner animation="border" /> : <Tabs  defaultActiveKey={"1"}>
        <Tabs.TabPane tab="Booking Info" key={"1"}>
          <BookingInfo setJobField={setJobField} state={state} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Equipment" key={"2"}>
          <EquipmentInfo setJobField={setJobField} state={state} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Routing" key={"3"}>
          <Routing setJobField={setJobField} state={state} />
        </Tabs.TabPane>
      </Tabs>}
    </div>
  )
}

export default React.memo(CreateOrEdit)