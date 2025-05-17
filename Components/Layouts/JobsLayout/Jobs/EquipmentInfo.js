import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PopConfirm from '../../../Shared/PopConfirm';
import { useDispatch } from 'react-redux';

const EquipmentInfo = ({setJobField, state}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(state.equipment)
    if(state.equipment.length == 0){
      console.log("No equipment")
      let eq = {
        size: "40h",
        quantity: "1",
        dg: "DG",
        gross: "1000",
        teu: "1000",
      }
      dispatch(setJobField({ field: 'equipment', value: [eq] }))
    }
  }, [])

  return (
    <div>
      <button
        onClick={() => {
          let eq = {
            size: "40h",
            quantity: "1",
            dg: "DG",
            gross: "1000",
            teu: "1000",
          }
          if(state.equipment){
            console.log("Case 1")
            dispatch(setJobField({ field: 'equipment', value: [...state.equipment, eq] }))
          }else{
            console.log("Case 2")
            dispatch(setJobField({ field: 'equipment', value: [eq] }))
          }
        }}
        className="btn-custom mt-1 px-3"
      >
        Add
      </button>
      <br/>
      <table style={{width: "100%"}}>
        <tr style={{borderBottom: "1px solid grey"}}>
          <th style={{width: "20%"}}>Size/Type</th>
          <th style={{width: "20%"}}>Qty</th>
          <th style={{width: "10%"}}>DG/Non-DG</th>
          <th style={{width: "20%"}}>Gross WT/CNT</th>
          <th style={{width: "20%"}}>TEU</th>
          <th style={{width: "10%"}}>Remove</th>
        </tr>
        {console.log(state.equipment)}
        {state?.equipment?.map((x, i) => 
          <tr key={i} style={{borderBottom: "1px solid grey"}}> 
            <td style={{width: "20%"}}>{x.size}</td> 
            <td style={{width: "20%"}}>{x.quantity}</td> 
            <td style={{width: "10%"}}>{x.dg}</td> 
            <td style={{width: "20%"}}>{x.gross}</td> 
            <td style={{width: "20%"}}>{x.teu}</td> 
            <td style={{width: "10%"}}><CloseCircleOutlined onClick={() => dispatch(setJobField({ field: 'equipment', value: state.equipment.filter((_, index) => index !== i) }))} /></td> 
          </tr>
        )}
      </table>
    </div>
  )
}

export default React.memo(EquipmentInfo)