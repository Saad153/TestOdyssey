import React, { useEffect, useReducer, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateOrEdit from './CreateOrEdit';
import axios from 'axios';
import Cookies from 'js-cookie';
import ExcelJS from "exceljs";


import { PlusCircleOutlined, MinusCircleOutlined, RightOutlined, EditOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { return { ...state, [action.fieldName]: action.payload } }
      case 'create': {
        return {
            ...state,
            create: true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            edit: true,
            visible: true,
        }
      }
      case 'modalOff': {
        return {
            ...state,
            visible: false,
            create: false,
            edit: false
        }
      }
      default: return state 
    }
}

const initialState = {
    records: [],
    load:true,
    visible:false,
    create:false,
    edit:false,
    
    // Createing Records
    selectedMainId:'',
    selectedParentId:'',
    title:'',
    isParent:false,
    subCategory:"General",
    parentRecords: [],
    
    // Editing Records
    selectedRecordId:'',
    selectedRecord:{}
};

const ChartOFAccount = ({accountsData}) => {

    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const { records, visible } = state;
    const [ accounts, setAccounts ] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { 
        getCOATree()
     }, []);

     const getCOATree = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/coa/getCOATree`, { headers: { companyId: Cookies.get("companyId") } });
          console.log("getCOATree response:", res.data);
      
          const data = res.data?.result;
          if (!Array.isArray(data)) {
            console.error("Expected an array in result but got:", data);
            setAccounts([]);
            return;
          }
      
          setAccounts(data);
        } catch (err) {
          console.error("getCOATree error:", err);
        }
      };

    const ImageToBlob = (imageUrl) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // Enable CORS if required
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(resolve);
          };
          img.onerror = reject;
          img.src = imageUrl;
        });
      };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Invoice Report');
      
        // Column definitions
        worksheet.columns = [
          { header: 'Code', key: 'code', width: 15 },
          { header: 'Account Title', key: 'title', width: 35  },
          { header: 'Type', key: 'type', width: 15  },
          { header: 'Category', key: 'cat', width: 15  },
          { header: 'Sub Category', key: 'subCat', width: 15  },
        ];
    
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' } 
          };
          cell.border = {
            right: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            top: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
          }
          cell.font = {
            bold: true,
          };
        
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        });

        let data1 = []

        records.forEach((x, i)=>{
            data1.push({
                index: i + 1,
                code: x.code,
                title: x.title,
                type: "Group"
            })
            x.Parent_Accounts.forEach((y, index)=>{
                data1.push({
                    index: i + 1,
                    code: y.code,
                    title: y.title,
                    type: "Parent",
                    cat: x.title
                })
                y.Child_Accounts.forEach((z, indexTwo)=>{
                    data1.push({
                        index: i + 1,
                        code: z.code,
                        title: z.title,
                        type: "Child",
                        cat: x.title,
                        subCat: z.subCategory
                    })
                })
            })
        })
        
        console.log(data1)
          worksheet.addRows(data1);
          worksheet.insertRow(1, ['']);
          worksheet.insertRow(1, ['']);
        //   worksheet.insertRow(1, ['', '', '', 'Date: From: ' + query.from + ' To: ' + query.to,]);
          worksheet.insertRow(1, ['', '', 'House# D-213, DMCHS, Siraj Ud Daula Road, Karachi']);
          Cookies.get('companyId')=='1' && worksheet.insertRow(1, ['', '', 'Seanet Shipping & Logistics']);
          Cookies.get('companyId')=='2' && worksheet.insertRow(1, ['', '', 'Air Cargo Services']);
        //   Cookies.get('companyId')!='1' && query.company!='2' && worksheet.insertRow(1, ['', '', '', 'Seanet Shipping & Logistics & Air Cargo Services']);
          worksheet.insertRow(1, ['']);
          worksheet.insertRow(1, ['']);
    
        worksheet.getCell('C3').font = {
          size: 16,  // Increase font size
          bold: true  // Make the text bold
        };
        worksheet.getCell('C4').font = {
          size: 16,  // Increase font size
          bold: true  // Make the text bold
        };
    
        const imageUrl = Cookies.get('companyId')=='1' ? '/seanet-colored.png' : Cookies.get('companyId')=='2' ? '/acs-colored.png' : '/sns-acs.png';
    
        // const imageUrl = '/public/seanet-logo-complete.png'
        const imageBlob = await ImageToBlob(imageUrl);
    
        const imageId = workbook.addImage({
          buffer: await imageBlob.arrayBuffer(), // Convert Blob to ArrayBuffer
          extension: 'png', // Image extension
        });
    
        worksheet.addImage(imageId, {
          tl: { col: 1, row: 1 }, // Top-left position (column, row)
          ext: { width: 150, height: 100 }, // Image width and height
        });
    
        try{
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'ChartOfAccounts.xlsx';
          link.click();
          window.URL.revokeObjectURL(url);
        }catch(e){
          console.log(e)
          console.error(e)
        }
      
        
      };      

      const toggleAccount = (accountId) => {
        const updatedRecords = [...accounts];
      
        const toggleCheck = (accounts) => {
          for (const account of accounts) {
            if (account.id === accountId) {
              account.check = !account.check;
            }
            if (account.children && account.children.length > 0) {
              toggleCheck(account.children); // Recurse through children only
            }
          }
        };
      
        toggleCheck(updatedRecords);
        setAccounts(updatedRecords);
      };
      const renderAccountHierarchy = (accounts, level = 0) => {
        const sortedAccounts = [...accounts].sort((a, b) => parseInt(a.code) - parseInt(b.code));
      
        return sortedAccounts
          .filter(account => {
            // This function checks recursively if the account or any of its children match
            const matches = (acc) => {
              const titleMatch = acc.title?.toLowerCase().includes(searchTerm);
              const codeMatch = acc.code?.toLowerCase().includes(searchTerm);
              const childMatch = acc.children?.some(matches);
              return titleMatch || codeMatch || childMatch;
            };
            return matches(account);
          })
          .map(account => (
            <div key={account.id} style={{ marginLeft: `${level * 20}px` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="child icon" onClick={() => toggleAccount(account.id)}>
                  {account.children && account.children.length > 0
                    ? account.check
                      ? <MinusCircleOutlined />
                      : <PlusCircleOutlined />
                    : <RightOutlined />}
                </div>
                <div className="child title">{account.code} {account.title}</div>
              </div>
      
              {(account.check || searchTerm) && account.children && account.children.length > 0 && (
                renderAccountHierarchy(account.children, level + 1)
              )}
            </div>
          ));
      };
      
      
    
return (
    <div className='dashboard-styles'>
    <div className='base-page-layout'>
    <div className='account-styles'>
        <Row>
            <Col><h5>Accounts</h5></Col>
            <Col>
            <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px'
            }}
            />
            </Col>
            <Col>   
                <button className='btn-custom right' onClick={()=>{ dispatch({ type: 'create'}) }}>
                    Create
                </button>
                <button className="btn-custom-green px-3 py-1 mx-2 float-end" onClick={exportToExcel}>
                    Export to Excel
                </button>
            </Col>
        </Row>
        <hr className='my-2' />
        <Row style={{maxHeight:'69vh',overflowY:'auto', overflowX:'hidden'}}>
        {renderAccountHierarchy(accounts)}
        
        </Row>
        <Modal open={visible} 
            title="Create Account"
            onOk={() => dispatch({ type: 'modalOff' })} 
            onCancel={() => dispatch({ type: 'modalOff' })}
            width={600}
            footer={false}
            centered={false}
        >
            <CreateOrEdit state={state} dispatch={dispatch} accounts={accounts} visible={visible} getCOATree={getCOATree} />
        </Modal>
    </div>
    </div>
    </div>
  )
}
export default React.memo(ChartOFAccount)