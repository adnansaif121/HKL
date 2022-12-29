import React, { Component } from 'react'
import {
    Table,
    Button,
    Input,
    Row,
    Col
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import transfer from '../public/transfer.png'
import Image from 'next/image'

import correct from '../public/correct.png'
import NoData from './NoData';
// Firebase
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";


export default class OwnerLedger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount : 0,
        }
    }

    
    render() {
        return (
            <>
                {this.props.displayData && this.props.displayData.length > 0 &&
                    <div style={{
                        color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                        display: "block",
                        height: '80vh',
                        overflowY: "scroll",
                        overflowX: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"
                    }}>
                        <Table striped bordered >

                            <thead>
                                <tr style={{ position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "black" }}>
                                    <th >
                                        <div style={{ marginRight: "90px" }}>
                                            #
                                        </div>
                                    </th>
                                    <th >
                                        Date
                                    </th>
                                    <th >
                                        Owner Name
                                    </th>
                                    <th>
                                        Vehicle No
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Paid/Unpaid
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.props.displayData && this.props.displayData.map((item, i) => {
                                    return (

                                        <tr key={i} >

                                            <th scope="row">
                                                {i + 1}
                                            </th>

                                            <td >
                                                {item.InvoiceDate}
                                            </td>
                                            <td>
                                                {item.VehicleOwnerName}
                                            </td>
                                            <td>
                                                {item.VehicleNo}
                                            </td>
                                            <td>
                                                {
                                                    (item.VehicleRent === undefined || item.VehicleRent === 0) ?
                                                        <Row>
                                                            <Col><Input type="number" placeholder='Amount' onChange={(e) => this.setState({amount : e.target.value})} /></Col>
                                                            <Col><Button outline onClick={() => this.props.handleConfirm(item, this.state.amount)}>Confirm</Button></Col>
                                                        </Row>
                                                        :
                                                        item.VehicleRent

                                                }

                                            </td>
                                            <td>
                                                {
                                                    (item.isVehicleRentPaid === undefined || item.isVehicleRentPaid === false) ?
                                                        <Row>
                                                        
                                                            <Col><Button color='success' outline onClick={() => this.props.handlePaid(item, true)}>Paid</Button></Col>
                                                        </Row>
                                                        :
                                                        <Row>
                                                            <Col>
                                                                <Image
                                                                        style={{ width: "20px", height: "20px" }}
                                                                        src={correct}
                                                                        alt="Picture of the author"
                                                                        width="10px"
                                                                        height="10px"
                                                                    />
                                                            </Col>
                                                            {/* <Col><Button color='danger' outline onClick={() => this.handlePaid(item, false)}>UnPaid</Button></Col> */}
                                                        </Row>

                                                }
                                            </td>


                                        </tr>


                                    )
                                })}

                            </tbody>
                        </Table>
                    </div>

                }
                {
                    this.props.displayData && this.props.displayData.length === 0 &&
                    <NoData filter={this.props.filter}></NoData>
                }

            </>
        )
    }
}
