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
import { setField, setFullJobState } from '../../../../redux/Job/jobSlice';

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
      dispatch(setFullJobState(x.result));
      setLoading(false);
    })
  }

  useEffect(()=>{
    if(id == 'new' && first){
      fetchValues();
      setFirst(false);
    }
  }, [id])
  return(
    <div  className='client-styles'  style={{overflowY:'auto', overflowX:'hidden'}}>
      {loading ? <Spinner animation="border" /> : <Tabs  defaultActiveKey={"1"}>
        <Tabs.TabPane tab="Booking Info" key={"1"}>
          <BookingInfo dispatch={dispatch} state={state} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Equipment" key={"1"}>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Routing" key={"1"}>
        </Tabs.TabPane>
      </Tabs>}
    </div>
  )
}

export default React.memo(CreateOrEdit)