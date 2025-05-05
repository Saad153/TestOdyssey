import { Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { Form, Input, Checkbox, Switch, Select, notification, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import openNotification from '/Components/Shared/Notification';

const CreateOrEdit = ({state, dispatch, getAccounts, accounts, visible, getCOATree }) => {
    const companyId = useSelector((state) => state.company.value);

    const [ selectedParent, setSelectedParent ] = useState({})
    const [ selectedParentCode, setSelectedParentCode ] = useState()
    const [ selectedParentTitle, setSelectedParentTitle ] = useState(null)
    const [ accountTitle, setAccountTitle ] = useState("")
    const [ voucherTran, setVoucherTran ] = useState(false)
    const [ subCategory, setSubCategory ] = useState(undefined)

    useEffect(()=>{
        console.log("Account: ", selectedParentTitle)
    },[selectedParentTitle])

    useEffect(()=>{
        console.log("Account Title: ", accountTitle)
    },[accountTitle])

    useEffect(()=>{
        setSelectedParent({});
        setSelectedParentCode(undefined);
        setSelectedParentTitle('');
        setAccountTitle('');
        setSubCategory(undefined);
        setVoucherTran(false);
    },[visible])

      const findAccountByCode = (accounts, targetCode) => {
        for (const account of accounts) {
          if (account.code == targetCode) {
            return account;
          }
      
          if (account.children && account.children.length > 0) {
            const found = findAccountByCode(account.children, targetCode);
            if (found) return found;
          }
        }
      
        return null; // Not found
      };

      const findAccountBytitle = (accounts, title) => {
        for (const account of accounts) {
          if (account.title == title) {
            return account;
          }
      
          if (account.children && account.children.length > 0) {
            const found = findAccountByCode(account.children, title);
            if (found) return found;
          }
        }
      
        return null; // Not found
      };

      const handleSubmit = async () => {
        console.log(selectedParent)
        if(Object.keys(selectedParent).length !== 0){
            const result = await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/coa/createAccount`,
               {
                   parentId: selectedParent.id,
                   accountTitle: accountTitle,
                   subCategory: subCategory,
                   parentCode: selectedParentCode
               }
            ).then((res)=>{
                console.log(res.data)
                if(res.data.status == "success"){
                    openNotification('Success', `Account Created Successfully`, 'Green')
                    setSelectedParent({});
                    setSelectedParentCode(undefined);
                    setSelectedParentTitle('');
                    setAccountTitle('');
                    setSubCategory(undefined);
                    setVoucherTran(false);
                    getCOATree()
                    dispatch({ type: 'toggle', fieldName: 'visible', payload: false })
                }else if(res.data.status == 'duplicate'){
                    openNotification('Duplicate', `Account Already Exists`, 'Orange')
                }else{
                    openNotification('Error', `Some Error Occured, Try Again!`, 'Red')
                }
            })
        }else{
            openNotification('Error', `Parent Account Not Selected`, 'Red')
        }
      }

      const flattenAccounts = (accounts, level = 0) => {
        let options = [];
      
        accounts.sort((a, b) => parseInt(a.code) - parseInt(b.code));
      
        for (const acc of accounts) {
          options.push({
            label: `${'— '.repeat(level)}${acc.title} (${acc.code})`,
            value: acc.code,
          });
      
          // Only recurse if we haven't hit level 2 yet (i.e., allow levels 0 and 1 only)
          if (level < 2 && acc.children && acc.children.length > 0) {
            options = options.concat(flattenAccounts(acc.children, level + 1));
          }
        }
      
        return options;
      };

  return (
    <div className='employee-styles'>
        <Row>

            <Col md={4}>
                <label style={{paddingLeft: '5%'}}>Parent Code</label>
                <Input
                    style={{border: '1px solid #b3b3b3'}}
                    placeholder='Parent Code...'
                    required
                    type='number'
                    value={selectedParentCode}
                    onChange={(e) => {
                        setSelectedParent({})
                        console.log(findAccountByCode(accounts, e.target.value))
                        const temp = findAccountByCode(accounts, e.target.value)
                        setSelectedParent(temp||{})
                        setSelectedParentCode(temp?.code||e.target.value)
                        setSelectedParentTitle(flattenAccounts(accounts).filter((a)=> a.value == e.target.value))
                    }}
                ></Input>
            </Col>
            <Col md={1}></Col>
            <Col md={7}>
            <label style={{paddingLeft: '5%'}}>Parent Account Title</label>
                    <Select
                        className="custom-select-border"
                        required
                        style={{ width: '100%' }}
                        allowClear
                        showSearch
                        placeholder="Parent Account Title..."
                        value={selectedParentTitle || undefined}
                        onChange={(value) => {
                            setSelectedParent({})
                            setSelectedParentTitle(value)
                            const temp = findAccountByCode(accounts, value)
                            setSelectedParent(temp||{})
                            setSelectedParentCode(temp?.code||null)
                        }} // update as needed
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                        options={flattenAccounts(accounts)}
                    />
            </Col>
        </Row>
        <Row style={{marginTop: '2.5%'}}>
            <Col md={6}>
                <label style={{paddingLeft: '5%'}}>Account Title</label>
                <Input
                    style={{border: '1px solid #b3b3b3'}}
                    required
                    placeholder='Enter New Account Name...'
                    type='text'
                    value={accountTitle}
                    onChange={(e)=>{
                        setAccountTitle(e.target.value)
                    }}
                >
                </Input>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
            <label style={{paddingLeft: '5%'}}>Sub Category</label>
            <Select
                className="custom-select-border"
                disabled={!voucherTran}
                style={{ width: '100%' }}
                placeholder="Select Sub Category..."
                value={subCategory||undefined}
                onChange={(e) => {
                    console.log(e)
                    setSubCategory(e)
                }}
                options={[
                    {
                    label: 'Vendor',
                    value: 'Vendor', // Capitalized to match the label
                    },
                    {
                    label: 'COGS',
                    value: 'COGS',
                    },
                    {
                    label: 'Customer/Vendor',
                    value: 'Customer/Vendor',
                    },
                    {
                    label: 'Admin Expense',
                    value: 'Admin Expense',
                    },
                    {
                    label: 'General',
                    value: 'General',
                    },
                    {
                    label: 'Customer',
                    value: 'Customer',
                    },
                    {
                    label: 'Cash',
                    value: 'Cash',
                    },
                    {
                    label: 'Bank',
                    value: 'Bank',
                    },
                    // Add more sub-categories as needed
                ]}
            />
            </Col>
        </Row>
        <Row style={{marginTop: '2.5%'}}>
            <Col md={7}>
                <Checkbox value={voucherTran} className="custom-checkbox" style={{ textWrap: 'nowrap' }}
                onChange={(e)=>{
                    console.log(e.target.checked)
                    setVoucherTran(e.target.checked)
                }}
                >
                    Enable Voucher Transactions
                </Checkbox>
            </Col>
            <Col md={5}>
                <button
                onClick={()=>{handleSubmit()}}
                 className='btn-custom right'
                >Save</button>
            </Col>

        </Row>
    </div>
  )
}

export default React.memo(CreateOrEdit);