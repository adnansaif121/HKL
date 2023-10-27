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


export default class AddData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InvoiceDate: "",
            VehicleNo: "",
            is_VehicleNo_new: false,
            PartyName: "",
            MT_Location: "",
            LRNumber: "",
            is_MT_Location_New: false,
            FromLocation: "",
            is_From_Location_New: false,
            FromFN: "",
            ToLocation: "",
            is_To_Location_New: false,
            ToFN: "",
            Rate: 0,
            Weight: 0,
            Product: "",
            TotalAdvance: 0,
            Cash: 0,
            CashRemark: "",
            Cheque: 0,
            ChequeRemark: "",
            Online: 0,
            OnlineRemark: "",
            AdvanceReceivedStatus: "Complete",
            Remaining: 0,
            PaymentStatus: "PAID",
            PaymentMode: "Cash",
            ContactNumber: "",
            Remark: "",
            PaidOn: "",
            Agent: "",
            AgentPaymentStatus: "PAID",
            is_Agent_New: false,
            Comission: 0,
            ComissionPaidDate: "",
            LabourAmount: 0,
            LabourStatus: "ByDriver",
            Shortage: 0,
            PochAmount: 0,
            PochPaymentStatus: "NOT RECEIVED",
            PochRemark: "",
            PochSendDate: "",
            NetAmountReceived: 0,

            Location: [],
            AgentList: [],
            Vehicles: [],

        }
    }

    componentDidMount() {

        //firebase fetch 
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
        if (this.state.is_MT_Location_New) {
            location_List.push({ id: location_List.length, name: this.state.MT_Location });
            isLocationNew = true;
        }
        if (this.state.is_From_Location_New) {
            location_List.push({ id: location_List.length, name: this.state.FromLocation });
            isLocationNew = true;
        }
        if (this.state.is_To_Location_New) {
            location_List.push({ id: location_List.length, name: this.state.ToLocation });
            isLocationNew = true;
        }
        this.setState({
            Location: location_List,
        })
        // Update Database
        if (isLocationNew) {
            console.log("NEW LOCATION ADDED", location_List);
            set(ref(db, "/Location/"), location_List);
        }
        else {
            console.log("NO NEW LOCATION ADDED");
        }
    }

    checkAndAddAgent = () => {
        const db = getDatabase();
        let isAgentNew = false;
        let agent_List = this.state.AgentList;
        if (this.state.is_Agent_New) {
            agent_List.push({ id: this.state.AgentList.length, agentName: this.state.Agent });
            this.setState({
                AgentList: agent_List,
                is_Agent_New: false,
            })
            isAgentNew = true;
            console.log(agent_List);
        }
        // Update Database
        if (isAgentNew) {
            console.log("NEW AGENT ADDED", agent_List);
            set(ref(db, "/AgentList/"), agent_List);
        }
        else {
            console.log("NO NEW AGENT ADDED");
        }
    }

    checkAndAddVehicle = () => {
        const db = getDatabase();
        let isVehicleNew = false;
        let vehicle_List = this.state.Vehicles;
        if (this.state.is_VehicleNo_new) {
            vehicle_List.push({ id: this.state.Vehicles.length, name: this.state.VehicleNo });
            this.setState({
                Vehicles: vehicle_List,
                is_VehicleNo_new: false,
            })
            isVehicleNew = true;
            console.log(vehicle_List);
        }
        // Update Database
        if (isVehicleNew) {
            console.log("NEW VEHICLE ADDED", vehicle_List);
            set(ref(db, "/Vehicles/"), vehicle_List);
        }
        else {
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
            LRNumber: (this.state.LRNumber|| ""),
            FromLocation: (this.state.FromLocation || ""),
            FromFN: (this.state.FromFN || ""),
            ToLocation: (this.state.ToLocation || ""),
            ToFN: (this.state.ToFN || ""),
            Rate: this.state.Rate,
            Weight: this.state.Weight,
            Product: (this.state.Product || ""),
            TotalAdvance: this.state.Cash + this.state.Cheque + this.state.Online,
            Cash: this.state.Cash,
            CashRemark: (this.state.CashRemark || ""),
            Cheque: this.state.Cheque,
            ChequeRemark: (this.state.ChequeRemark || ""),
            Online: this.state.Online,
            OnlineRemark: (this.state.OnlineRemark || ""),
            AdvanceReceivedStatus: this.state.AdvanceReceivedStatus,
            Remaining: this.state.Remaining,
            PaymentStatus: this.state.PaymentStatus,
            PaymentMode: this.state.PaymentMode,
            ContactNumber: (this.state.ContactNumber || ""),
            Remark: (this.state.Remark || ""),
            PaidOn: this.state.PaidOn,
            Agent: (this.state.Agent || ""),
            Comission: this.state.Comission,
            ComissionPaidDate: this.state.ComissionPaidDate,
            AgentPaymentStatus: this.state.AgentPaymentStatus,
            LabourAmount: this.state.LabourAmount,
            LabourStatus: this.state.LabourStatus,
            Shortage: this.state.Shortage,

            PochPaymentStatus: this.state.PochPaymentStatus,
            PochSendDate: this.state.PochSendDate,
            PochAmount: (this.state.PochPaymentStatus === "RECEIVED")
                ? 0
                : (this.state.LabourStatus === "ByDriver")
                    ? this.state.Rate * this.state.Weight - this.state.Shortage - (this.state.Cash + this.state.Cheque + this.state.Online)
                    : this.state.Rate * this.state.Weight - this.state.Shortage - this.state.LabourAmount - (this.state.Cash + this.state.Cheque + this.state.Online),
            NetAmountReceived: (this.state.PochPaymentStatus === "RECEIVED")
                ? (this.state.LabourStatus === "ByDriver") ? this.state.Rate * this.state.Weight - this.state.Shortage : this.state.Rate * this.state.Weight - this.state.Shortage - this.state.LabourAmount
                : (this.state.Cash + this.state.Cheque + this.state.Online)
        }
        // console.log(obj)
        this.props.updateData(obj);
    }

   
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
                                            fuseOptions={{ keys: ["id", "name"] }}
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
                                                    VehicleNo: item.name,
                                                    is_VehicleNo_New: false,
                                                })
                                            }
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
                                            fuseOptions={{ keys: ["id", "name"] }}
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
                                                    MT_Location: item.name,
                                                    is_MT_Location_New: false,
                                                })
                                            }
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
                                                zIndex: 50,
                                            }}
                                        />
                                    </div>
                                </Col>

                                {/* LR Number */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ LRNumber: (e.target.value || "").toUpperCase() })}
                                            value={this.state.LRNumber}
                                            required
                                        />
                                        <span>LR Number</span>
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
                                            required
                                        />
                                        <span>Weight (cwt)</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Product */}
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ Product: e.target.value })}
                                            required
                                        />
                                        <span>Product</span>
                                        <i></i>
                                    </div>

                                </Col>


                            </Row>


                            <Row>
                                <Col>
                                    <div style={{ padding: "40px", margin: "40px", border: "2px solid black" }}>
                                        <h4>Advance Paid Details</h4>
                                        <Row>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        // type="number"
                                                        onChange={(e) => this.setState({ Cash: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                                        value={this.state.Cash}
                                                        required
                                                    />
                                                    <span>Cash</span>
                                                    <i></i>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => this.setState({ CashRemark: (e.target.value || "").toUpperCase() })}
                                                        value={this.state.CashRemark}
                                                        required
                                                    />
                                                    <span>Cash Remark</span>
                                                    <i></i>

                                                </div>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => this.setState({ Cheque: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                                        value={this.state.Cheque}
                                                        required
                                                    />
                                                    <span>Cheque</span>
                                                    <i></i>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => this.setState({ ChequeRemark: (e.target.value || "").toUpperCase() })}
                                                        value={this.state.ChequeRemark}
                                                        required
                                                    />
                                                    <span>Cheque Remark</span>
                                                    <i></i>

                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => this.setState({ Online: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                                        value={this.state.Online}
                                                        required
                                                    />
                                                    <span>Online</span>
                                                    <i></i>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => this.setState({ OnlineRemark: (e.target.value || "").toUpperCase() })}
                                                        value={this.state.OnlineRemark}
                                                        required
                                                    />
                                                    <span>Online Remark</span>
                                                    <i></i>

                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>

                                            {/* Total Advance */}
                                            <Col>
                                                <div className={styles.disabledInput}>
                                                    <span>Total Advance : </span>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        value={this.state.Cash + this.state.Cheque + this.state.Online}
                                                        required
                                                    />

                                                    <i></i>
                                                </div>

                                            </Col>
                                        </Row>
                                        
                                        {/* Advance Received Status */}
                                        <Row>
                                            <Col>
                                                <div className={styles.inputBox}>
                                                    Advance Received Status
                                                    <select
                                                        onChange={(e) => this.setState({ AdvanceReceivedStatus: e.target.value })}
                                                        required
                                                        style={{ width: "100%", height: "34px" }}
                                                    >
                                                        <option value="Complete">Complete</option>
                                                        <option value="Partial">Partial</option>
                                                        <option value="None">None</option>
                                                    </select>
                                                    <i></i>
                                                </div>
                                            </Col>
                                        </Row>

                                        {
                                            this.state.AdvanceReceivedStatus === "Partial" &&
                                            <Row>
                                                <Col>
                                                    <div className={styles.inputBox}>
                                                        <input
                                                            type="text"
                                                            onChange={(e) => this.setState({ Remaining: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                                            value={this.state.Remaining}
                                                            required
                                                        />
                                                        <span>Remaining</span>
                                                        <i></i>

                                                    </div>
                                                </Col>
                                            </Row>
                                        }
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
                                        >
                                            <option value="PAID">PAID</option>
                                            <option value="TO_PAY">TO PAY</option>
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
                                        <span>Received On</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>

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
                                                zIndex: 15,
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

                                {/* Commission Paid Date */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ ComissionPaidDate: e.target.value })}
                                        // required
                                        />
                                        <span>Commission Paid Date</span>
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

                                {/* Poch Payment Status */}
                                <Col>
                                    <   div className={styles.inputBox}>
                                        Poch Payment Status
                                        <select
                                            onChange={(e) => this.setState({ PochPaymentStatus: e.target.value })}
                                            required
                                            style={{ width: "100%", height: "34px" }}
                                        >
                                            <option value="NOT RECEIVED">NOT RECEIVED</option>
                                            <option value="RECEIVED">RECEIVED</option>
                                        </select>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Poch Remark */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ PochRemark: (e.target.value || "").toUpperCase() })}
                                            value={this.state.PochRemark}
                                            required
                                        />
                                        <span>Poch Remark</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Poch Send Date */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ PochSendDate: e.target.value })}
                                        // required
                                        />
                                        <span>Poch Send Date</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>

                                {/* Poch Amount */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Poch Amount</span>
                                        <input
                                            type="number"
                                            value={
                                                (this.state.PochPaymentStatus === "RECEIVED")
                                                    ? 0
                                                    : (this.state.LabourStatus === "ByDriver")
                                                        ? this.state.Rate * this.state.Weight - this.state.Shortage - (this.state.Cash + this.state.Cheque + this.state.Online)
                                                        : this.state.Rate * this.state.Weight - this.state.Shortage - this.state.LabourAmount - (this.state.Cash + this.state.Cheque + this.state.Online)
                                            }
                                            disabled
                                        />
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Net Amount Received*/}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Amount Received</span>
                                        <input
                                            type="number"
                                            value={(this.state.PochPaymentStatus === "RECEIVED")
                                                ? (this.state.LabourStatus === "ByDriver") ? this.state.Rate * this.state.Weight - this.state.Shortage : this.state.Rate * this.state.Weight - this.state.Shortage - this.state.LabourAmount
                                                : (this.state.Cash + this.state.Cheque + this.state.Online)}
                                            disabled
                                        />
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>

                            <button onClick={this.addData} className={styles.button}><span>Add</span></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
