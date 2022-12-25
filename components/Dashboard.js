import React, { Component } from 'react'
import styles from '../styles/LoginPage.module.css'
import { Table, Button, Navbar, NavbarBrand, FormGroup, Form, Input, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Nav, NavItem, NavLink, UncontrolledDropdown, InputGroup, InputGroupText } from 'reactstrap';
import AddData from './AddData';
import AddUltratechData from './AddUltratechData';
import UpdateData from './UpdateData';
import UpdateUltratechData from './UpdateUltratechData';
import MyLedger from './MyLedger';
import Company from './Company';
import Transporter from './Transporter';
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
            RateData: [],
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
            // isOrient : true,
        }
    }

    UpdateLedger = (data) => {
        let myLedger = data ? [...Object.values(data)] : [];
        let Transporter = [];
        let Company = [];
        for (let item of myLedger) {
            if (item.MktComission != undefined && item.MktComission != null && item.MktComission != 0) {
                let obj = {
                    InvoiceDate: item.InvoiceDate,
                    VehicleNo: item.VehicleNo,
                    MktComission: item.MktComission,
                    PaidTo: item.PaidTo,
                    PaidOn: item.PaidOn
                };
                Transporter.push(obj);
            }

            if (item.DiffPayable != undefined && item.DiffPayable != null && item.DiffPayable != 0) {
                let obj = {
                    InvoiceDate: item.InvoiceDate,
                    VehicleNo: item.VehicleNo,
                    Weight: item.Weight,
                    Destination: item.Destination,
                    UnloadedAt: item.UnloadedAt,
                    PaidOn: item.PaidOn,
                    DiffPayable: item.DiffPayable,
                    PartyName: item.PartyName,
                };
                Company.push(obj);
            }
        }

        this.setState({
            myLedger,
            Transporter,
            Company,

        })

    }
    
    componentDidMount() {
        const db = getDatabase();
        const Ref = ref(db, '/'+this.props.DB);
        console.log(this.props.DB); 
        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            // console.log(data.ourRate.data);
            this.UpdateLedger(data);
            let x = (data !== undefined) ? [...Object.values(data)] : [];

            this.setState({
                AllData: data,
                data: x,
                // displayData: x,
                // RateData: data.ourRate.data,//abhi hatayo
            }, () => {
                this.handleApply(x);
            })
        })

        // FETCHING RATEDATA
        const dbRef = ref(getDatabase());
        if(this.props.DB === "Ultratech"){
            get(child(dbRef, '/UltratechRate/data')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    this.setState({ RateData: snapshot.val() })
                } else {
                    console.log("No data available");
                }
            }
            ).catch((error) => {
                console.error(error);
            });
        }
        else{
            get(child(dbRef, '/ourRate/data')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    this.setState({ RateData: snapshot.val() })
                } else {
                    console.log("No data available");
                }
            }
            ).catch((error) => {
                console.error(error);
            });
        }
    }

    addData = (obj) => {
        const db = getDatabase();
        const id = new Date().getTime();
        obj.id = id;
        set(ref(db, '/' + this.state.db + '/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggle: false,
            })
        })
        // alert("New data added successfully");
    }

    onEditClick = (item) => {
        this.setState({ toUpdate: item, toggleUpdateBox: true })
    }

    handleDelete = (id) => {
        let toDelete = confirm("Are you sure you want to delete this field?");
        if(toDelete){
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
        console.log(this.state.db);
        set(ref(db, '/' + this.state.db + '/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggleUpdateBox: false
            })
        })
    }

    sortOnSearch = (e) => {
        let query = (e.target.value || "").toUpperCase();
        let result = [];
        if (this.state.Ledger === "Transporter") {
            for (let item of this.state.data) {
                if (
                    (item.InvoiceDate && item.InvoiceDate.includes(query)) ||
                    (item.VehicleNo && item.VehicleNo.toUpperCase().includes(query)) ||
                    (item.PaidTo && item.PaidTo.toUpperCase().includes(query))
                ) {
                    result.push(item);
                }
            }
        }
        else {
            for (let item of this.state.data) {
                if (
                    (item.InvoiceDate && item.InvoiceDate.includes(query)) ||
                    (item.PartyName && item.PartyName.toUpperCase().includes(query)) ||
                    (item.VehicleNo && item.VehicleNo.toUpperCase().includes(query)) ||
                    (item.Destination && item.Destination.toUpperCase().includes(query)) ||
                    (item.UnloadedAt && item.UnloadedAt.toUpperCase().includes(query))
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

    ExportData = () => {
        let data;
        if (this.state.Ledger === "MyLedger") {
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "PartyName", value: "PartyName" }, // Run functions
                        { label: "Destination", value: "Destination" },
                        { label: "UnloadedAt", value: "UnloadedAt" },
                        { label: "Weight", value: "Weight" },
                        { label: "Rate", value: "Rate" },
                        { label: "Comission", value: "Comission" },
                        { label: "MktComission", value: "MktComission" },
                        { label: "PayableFreight", value: "PayableFreight" },
                        { label: "NetFreight", value: "NetFreight" },
                        { label: "DiffPayable", value: "DiffPayable" },
                        { label: "PaidOn", value: "PaidOn" },
                        { label: "OurRate", value: "OurRate" },
                        { label: "OurFreight", value: "OurFreight" },
                        { label: "NetProfit", value: "NetProfit" }
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }
        else if (this.state.Ledger === "Company") {
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "MktComission", value: "MktComission" },
                        { label: "Paid To", value: "PaidTo" },
                        { label: "PaidOn", value: "PaidOn" },
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }
        else {
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "PartyName", value: "PartyName" }, // Run functions
                        { label: "Destination", value: "Destination" },
                        { label: "UnloadedAt", value: "UnloadedAt" },
                        { label: "Weight", value: "Weight" },
                        { label: "DiffPayable", value: "DiffPayable" },
                        { label: "PaidOn", value: "PaidOn" },
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

        if (this.state.filter === 'Last30') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= monthPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filter === 'Last7') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= weekPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filter === "ByDate") {
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
        })
        // console.log(today,monthPriorDate, weekPriorDate);
    }

    changeLedger = (newLedger) => {
        // if (newLedger === this.state.Ledger) {
        //     alert("This Ledger is already selected " + newLedger);
        //     return;
        // }

        if (newLedger === "MyLedger") {
            this.handleApply(this.state.myLedger);
            // this.setState({
            //     data: this.state.myLedger,
            //     displayData: this.state.myLedger
            // })
        }
        else if (newLedger === "Company") {
            this.handleApply(this.state.Company);
            // this.setState({
            //     data: this.state.Company,
            //     displayData: this.state.Company,
            // })
        }
        else {
            this.handleApply(this.state.Transporter);
            // this.setState({
            //     data: this.state.Transporter,
            //     displayData: this.state.Transporter,
            // })
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
                        <NavbarBrand >
                            <Button outline onClick={() => { this.setState({ toggleSidebar: !this.state.toggleSidebar }) }}>
                                <Image
                                    style={{ width: "20px", height: "20px" }}
                                    src={controls}
                                    alt="Picture of the author"
                                    width="10px"
                                    height="10px"
                                />
                            </Button>
                        </NavbarBrand>

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

                                        <div className={styles.dropdown} style={{ marginRight: "8px" }}>
                                            <Button outline className={styles.dropbtn}>
                                                {this.state.Ledger}
                                            </Button>
                                            <div className={styles.dropdownContent}>
                                                {
                                                    this.state.Ledger === "MyLedger"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("MyLedger")}>MyLedger</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("MyLedger")}>MyLedger</div>
                                                }
                                                {
                                                    this.state.Ledger === "Company"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("Company")}>Company Ledger</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("Company")}>Company Ledger</div>
                                                }
                                                {
                                                    this.state.Ledger === "Transporter"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("Transporter")}>Transporter</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("Transporter")}>Transporter</div>
                                                }
                                            </div>
                                        </div>
                                        
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
                                        
                                        {
                                            this.props.DB === "Ultratech" ?
                                            <Link href="/UltratechExcelReader">
                                                <Button outline style={{ marginLeft: "8px" }} >
                                                    <Image
                                                        style={{ width: "25px", height: "25px" }}
                                                        src={upload}
                                                        alt="Picture of the author"
                                                        width="10px"
                                                        height="10px"
                                                    />
                                                </Button>
                                            </Link>
                                            :
                                            <Link href="/ExcelReader">
                                                <Button outline style={{ marginLeft: "8px" }} >
                                                    <Image
                                                        style={{ width: "25px", height: "25px" }}
                                                        src={upload}
                                                        alt="Picture of the author"
                                                        width="10px"
                                                        height="10px"
                                                    />
                                                </Button>
                                            </Link>
                                        }
                                    </div>
                                </>
                        }


                    </Navbar>

                    {this.state.toggleUpdateBox ?

                        
                            this.props.DB === "Ultratech" ?
                        
                            <UpdateUltratechData updateData={this.updateData} RateData={this.state.RateData} style={{ marginTop: "-3%" }} data={this.state.toUpdate} AllData={this.state.AllData}></UpdateUltratechData>
                            
                            :

                            <UpdateData updateData={this.updateData} RateData={this.state.RateData} style={{ marginTop: "-3%" }} data={this.state.toUpdate}></UpdateData>

                        :

                        <>
                            {/* Heading above table */}
                            <div style={{ width: "90vw", margin: "auto", color: "#1f5457", display: "flex" , justifyContent: "space-between"}}>
                                <Link href="/Options">
                                    <Button outline>Back</Button>
                                </Link>
                                <h3>{this.props.DB}</h3>
                                <div>

                                    {this.state.toggle === false ?
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
                                    {
                                        this.props.DB === "Ultratech" ?
                                        <AddUltratechData updateData={this.addData} RateData={this.state.RateData} AllData={this.state.AllData}></AddUltratechData>
                                        :
                                        <AddData updateData={this.addData} RateData={this.state.RateData}></AddData>

                                    }
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
                                        ></MyLedger>
                                    }
                                    {
                                        this.state.Ledger === "Company" &&
                                        <Company 
                                            displayData={this.state.displayData}
                                            filter={this.state.filter}
                                        ></Company>
                                    }
                                    {
                                        this.state.Ledger === "Transporter" &&
                                        <Transporter 
                                            displayData={this.state.displayData}
                                            filter={this.state.filter}
                                        ></Transporter>
                                    }

                                </div>
    
    
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
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filter: "showAll", showDate: false })} />
                                    <Label check> Show All </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last30", showDate: false })} />
                                    <Label check> Last 30 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last7", showDate: false })} />
                                    <Label check> Last 7 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input style={{ margin: "5px", width: "20px", height: "20px" }} name='filter' type="radio" onChange={(e) => this.setState({ filter: "ByDate", showDate: true })} />
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

