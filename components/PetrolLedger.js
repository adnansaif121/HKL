import React, { Component } from 'react'
import {
    Table,
    Button,
    Row,
    Col,
} from 'reactstrap';
import correct from '../public/correct.png'
import Image from 'next/image'
import NoData from './NoData'; 

export default class MyLedger extends Component {
    constructor(props) {
        super(props)
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
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
                                <tr style={{position: "sticky", top: "0", backgroundColor: "#59C1BD",  color: "black"}}>
                                    <th >
                                        <div style={{ marginRight: "90px" }}>
                                            #
                                        </div>
                                    </th>
                                    <th >
                                        Invoice Date
                                    </th>
                                    <th>
                                        VehicleNo.
                                    </th>
                                    <th >
                                        Petrol Pump
                                    </th>
                                    <th>
                                        Rate
                                    </th>
                                    <th>
                                        Quantity
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
                                                    {/* {item.InvoiceDate} */}
                                                    {this.formatDate(item.InvoiceDate)}
                                                </td>
                                                <td>
                                                    {item.VehicleNo}
                                                </td>
                                                <td>
                                                    {item.PetrolPumpName}
                                                </td>
                                                <td>
                                                    {item.DieselRate}
                                                </td>
                                                <td>
                                                    {item.DieselQuantity}
                                                </td>
                                                <td>
                                                    {item.Diesel}
                                                </td>
                                                <td>
                                                {
                                                    (item.isDieselAmountPaid === undefined || item.isDieselAmountPaid === false) ?
                                                        <Row>
                                                        
                                                            <Col><Button color='success' outline onClick={() => this.props.handleDieselPaid(item, true)}>Paid</Button></Col>
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
