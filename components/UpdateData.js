import React, { Component } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'
import styles from '../styles/AddData.module.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
// Firebase
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";


export default class UpdateData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InvoiceDate: this.props.data.InvoiceDate || "",
            VehicleNo: this.props.data.VehicleNo || "",
            is_VehicleNo_new: false,
            PartyName: this.props.data.PartyName || "",
            MT_Location: this.props.data.MT_Location || "",
            is_MT_Location_New: false,
            MT_FN: this.props.data.MT_FN || "",
            FromLocation: this.props.data.FromLocation || "",
            is_From_Location_New: false,
            FromFN: this.props.data.FromFN || "",
            ToLocation: this.props.data.ToLocation || "",
            is_To_Location_New: false,
            ToFN: this.props.data.ToFN || "",
            Rate: this.props.data.Rate || "",
            Weight: this.props.data.Weight || "",
            Product: this.props.data.Product || "",
            PaymentStatus: this.props.data.PaymentStatus || "",
            PaymentMode: this.props.data.PaymentMode || "",
            ContactNumber: this.props.data.ContactNumber || "",
            Remark: this.props.data.Remark || "",
            PaidOn: this.props.data.PaidOn || "",
            Agent: this.props.data.Agent || "",
            is_Agent_New: false,
            Comission: this.props.data.Comission || "",
            AgentPaymentStatus: this.props.data.AgentPaymentStatus || "",
            LabourAmount: this.props.data.LabourAmount || "",
            LabourStatus: this.props.data.LabourStatus || "",
            Shortage: this.props.data.Shortage || "",
            PochAmount: this.props.data.PochAmount || "",
            PochPaymentStatus: this.props.data.PochPaymentStatus || "",
            PochSendDate: this.props.data.PochSendDate || "",
            NetAmount: this.props.data.NetAmount || "",
            
            Location: [],
            AgentList: [],
            Vehicles: [],

        }
    }

    componentDidMount() {

        //firebase fetch 
        console.log("UPDATE DATA ID", this.props.data.id);
        const db = getDatabase();
        onValue(ref(db, "/Location/"), (snapshot) => {
            const data = snapshot.val();
            this.setState({
                Location: (data || []),
            })
        });

        onValue(ref(db, "/AgentList/"), (snapshot) => {
            const data = snapshot.val();
            this.setState({
                AgentList: (data || []),
            })
        });

        onValue(ref(db, "/Vehicles/"), (snapshot) => {
            const data = snapshot.val();
            this.setState({
                Vehicles: (data || []),
            })
        });
    }

    checkAndAddLocation = () => {
        const db = getDatabase();
        let isLocationNew = false;
        let location_List = this.state.Location;
        if(this.state.is_MT_Location_New){
            location_List.push({id: location_List.length, name: this.state.MT_Location});  
            isLocationNew = true;
        }
        if(this.state.is_From_Location_New){
            location_List.push({id: location_List.length, name: this.state.FromLocation});
            isLocationNew = true;
        }
        if(this.state.is_To_Location_New){
            location_List.push({id: location_List.length, name: this.state.ToLocation});
            isLocationNew = true;
        }
        this.setState({
            Location: location_List,
        })
        // Update Database
        if(isLocationNew){
            console.log("NEW LOCATION ADDED", location_List);
            set(ref(db, "/Location/"), location_List);
        }
        else{
            console.log("NO NEW LOCATION ADDED");
        }
    }

    checkAndAddAgent = () => {
        const db = getDatabase();
        let isAgentNew = false;
        let agent_List = this.state.AgentList;
        if(this.state.is_Agent_New){
            agent_List.push({id: this.state.AgentList.length, agentName: this.state.Agent});
            this.setState({
                AgentList: agent_List,
                is_Agent_New: false,
            })
            isAgentNew = true;
            console.log(agent_List);
        }
        // Update Database
        if(isAgentNew){
            console.log("NEW AGENT ADDED", agent_List);
            set(ref(db, "/AgentList/"), agent_List);
        }
        else{
            console.log("NO NEW AGENT ADDED");
        }
    }

    checkAndAddVehicle = () => {
        const db = getDatabase();
        let isVehicleNew = false;
        let vehicle_List = this.state.Vehicles;
        if(this.state.is_VehicleNo_new){
            vehicle_List.push({id: this.state.Vehicles.length, name: this.state.VehicleNo});
            this.setState({
                Vehicles: vehicle_List,
                is_VehicleNo_new: false,
            })
            isVehicleNew = true;
            console.log(vehicle_List);
        }
        // Update Database
        if(isVehicleNew){
            console.log("NEW VEHICLE ADDED", vehicle_List);
            set(ref(db, "/Vehicles/"), vehicle_List);
        }
        else{
            console.log("NO NEW VEHICLE ADDED");
        }
    }

    addData = () => {

        this.checkAndAddLocation();
        this.checkAndAddAgent();
        this.checkAndAddVehicle();
        
        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: (this.state.VehicleNo || ""),
            PartyName: (this.state.PartyName || ""),
            MT_Location: (this.state.MT_Location || ""),
            MT_FN: (this.state.MT_FN || ""),
            FromLocation: (this.state.FromLocation || ""),
            FromFN: (this.state.FromFN || ""),
            ToLocation: (this.state.ToLocation || ""),
            ToFN: (this.state.ToFN || ""),
            Rate: this.state.Rate,
            Weight: this.state.Weight,
            Product: (this.state.Product || ""),
            PaymentStatus: this.state.PaymentStatus,
            PaymentMode: this.state.PaymentMode,
            ContactNumber: (this.state.ContactNumber || ""),
            Remark: (this.state.Remark || ""),
            PaidOn: this.state.PaidOn,
            Agent: (this.state.Agent || ""),
            Comission: this.state.Comission,
            AgentPaymentStatus: (this.state.AgentPaymentStatus),
            LabourAmount: this.state.LabourAmount,
            LabourStatus: this.state.LabourStatus,
            Shortage: this.state.Shortage,
            PochAmount: this.state.PochAmount,
            PochPaymentStatus: this.state.PochPaymentStatus,
            PochSendDate: this.state.PochSendDate,
            NetAmount: (this.state.LabourStatus === "ByDriver") 
                            ? this.state.Rate * this.state.Weight - this.state.Comission - this.state.Shortage 
                            : this.state.Rate * this.state.Weight - this.state.Comission - this.state.Shortage - this.state.LabourAmount,
        }
        // console.log(obj)
        console.log("UPDATE DATA", obj, this.props.data.id);
        this.props.updateData(obj, this.props.data.id);
    }

    handleOnSearch = (string, results) => {
        // console.log(string, results);
        this.setState({
            MT_Location: string,
        })
    };

    handleOnSelect = (item) => {
        console.log(item.id);
        let ownedItem = item;
        console.log(ownedItem);
    };

    render() {
        return (
            <>
                <div className={styles.LoginBox}>
                    <div className={styles.box}>
                        <div className={styles.form}>
                            {/* <h2>Add Data</h2> */}
                            <Row>
                                {/* INVOICE DATE */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ InvoiceDate: e.target.value })}
                                            value={this.state.InvoiceDate}
                                        // required
                                        />
                                        <span>Invoice Date</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* VEHICLE NO. */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>VehicleNo</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.Vehicles}
                                            fuseOptions={{keys: ["id", "name"] }} 
                                            // Search on both fields
                                            resultStringKeyName="name" // String to display in the results
                                            onSearch={(string, results) => {
                                                this.setState({
                                                    VehicleNo: string.toUpperCase(),
                                                    is_VehicleNo_new: true,
                                                })
                                            }}
                                            onSelect={(item) => 
                                                this.setState({
                                                    VehicleNo : item.name,
                                                    is_VehicleNo_New: false,
                                                })
                                            }
                                            placeholder={this.state.VehicleNo}
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
                                                zIndex: 60,
                                            }}
                                        />
                                    </div>
                                </Col>


                                {/* PARTY NAME */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ PartyName: (e.target.value || "").toUpperCase() })}
                                            value={this.state.PartyName}
                                            required
                                        />
                                        <span>Party Name</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                {/* MT Location */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>MT (Location)</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.Location}
                                            fuseOptions={{keys: ["id", "name"] }} 
                                            // Search on both fields
                                            resultStringKeyName="name" // String to display in the results
                                            onSearch={(string, results) => {
                                                this.setState({
                                                    MT_Location: string.toUpperCase(),
                                                    is_MT_Location_New: true,
                                                })
                                            }}
                                            onSelect={(item) => 
                                                this.setState({
                                                    MT_Location : item.name,
                                                    is_MT_Location_New: false,
                                                })
                                            }
                                            showIcon={false}
                                            placeholder={this.state.MT_Location}
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
                                                zIndex: 50,
                                            }}
                                        />
                                    </div>
                                </Col>

                                {/* MT Factory Name */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ MT_FN: (e.target.value || "").toUpperCase() })}
                                            value={this.state.MT_FN}
                                            required
                                        />
                                        <span>MT Factory Name</span>
                                        <i></i>
                                    </div>
                                </Col>

                            </Row>

                            <Row>
                                {/* From Location */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>From (Location)</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.Location}
                                            fuseOptions={{ keys: ["id", "name"] }} // Search on both fields
                                            resultStringKeyName="name" // String to display in the results
                                            onSearch={(string, results) => {
                                                this.setState({
                                                    FromLocation: string.toUpperCase(),
                                                    is_From_Location_New: true,
                                                })
                                                }
                                            }
                                            onSelect={(item) =>
                                                this.setState({
                                                    FromLocation: item.name,
                                                    is_From_Location_New: false,
                                                })
                                            }
                                            showIcon={false}
                                            placeholder={this.state.FromLocation}
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

                                {/* From Factory Name */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ FromFN: (e.target.value || "").toUpperCase() })}
                                            value={this.state.FromFN}
                                            required
                                        />
                                        <span>From Factory Name</span>
                                        <i></i>
                                    </div>
                                </Col>

                            </Row>

                            <Row>
                                {/* To Location */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>To (Location)</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.Location}
                                            fuseOptions={{ keys: ["id", "name"] }} // Search on both fields
                                            resultStringKeyName="name" // String to display in the results
                                            onSearch={
                                                (string, results) => {
                                                    this.setState({
                                                        ToLocation: string.toUpperCase(),
                                                        is_To_Location_New: true,
                                                    })
                                                }
                                            }
                                            onSelect={
                                                (item) => {
                                                    this.setState({
                                                        ToLocation: item.name,
                                                        is_To_Location_New: false,
                                                    })
                                                }
                                            }
                                            showIcon={false}
                                            placeholder={this.state.ToLocation}
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
                                                zIndex: 20,
                                            }}
                                        />
                                    </div>
                                </Col>

                                {/* To Factory Name */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ ToFN: (e.target.value || "").toUpperCase() })}
                                            value={this.state.ToFN}
                                            required
                                        />
                                        <span>To Factory Name</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/* RATE */}
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Rate: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.Rate}
                                            required
                                        />
                                        <span>Rate</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* WEIGHT */}
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Weight: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.Weight}
                                            required
                                        />
                                        <span>Weight (MT)</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Product */}
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ Product: e.target.value })}
                                            value={this.state.Product}
                                            required
                                        />
                                        <span>Product</span>
                                        <i></i>
                                    </div>

                                </Col>


                            </Row>

                            <Row>
                                {/* Payment Status */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        {/* <span>Payment Status</span> */}
                                        Payment Status
                                        <select
                                            onChange={(e) => this.setState({ PaymentStatus: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                            value={this.state.PaymentStatus}
                                        >
                                            <option value="PAID">PAID</option>
                                            <option value="UNPAID">UNPAID</option>
                                        </select>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Payment Mode */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        {/* <span>Payment Status</span> */}
                                        Payment Mode
                                        <select
                                            onChange={(e) => this.setState({ PaymentMode: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                            value={this.state.PaymentMode}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Online">Online</option>
                                            <option value="Cheque">Cheque</option>
                                        </select>
                                        <i></i>
                                    </div>

                                </Col>


                                {/* REMARK */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ Remark: (e.target.value || "").toUpperCase() })}
                                            value={this.state.Remark}
                                            required
                                        />
                                        <span>Remark</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Paid On */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ PaidOn: e.target.value })}
                                        // required
                                        />
                                        <span>Paid On</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            
                            {this.state.PaymentMode === "Online" ? 
                            <Row>
                                {/* Contact Number */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ ContactNumber: (e.target.value || "").toUpperCase() })}
                                            value={this.state.ContactNumber}
                                            required
                                        />
                                        <span>Contact Number</span>
                                        <i></i>
                                    </div>

                                </Col>
                                </Row>
                            :
                            null
                            }

                            <Row>
                                {/* Agent */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        <div style={{ marginBottom: 0 }}>Agent</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.AgentList}
                                            fuseOptions={{ keys: ["id", "agentName"] }} // Search on both fields
                                            resultStringKeyName="agentName" // String to display in the results
                                            onSearch={(string, results) => {
                                                this.setState({
                                                    Agent: string.toUpperCase(),
                                                    is_Agent_New: true,
                                                })
                                            }}
                                            onSelect={(item) => {
                                                this.setState({
                                                    Agent: item.agentName,
                                                    is_Agent_New: false,
                                                })
                                            }
                                            }
                                            showIcon={false}
                                            placeholder={this.state.Agent}
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
                                                zIndex: 20,
                                            }}
                                        />
                                        {/* <div style={{ marginTop: 20 }}>This text will be covered!</div> */}
                                    </div>
                                </Col>

                                {/* Commission */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            // type="number"
                                            onChange={(e) => this.setState({ Comission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.Comission}
                                            required
                                        />
                                        <span>Commission</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Agent Payment Status */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        Agent Payment Status
                                        <select
                                            onChange={(e) => this.setState({ AgentPaymentStatus: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                            value={this.state.AgentPaymentStatus}
                                        >
                                            <option value="PAID">PAID</option>
                                            <option value="UNPAID">UNPAID</option>
                                        </select>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/* Labour Amount */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            // type="number"
                                            onChange={(e) => this.setState({ LabourAmount: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.LabourAmount}
                                            required
                                        />
                                        <span>Labour Amount</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Labour Status */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        Labour Status
                                        <select
                                            onChange={(e) => this.setState({ LabourStatus: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                            value={this.state.LabourStatus}
                                        >
                                            <option value="ByDriver">Paid By Driver</option>
                                            <option value="InFreight">Less In Freight</option>
                                        </select>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Shortage */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            // type="number"
                                            onChange={(e) => this.setState({ Shortage: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.Shortage}
                                            required
                                        />
                                        <span>Shortage</span>
                                        <i></i>
                                    </div>
                                </Col>
                                
                            </Row>
                            <Row>
                                {/* Poch Amount */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            // type="number"
                                            onChange={(e) => this.setState({ PochAmount: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.PochAmount}
                                            required
                                        />
                                        <span>Poch Amount</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Poch Payment Status */}
                                <Col>
                                <   div className={styles.inputBox}>
                                        Poch Payment Status
                                        <select
                                            onChange={(e) => this.setState({ PochPaymentStatus: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                            value={this.state.PochPaymentStatus}
                                        >
                                            <option value="PAID">PAID</option>
                                            <option value="UNPAID">UNPAID</option>
                                        </select>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Poch Send Date */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ PochSendDate: e.target.value })}
                                            value={this.state.PochSendDate}
                                        // required
                                        />
                                        <span>Poch Send Date</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>

                                {/* Net Amount */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Amount</span>
                                        <input
                                            type="number"
                                            value={(this.state.LabourStatus === "ByDriver") 
                                            ? this.state.Rate * this.state.Weight - this.state.Comission - this.state.Shortage 
                                            : this.state.Rate * this.state.Weight - this.state.Comission - this.state.Shortage - this.state.LabourAmount}
                                            disabled
                                        />
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>

                            <button onClick={this.addData} className={styles.button}><span>Update</span></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
