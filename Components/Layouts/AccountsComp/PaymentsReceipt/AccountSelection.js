import React from 'react';
import { Table } from 'react-bootstrap';
import { Modal, Input } from 'antd';
import { getCompanyName } from './states';
import Spinner from 'react-bootstrap/Spinner';

const AccountSelection = ({state, dispatch, companyId}) => {

  const set = (payload) => { dispatch({type:'setAll', payload}) }
  // const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
    <Modal 
      open={state.visible} 
      onOk={()=>dispatch({type:'on'})} 
      onCancel={()=> set({visible:false}) }
      footer={false} maskClosable={false}
      width={'60%'}
    >
    <>{!state.accountsLoader &&
    <div style={{minHeight:150}}>
      <span >Select Account</span>
      <Input style={{width:200, marginLeft:20}} placeholder='Search Account' value={state.searchTerm} onChange={(e)=>set({searchTerm:e.target.value})} />
      <hr/>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Title</th>
            <th>Parent A/c</th>
            <th>Chart of A/c</th>
          </tr>
        </thead>
        {state.accounts.length>0 &&
          <tbody>
            {state.accounts.filter((x)=>{
              if(x.title.toLowerCase().includes(state.searchTerm.toLowerCase()) || x.Parent_Account.title.toLowerCase().includes(state.searchTerm.toLowerCase())){
                return x 
              }
              if(state.searchTerm==""){ 
                return x 
              }
            }).map((x, index) => {
            return (
              <tr key={index} className="tr-clickable"
                onClick={() => {
                  set({
                    [`${state.variable}`]:x, 
                    visible:false,
                    searchTerm:''
                  });
                }}
              >
                <td>{index + 1}</td>
                <td>{x.title} ~ <span className='silver-txt'>{getCompanyName(x.Parent_Account.CompanyId)}</span></td>
                <td>{x.Parent_Account.title}</td>
                <td>{x.Parent_Account.Account?.title}</td> 
              </tr>
            )})}
          </tbody>
        }
        </Table>
      </div>
    </div>
    }
    {state.accountsLoader && <div className='text-center'><Spinner/></div>}
    </>
    </Modal>
    </>
  )
}

export default React.memo(AccountSelection)