import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PopConfirm from '../../../Shared/PopConfirm';

const EquipmentInfo = ({state, dispatch}) => {

  const width = '100%';
  
  const addEquipment = () => {
    let tempState = [...state.equipments];
    tempState.push({size:'', qty:'', dg:'', gross:'', teu:''});
    dispatch({type:'toggle', fieldName:'equipments', payload:tempState});
  }

  return (
  <div style={{border:'1px solid silver', padding:'10px'}}>
    <button type='button' className='btn-custom fw-8' onClick={addEquipment}>Add +</button>
    <div style={{maxHeight:170, overflowY:'auto', overflowX:'hidden'}}>
    <Table className='mt-2' borderless>
      <thead>
        <tr>
          <th>Size</th>
          <th>Container #</th>
          <th>Truck</th>
          {/* <th>Gross WT/CNT</th>
          <th>TEU</th>
          <th>Modify</th> */}
          <th></th>
        </tr>
      </thead>
      <tbody>
      {state.equipments.map((x, i) => {
      return(
        <tr className='f' key={i}>
          <td className='p-0 m-0 '>
          <Select style={{width:width}} value={x.size}
          allowClear
            onChange={(e)=>{
              let tempState = [...state.equipments];
              tempState[i].size = e;
              if(e=='40HC'){// 1 * 2
                tempState[i].gross = 3900;
              }else if(e=='20HC') { // 1 * 1
                tempState[i].gross = 0; 
              }else if(e=='20SD'){// 1 * 1
                tempState[i].gross = 2350; 
              }else if(e=='20FR'){// 1 * 1
                tempState[i].gross = 2900; 
              }else if(e=='40SD'){ // 1 * 2
                tempState[i].gross = 3750; 
              }else if(e=='45HC'){ // 1 * 2
                tempState[i].gross = 4800; 
              } else {
                tempState[i].gross = 0;
              }
              dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
            }}
            options={[
              {value:'20HC', label:'20HC'},
              {value:'20SD', label:'20SD'},
              {value:'20FR', label:'20FR'},
              {value:'40SD', label:'40SD'},
              {value:'40HV', label:'40HV'},
              {value:'45BK', label:'45BK'},
              {value:'45OT', label:'45OT'},
              {value:'45TK', label:'45TK'},
              {value:'45VH', label:'45VH'},
              {value:'M3', label:'M3'},
              {value:'40OT', label:'40OT'},
              {value:'20RE', label:'20RE'},
              {value:'20TK', label:'20TK'},
              {value:'40FR', label:'40FR'},
              {value:'40BK', label:'40BK'},
              {value:'40HCRF', label:'40HCRF'},
              {value:'20BK', label:'20BK'},
              {value:'20OT', label:'20OT'},
              {value:'20FT', label:'20FT'},
              {value:'40FT', label:'40FT'},
              {value:'40HC', label:'40HC'},
              {value:'45HC', label:'45HC'},
              {value:'Reef 20', label:'Reef 20'},
              {value:'Reef 40', label:'Reef 40'},
            ]}
          />
          </td>
          <td className='p-0'>
                <Input placeholder="Container #" value={x.container} style={{width:width}}
                  min={1}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].container = e.target.value;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} />
              </td>
              <td className='p-0'>
                <Input placeholder="truck #" value={x.qty} style={{width:width}}
                  min={1}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].qty = e.target.value;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} />
              </td>
          {/* <td>
            <InputNumber placeholder="Basic usage" value={x.qty} style={{width:width}}
            allowClear
              min={1}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                // console.log(tempState[i].gross)
                tempState[i].qty = e;
                let value = 0;
                tempState[i].size=="40HC"?
                  value = 3900:
                  tempState[i].size=="20HC"?
                  value = 0:
                  tempState[i].size=="20SD"?
                  value = 2350:
                  tempState[i].size=="20FR"?
                  value = 2900:
                  tempState[i].size=="40SD"?
                  value = 3750:
                  tempState[i].size=="45HC"?
                  value = 4800:
                  value = 0;
                tempState[i].gross = value * tempState[i].qty;
                tempState[i].teu = tempState[i].qty*2;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }} />
          </td>
          <td>
            <Select style={{ width: width }} value={x.dg}
            allowClear
              onChange={(e)=>{
                let tempState = [...state.equipments];
                tempState[i].dg = e;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }} 
              options={[
                {value:'non-DG', label:'non-DG'},
                {value:'DG', label:'DG'},
              ]}
            />
          </td>
          <td>
            {(state.selectedRecord.operation=="SE"||state.selectedRecord.operation=="AE")? 
              <Input placeholder="" style={{width:width}} value={x.gross} />:
              <Input placeholder="" style={{width:width}} disabled />
            }
          </td>
          <td><Input placeholder="" style={{width:width}} value={x.teu} /></td> */}
          <td className='p-0 pt-2'>
            <CloseCircleOutlined className='mx-3 cross-icon' onClick={()=>{
              PopConfirm(
                "Confirmation",
                "Are You Sure To Remove This Container",
                ()=>{
                  let tempState = [...state.equipments];
                  tempState.splice(i, 1);
                  dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                })
              }}
            />
          </td>
        </tr>
      )})}
      </tbody>
    </Table>
  </div>
  </div>
  )
}

export default React.memo(EquipmentInfo)