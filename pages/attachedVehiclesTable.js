import React, { Component } from 'react'
import {
    Table,
    Button,
    Row,
    Col,
    Navbar,
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import logo from '../public/logo.png'
import transfer from '../public/transfer.png'
import Image from 'next/image'
import NoData from '../components/NoData';
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import styles from '../styles/AddData.module.css';
import Link from 'next/link';

export default class attachedVehiclesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vehicleData: [],
            vehicleOwner: "",
            vehicleNo: "",
            weight: "",
        }
    }

    componentDidMount() {
        const db = getDatabase();
        const Ref = ref(db, '/attachedVehicleData');
        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            console.log(data);

            this.setState({
                vehicleData: (data || [])
            })
        })
        console.log("Hello World", this.state.vehicleData);
    }

    addData = () => {
        const db = getDatabase();
        const Ref = ref(db, '/attachedVehicleData');
        let obj = {
            id: (this.state.vehicleData.length || 0) + 1,
            vehicleOwner: this.state.vehicleOwner,
            vehicleNo: this.state.vehicleNo,
            weight: parseInt(this.state.weight || 0),
        }
        let x = [...this.state.vehicleData, obj];
        set(Ref, x);
        this.setState({
            vehicleData: x,
        })
        console.log(x);
        // console.log(this.state.vehicleData, this.state.vehicleOwner, this.state.vehicleNo, this.state.weight);
    }

    handleDelete = (id) => {
        const db = getDatabase();
        const Ref = ref(db, '/attachedVehicleData');
        let x = this.state.vehicleData.filter((item) => item.id !== id);
        set(Ref, x);
        this.setState({
            vehicleData: x,
        })
    }

    render() {
        return (
            <>
                <Navbar
                    // className="my-2"
                    color="light"
                    dark
                >
                    <Link href="/Options">
                        <Button outline>
                            Back
                        </Button>
                    </Link>

                    <h4>
                        Attached Vehicles
                    </h4>

                    <div>

                    </div>
                </Navbar>

                {this.state.vehicleData && this.state.vehicleData.length > 0 &&
                    <div style={{
                        color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                        display: "block",
                        height: '50vh',
                        overflowY: "scroll",
                        overflowX: "hidden",
                        boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
                        marginTop: "50px"
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
                                        Vehicle Owner
                                    </th>
                                    <th >
                                        Vehicle No.
                                    </th>
                                    <th>
                                        Weight
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.vehicleData && this.state.vehicleData.map((item, i) => {
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
                                                {item.vehicleOwner}
                                            </td>
                                            <td>
                                                {item.vehicleNo}
                                            </td>
                                            <td>
                                                {item.weight}
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </Table>
                    </div>

                }
                {
                    this.state.vehicleData && this.state.vehicleData.length === 0 &&
                    <>
                        {/* Hello World */}
                        <NoData filter={"Vehicle Details"}></NoData>
                    </>
                }

                <div style={{ border: "1px solid black", padding: "0px 40px 40px 40px", margin: "50px" }}>

                    <Row>

                        {/* Vehicle Owner */}
                        <Col md={4}>
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

                        {/* VEHICLE NO. */}
                        <Col md={4}>
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    onChange={(e) => this.setState({ vehicleNo: (e.target.value || "").toUpperCase() })}
                                    value={this.state.vehicleNo}
                                    required
                                />
                                <span>Vehicle No.</span>
                                <i></i>
                            </div>
                        </Col>

                        {/* Weight */}
                        <Col md={4}>
                            <div className={styles.inputBox}>
                                <input
                                    type="number"
                                    onChange={(e) => this.setState({ weight: e.target.value.toUpperCase() })}
                                    value={this.state.weight}
                                    required
                                />
                                <span>Weight</span>
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
