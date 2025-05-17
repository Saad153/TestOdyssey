import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { DatePicker, Input, InputNumber, Select, TimePicker } from "antd";
import { getStatus } from './states';

const Weights = ({state, dispatch}) => {

    return(
        <div className='px-2 pb-2 mt-3' style={{border:'1px solid silver'}}>
            <Row className='mt-2'>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{ marginLeft: '7.5px'}}
                    >Weight</label>
                    </Row>
                    <Input></Input>
                </Col>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{marginLeft: '7.5px'}}
                    >BKG Weight</label>
                    </Row>
                    <Input></Input>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{ marginLeft: '7.5px'}}
                    >Container</label>
                    </Row>
                    <Input></Input>
                </Col>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{marginLeft: '7.5px'}}
                    >Ship Vol.</label>
                    </Row>
                    <Input></Input>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{ marginLeft: '7.5px'}}
                    >TEU</label>
                    </Row>
                    <Input></Input>
                </Col>
                <Col md={6}>
                    <Row>
                        <label 
                    style={{marginLeft: '7.5px'}}
                    >Vol.</label>
                    </Row>
                    <Input></Input>
                </Col>
            </Row>
            <Row className='mt-2'>
            <Col md={4}>
            <Row>
                <label 
                style={{marginLeft: '7.5px'}}
                >PCS</label>
            </Row>
            <Input></Input>
            </Col>
            <Col md={8}>
            <Row>
                <label 
                style={{marginLeft: '12.5px'}}
                >CBM</label>
            </Row>
            <Select style={{margin: '1% 5%', width: '95%'}}></Select>
            </Col>
            </Row>
        </div>
    )
}
export default React.memo(Weights)