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
import styles from '../styles/AddData.module.css';

import correct from '../public/correct.png'
import NoData from './NoData';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
// Firebase
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";


export default class OwnerLedger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // amount: 0,
            VehicleNo: "",
            vehicleOwner: "",
            displayData: this.props.displayData,
        }
    }

    componentDidMount() {
        console.log("componentDidMount", this.props.displayData)
        // Auto select todays date in InvoiceDate
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        let todayDate = [year, month, day].join('-');
        console.log(todayDate)

        this.setState({ InvoiceDate: todayDate })
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

    handleOnSearchVehicleNo = (string) => {
        this.setState({
            VehicleNo: (string || "").toUpperCase()
        })
    }

    handleOnSelectVehicleNo = (item) => {
        this.setState({
            VehicleNo: item.vehicleNo,
            vehicleOwner: item.vehicleOwner,
        })
    }

    addData = () => {
        const db = getDatabase();
        let obj = {
            VehicleNo: this.state.VehicleNo,
            vehicleOwner: this.state.vehicleOwner,
            InvoiceDate: this.state.InvoiceDate,
            amount: this.state.amount,
            fromTrip: this.state.fromTrip,
            toTrip: this.state.toTrip,
        }
        let x = [...this.state.displayData, { ...obj }];
        const id = new Date().getTime();
        obj.id = id;
        set(ref(db, '/OwnerLedger/' + id), {
            ...obj
        }).then(() => {
            alert("Data Added Successfully")
            this.setState({
                VehicleNo: "",
                vehicleOwner: "",
                InvoiceDate: "",
                amount: "",
                fromTrip: "",
                toTrip: "",
                displayData: x
            })
        })


    }

    handleDelete = (id) => {
        let toDelete = confirm("Are you sure you want to delete this field?");
        if (toDelete) {
            const db = getDatabase();
            set(ref(db, '/OwnerLedger/' + id), {});
            let x = this.state.displayData.filter(item => item.id !== id);
            this.setState({
                displayData: x
            })
        }

    }

    render() {
        return (
            <>
                {this.state.displayData && this.state.displayData.length > 0 &&
                    <div style={{
                        color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                        display: "block",
                        height: '50vh',
                        overflowY: "scroll",
                        overflowX: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"
                    }}>
                        <Table striped bordered >

                            <thead>
                                <tr style={{ position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "black" }}>
                                    <th style={{marginRight: "60px"}}>
                                        #
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
                                        Amount Paid
                                    </th>
                                    <th>
                                        From Trip
                                    </th>
                                    <th>
                                        To Trip
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.displayData && this.state.displayData.map((item, i) => {
                                    return (

                                        <tr key={i} >

                                            <th scope="row">
                                                <details>
                                                    <summary>{i + 1}</summary>
                                                    <div style={{ display: "flex" }}>
                                                        <button onClick={() => this.handleDelete(item.id)} style={{ border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px" }}>
                                                            <Image
                                                                style={{ width: "25px", height: "25px" }}
                                                                src={deleteIcon}
                                                                alt="Picture of the author"
                                                            />
                                                        </button>

                                                    </div>
                                                </details>
                                            </th>
                                            <td >
                                                {/* {item.InvoiceDate} */}
                                                {this.formatDate(item.InvoiceDate)}
                                            </td>
                                            <td>
                                                {item.vehicleOwner}
                                            </td>
                                            <td>
                                                {item.VehicleNo}
                                            </td>
                                            <td>
                                                {/* {
                                                    (item.VehicleRent === undefined || item.VehicleRent === 0) ?
                                                        <Row>
                                                            <Col><Input type="number" placeholder='Amount' onChange={(e) => this.setState({ amount: e.target.value })} /></Col>
                                                            <Col><Button outline onClick={() => this.props.handleConfirm(item, this.state.amount)}>Confirm</Button></Col>
                                                        </Row>
                                                        :
                                                        item.VehicleRent

                                                } */}
                                                {item.amount}
                                            </td>
                                            <td>
                                                {item.fromTrip}
                                            </td>
                                            <td>
                                                {item.toTrip}
                                            </td>
                                            {/* <td>
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
                                                            <Col><Button color='danger' outline onClick={() => this.handlePaid(item, false)}>UnPaid</Button></Col>
                                                        </Row>

                                                }
                                            </td>  */}


                                        </tr>


                                    )
                                })}

                            </tbody>
                        </Table>
                    </div>

                }
                {
                    this.state.displayData && this.state.displayData.length === 0 &&
                    <NoData filter={this.props.filter}></NoData>
                }
                <div style={{ border: "1px solid black", padding: "0px 40px 40px 40px", margin: "50px" }}>

                    <Row>


                        {/* VEHICLE NO. */}
                        <Col>
                            <div style={{ width: "200", marginTop: "30px" }}>
                                <div style={{ marginBottom: 0 }}>Vehicle No</div>
                                <ReactSearchAutocomplete
                                    items={this.props.attachedVehicleData}
                                    fuseOptions={{ keys: ["vehicleNo", "id"] }} // Search on both fields
                                    resultStringKeyName="vehicleNo" // String to display in the results
                                    onSearch={this.handleOnSearchVehicleNo}
                                    onSelect={this.handleOnSelectVehicleNo}
                                    showIcon={false}
                                    styling={{
                                        height: "34px",
                                        borderRadius: "4px",
                                        backgroundColor: "#1f5457",
                                        boxShadow: "none",
                                        hoverBackgroundColor: "lightgreen",
                                        color: "white",
                                        fontSize: "1em",
                                        letterSpacing: "0.05px",
                                        iconColor: "white",
                                        lineColor: "white",
                                        placeholderColor: "white",
                                        clearIconMargin: "3px 8px 0 0",
                                        zIndex: 30,
                                    }}
                                />
                            </div>
                        </Col>

                        {/* Vehicle Owner */}
                        <Col >
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    onChange={(e) => this.setState({ vehicleOwner: (e.target.value || "").toUpperCase() })}
                                    value={this.state.vehicleOwner}
                                    required
                                />
                                <span>Vehicle Owner</span>
                                <i></i>
                            </div>
                        </Col>

                    </Row>

                    <Row>
                        {/* Date */}
                        <Col >
                            <div className={styles.inputBox}>
                                <input
                                    type="date"
                                    onChange={(e) => this.setState({ InvoiceDate: e.target.value })}
                                    value={this.state.InvoiceDate}
                                    required
                                />
                                <span>Date</span>
                                <i></i>
                            </div>
                        </Col>

                        {/* Amount */}
                        <Col >
                            <div className={styles.inputBox}>
                                <input
                                    type="number"
                                    onChange={(e) => this.setState({ amount: e.target.value })}
                                    value={this.state.amount}
                                    required
                                />
                                <span>Amount</span>
                                <i></i>
                            </div>
                        </Col>

                        {/* From Trip */}
                        <Col >
                            <div className={styles.inputBox}>
                                <input
                                    type="number"
                                    onChange={(e) => this.setState({ fromTrip: e.target.value })}
                                    value={this.state.fromTrip}
                                    required
                                />
                                <span>From Trip</span>
                                <i></i>
                            </div>
                        </Col>

                        {/* To Trip */}
                        <Col >
                            <div className={styles.inputBox}>
                                <input
                                    type="number"
                                    onChange={(e) => this.setState({ toTrip: e.target.value })}
                                    value={this.state.toTrip}
                                    required
                                />
                                <span>To Trip</span>
                                <i></i>
                            </div>
                        </Col>

                        <button onClick={this.addData} className={styles.button}><span>Add</span></button>
                    </Row>

                </div>
            </>
        )
    }
}
