import React, { Component } from 'react'
import styles from '../styles/LoginPage.module.css'
import { Table, Button, Navbar, NavbarBrand, FormGroup, Form, Input, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Nav, NavItem, NavLink, UncontrolledDropdown, InputGroup, InputGroupText, Spinner } from 'reactstrap';
import AddData from './AddData';
import UpdateData from './UpdateData';
// Different Ledgers
import MyLedger from './MyLedger';
import AgentLedger from './AgentLedger';

// Firebase
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";

import Image from 'next/image'
import xlsx from "json-as-xlsx";
import Link from 'next/link';
// Icons
import deleteIcon from '../public/delete.png'
import download from '../public/download.png'
import arrow from '../public/arrow.png';
import edit from '../public/edit.png';
import logo from '../public/logo.png';
import cells from '../public/cells.png';
import upload from '../public/file.png';
import controls from '../public/controls.png'
import plus from '../public/plus.png'
import reject from '../public/reject.png'

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AllData: null,
            data: [],

            displayData: [],
            toggle: false,
            toUpdate: null,
            toggleUpdateBox: false,
            toggleSidebar: false,
            sortOldToNew: true,
            filter: "Last7",
            showDate: false,
            startDate: null,
            endDate: null,
            dropdownOpen: false,
            db: this.props.DB,
            Ledger: "MyLedger",

            myLedger: [],
            Transporter: [],
            Company: [],
            OwnerLedger: [],
            PetrolLedger: [],

            filterChangeTo: "Last7",
            // isOrient : true,

            attachedVehicleData: [],

            searchQuery: "",
        }
    }


    componentDidMount() {
        const db = getDatabase();

        // FETCHING DATA
        const Ref = ref(db, '/transportDetails/');
        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            let x = [...Object.values(data || {})];

            this.setState({
                AllData: data,
                data: x,
            }, () => {
                this.handleApply(x);
            })
        })


    }

    addData = (obj) => {
        const db = getDatabase();
        const id = new Date().getTime();
        obj.id = id;
        set(ref(db, '/transportDetails/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggle: false,
            })
        })
        // alert("New data added successfully");
    }

    onEditClick = (item) => {
        console.log(item, "ON EDIT CLICK");
        this.setState({ toUpdate: item, toggleUpdateBox: true })
    }

    handleDelete = (id) => {
        let toDelete = confirm("Are you sure you want to delete this field?");
        if (toDelete) {
            const db = getDatabase();
            set(ref(db, '/' + this.state.db + '/' + id), {});
        }

    }

    onTransferClick = (item) => {
        this.handleDelete(item.id);
        const db = getDatabase();
        console.log(item);
        if (this.state.db === "Ultratech") {
            set(ref(db, '/Orient/' + item.id), {
                ...item
            })
        }
        else {
            set(ref(db, '/Ultratech/' + item.id), {
                ...item
            })
        }
    }

    updateData = (obj, id) => {
        const db = getDatabase();
        console.log("DASHBOARD UpdateData", obj, id);
        set(ref(db, '/transportDetails/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggleUpdateBox: false
            })
        })
    }

    sortOnSearch = (e) => {
        let query = (e.target.value || "").toUpperCase();
        this.setState({ searchQuery: query });
        let result = [];
        if (this.state.Ledger === "Agent") {
            // this.AgentPaymentStatusChange(this.state.AgentPaymentStatus);
            for (let item of this.state.data) {
                if (
                    (item.VehicleNo && item.VehicleNo.toUpperCase().includes(query)) ||
                    (item.FromLocation && item.FromLocation.toUpperCase() == (query)) ||
                    (item.ToLocation && item.ToLocation.toUpperCase() == (query)) ||
                    (item.Agent && item.Agent.toUpperCase().includes(query)) 

                ) {
                    result.push(item);
                }
            }
        }
        else {
            for (let item of this.state.data) {
                if (
                    (item.PartyName && item.PartyName.toUpperCase() == (query)) ||
                    (item.VehicleNo && item.VehicleNo.toUpperCase().includes(query)) ||
                    (item.FromLocation && item.FromLocation.toUpperCase().includes(query)) ||
                    (item.ToLocation && item.ToLocation.toUpperCase().includes(query)) ||
                    (item.Agent && item.Agent.toUpperCase().includes(query)) ||
                    (item.PaymentMode && item.PaymentMode.toUpperCase() == (query)) ||
                    (item.LabourStatus && item.LabourStatus.toUpperCase().includes(query))


                    // item.Weight.includes(query)
                ) {
                    result.push(item);
                }
            }
        }
        console.log(result)
        if (result.length > 0) {
            this.setState({
                displayData: result,
            })
        }
        else {
            this.setState({
                displayData: this.state.data,
            })
        }
    }

    AgentPaymentStatusChange = (e) => {
        let query = e;
        let result = [];
        console.log("QUERY", this.state.searchQuery);
        if (query != "ALL") {
            for (let item of this.state.data) {
                if (item.AgentPaymentStatus && item.AgentPaymentStatus.toUpperCase() === query &&
                    item.Agent && item.Agent.toUpperCase().includes(this.state.searchQuery)
                ) {
                    result.push(item);
                }
            }
        }
        else{
            for (let item of this.state.data) {
                if (
                    item.Agent && item.Agent.toUpperCase().includes(this.state.searchQuery)
                ) {
                    result.push(item);
                }
            }
        }
        console.log("RESULT", result)
        if (result.length > 0) {
            this.setState({
                displayData: result,
            })
        }
        else {
            this.setState({
                displayData: [],
            })
        }
    }

    ExportData = () => {
        console.log(this.state.displayData);
        let data;
        if (this.state.Ledger === "MyLedger") {
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "PartyName", value: "PartyName" }, // Run functions
                        { label: "MT(Location)", value: "MT_Location" },
                        { label: "From(Location)", value: "FromLocation" },
                        { label: "From(Factory Name)", value: "FromFN" },
                        { label: "To(Location)", value: "ToLocation" },
                        { label: "To(Factory Name)", value: "ToFN" },
                        { label: "Rate", value: "Rate" },
                        { label: "Weight(cwt)", value: "Weight" },
                        { label: "Product", value: "Product" },
                        { label: "Payment Status", value: "PaymentStatus" },
                        { label: "Payment Mode", value: "PaymentMode" },
                        { label: "Contact Number", value: "ContactNumber" },
                        { label: "Remarks", value: "Remark" },
                        { label: "Received On", value: "PaidOn" },
                        { label: "Agent", value: "Agent" },
                        { label: "Commission", value: "Comission" },
                        { label: "Agent Payment Status", value: "AgentPaymentStatus" },
                        { label: "Labour Amount", value: "LabourAmount" },
                        { label: "Labour Payment Status", value: "LabourStatus" },
                        { label: "Shortage", value: "Shortage" },
                        { label: "Poch Amount", value: "PochAmount" },
                        { label: "Poch Payment Status", value: "PochPaymentStatus" },
                        { label: "Poch Send Date", value: "PochSendDate" },
                        { label: "Net Amount", value: "NetAmount" },
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }
        else if (this.state.Ledger === "Agent") {
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "From(Location)", value: "FromLocation" }, // Run functions
                        { label: "To(Location)", value: "ToLocation" },
                        { label: "Agent", value: "Agent" },
                        { label: "Comission", value: "Comission" },
                        { label: "Payment Status", value: "AgentPaymentStatus" },
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }


        console.log(Object.values(this.state.displayData));
        let settings = {
            fileName: "MySpreadsheet", // Name of the resulting spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
            writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
            RTL: false, // Display the columns from right-to-left (the default value is false)
        }
        xlsx(data, settings) // Will download the excel file
    }

    // NO ISSUE HERE
    handleApply = (data) => {
        let x = data;
        let today = new Date();
        let monthPriorDate = new Date(new Date().setDate(today.getDate() - 30));
        let weekPriorDate = new Date(new Date().setDate(today.getDate() - 7));

        if (this.state.filterChangeTo === 'Last30') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= monthPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filterChangeTo === 'Last7') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= weekPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filterChangeTo === "ByDate") {
            if (this.state.startDate == null || this.state.endDate == null) {
                alert("Please Fill start and end date fields");
                return;
            }
            let start = new Date(this.state.startDate);
            let end = new Date(this.state.endDate);
            if (start > end) {
                alert("Please fill start and end date correctly. End Date should be after start date");
                return;
            }
            console.log(start, end, typeof (start));

            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= start && InvoiceDate <= end) {
                    return e;
                }
            })
        }


        if (this.state.sortOldToNew == true) {
            console.log("sorting")
            x.sort((a, b) => {
                let InvoiceA = new Date(a.InvoiceDate);
                let InvoiceB = new Date(b.InvoiceDate);
                if (InvoiceA >= InvoiceB) return 1;
                else return -1;
            });
        }
        else {
            x.sort((b, a) => {
                let InvoiceA = new Date(a.InvoiceDate);
                let InvoiceB = new Date(b.InvoiceDate);
                if (InvoiceA >= InvoiceB) return 1;
                else return -1;
            });
        }

        console.log(x);
        this.setState({
            displayData: x,
            data: data,
            toggleSidebar: false,
            filter: this.state.filterChangeTo,
        })
        // console.log(today,monthPriorDate, weekPriorDate);
    }

    changeLedger = (newLedger) => {

        if (newLedger === "MyLedger") {
            this.handleApply(this.state.data);
            this.setState({ AgentPaymentStatus: "ALL" });
        }
        else if (newLedger === "Agent") {
            this.handleApply(this.state.data);
        }

        this.setState({
            Ledger: newLedger,
        })
    }


    render() {
        // let HEIGHT = window.innerHeight;
        return (
            <>

                <div style={{ backgroundColor: "white" }}>

                    {/* Navigation Bar */}
                    <Navbar
                        className="my-2"
                    // color="dark" 

                    >
                        <div >
                            <Button outline onClick={() => { this.setState({ toggleSidebar: !this.state.toggleSidebar }) }}>
                                <Image
                                    style={{ width: "20px", height: "20px" }}
                                    src={controls}
                                    alt="Picture of the author"
                                    width="10px"
                                    height="10px"
                                />
                            </Button>

                        </div>

                        {/* Update Box Close Button |||| Other Navigation bar buttons */}
                        {
                            this.state.toggleUpdateBox ?

                                // Update Box close button
                                <>
                                    <Button color='info' onClick={() => this.setState({ toggleUpdateBox: !this.state.toggleUpdateBox })}>Close</Button>
                                    <div></div>
                                </>
                                :
                                <>
                                    <div className={styles.inputBox} style={{ marginTop: "-32px" }}>

                                        <input
                                            type="text"
                                            onChange={this.sortOnSearch}
                                            required
                                        />
                                        <span>Search</span>
                                        <i></i>
                                    </div>

                                    <div>
                                        {this.state.Ledger === "MyLedger" &&
                                            <Button outline onClick={() => this.changeLedger("Agent")} style={{ marginRight: "4px" }}>
                                                Agent Ledger
                                            </Button>

                                        }
                                        {this.state.Ledger === "Agent" &&
                                            <Button outline onClick={() => this.changeLedger("MyLedger")} style={{ marginRight: "4px" }}>
                                                My Ledger
                                            </Button>
                                        }
                                        <Button outline
                                            // style={{ }}
                                            onClick={this.ExportData}
                                        >
                                            <Image
                                                style={{ width: "20px", height: "20px" }}
                                                src={download}
                                                alt="Picture of the author"
                                                width="10px"
                                                height="10px"
                                            />
                                        </Button>

                                    </div>
                                </>
                        }


                    </Navbar>

                    {this.state.toggleUpdateBox ?

                        <UpdateData updateData={this.updateData} style={{ marginTop: "-3%" }} data={this.state.toUpdate}></UpdateData>

                        :

                        <>
                            {/* Heading above table */}
                            <div style={{ width: "90vw", margin: "auto", color: "#1f5457", display: "flex", justifyContent: "space-between" }}>
                                <h3>HKL</h3>

                                <div>
                                    {
                                        this.state.Ledger === "Agent" ?
                                            <>
                                                <   div className={styles.inputBox}>
                                                    
                                                    <select
                                                        onChange={(e) => {
                                                            this.setState({ AgentPaymentStatus: e.target.value })
                                                            this.AgentPaymentStatusChange(e.target.value);
                                                        }}
                                                        required
                                                        style={{ width: "100%", height: "34px" }}
                                                    >
                                                        <option value="ALL">ALL</option>
                                                        <option value="PAID">PAID</option>
                                                        <option value="UNPAID">UNPAID</option>
                                                    </select>
                                                    <i></i>
                                                </div>
                                            </>
                                            :

                                            this.state.toggle === false ?

                                                <Button outline onClick={() => this.setState({ toggle: !this.state.toggle })}>
                                                    <Image
                                                        style={{ width: "20px", height: "20px" }}
                                                        src={plus}
                                                        alt="Picture of the author"
                                                    />
                                                </Button>

                                                :
                                                <Button color='danger' outline onClick={() => this.setState({ toggle: !this.state.toggle })}>
                                                    <Image
                                                        style={{ width: "20px", height: "20px" }}
                                                        src={reject}
                                                        alt="Picture of the author"
                                                    />
                                                </Button>


                                    }
                                </div>
                            </div>
                            {
                                this.state.toggle === true ?
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                                        <AddData updateData={this.addData} ></AddData>
                                    </div>
                                    :
                                    (this.state.AllData === null ?
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "30vh" }}>
                                            {/* <Spinner >
                                                Loading...
                                            </Spinner> */}
                                            <div>NO DATA</div>
                                        </div>
                                        :

                                        <div>
                                            {
                                                this.state.Ledger === "MyLedger" &&
                                                <MyLedger
                                                    displayData={this.state.displayData}
                                                    handleDelete={this.handleDelete}
                                                    onEditClick={this.onEditClick}
                                                    onTransferClick={this.onTransferClick}
                                                    filter={this.state.filter}
                                                // DB={this.props.DB}
                                                ></MyLedger>
                                            }
                                            {
                                                this.state.Ledger === "Agent" &&
                                                <AgentLedger
                                                    displayData={this.state.displayData}
                                                    filter={this.state.filter}
                                                // DB={this.props.DB}
                                                ></AgentLedger>
                                            }
                                        </div>
                                    )

                            }

                        </>

                    }

                    {this.state.toggleSidebar &&

                        <div style={{
                            width: "400px", height: `100%`, position: 'absolute', backgroundColor: "#1f5457", top: "72px", color: "white", padding: "30px 30px", zIndex: "20",
                            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                        }}>
                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px" }}>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} onChange={(e) => { this.setState({ sortOldToNew: true }) }} type="radio" name='sort' />
                                    <Label >Old to New</Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} onChange={(e) => { this.setState({ sortOldToNew: false }) }} name="sort" type="radio" />
                                    <Label >New to Old</Label>
                                </FormGroup>
                            </div>

                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px", marginTop: "10px" }}>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filterChangeTo: "showAll", showDate: false })} />
                                    <Label check> Show All </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filterChangeTo: "Last30", showDate: false })} />
                                    <Label check> Last 30 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filterChangeTo: "Last7", showDate: false })} />
                                    <Label check> Last 7 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filterChangeTo: "ByDate", showDate: true })} />
                                    <Label check> Search by date </Label>
                                    {
                                        this.state.showDate
                                            ?
                                            <>
                                                <div style={{ width: "300px", margin: "8px" }}>
                                                    <InputGroup>
                                                        <InputGroupText>
                                                            Start Date
                                                        </InputGroupText>

                                                        <Input
                                                            type="date"
                                                            style={{ colorScheme: "black" }}
                                                            onChange={(e) => this.setState({ startDate: e.target.value })}
                                                        // required
                                                        />
                                                    </InputGroup>
                                                </div>
                                                <div style={{ width: "300px", margin: "8px" }}>
                                                    <InputGroup>
                                                        <InputGroupText>
                                                            End Date
                                                        </InputGroupText>
                                                        <Input
                                                            type="date"
                                                            style={{ colorScheme: "black" }}
                                                            onChange={(e) => this.setState({ endDate: e.target.value })}
                                                        // required
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </>
                                            :
                                            null
                                    }
                                </FormGroup>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Button onClick={() => this.handleApply(this.state.data)} outline color='info' style={{ width: "100%" }}>
                                    Apply
                                </Button>
                            </div>
                        </div>


                    }
                </div>


            </>

        )
    }
}

