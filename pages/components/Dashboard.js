import React, { Component } from 'react'
import styles from '../../styles/LoginPage.module.css'
import { Table, Button, Navbar, NavbarBrand, FormGroup, Form, Input, Label } from 'reactstrap';
import AddData from './AddData';
import UpdateData from './UpdateData';
import firebase from '../../config/firebase';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import deleteIcon from '../../public/delete.png'
import download from '../../public/download.png'
import edit from '../../public/edit.png'
import controls from '../../public/controls.png'
import Image from 'next/image'
import xlsx from "json-as-xlsx"

export default class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            displayData: [],
            toggle: false,
            toUpdate: null,
            toggleUpdateBox: false,
            toggleSidebar: false,
            sortOldToNew: true,
            filter: "showAll",
            showDate: false,
            startDate : null,
            endDate : null,
        }
    }

    componentDidMount() {
        const db = getDatabase();
        const starCountRef = ref(db, '/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(Object.values(data));
            this.setState({
                data: [...Object.values(data)],
                displayData: [...Object.values(data)],
            })
        })


    }

    addData = (obj) => {
        const db = getDatabase();
        const id = new Date().getTime();
        set(ref(db, '/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggle: false,
            })
        })
        // alert("New data added successfully");
    }
    updateData = (obj, id) => {
        const db = getDatabase();
        set(ref(db, '/' + id), {
            ...obj
        });
        // alert("Data Updated Successfully");
        // this.setState({
        //     toggleUpdateBox : false,
        // })
    }

    sortOnSearch = (e) => {
        let query = e.target.value;
        let result = [];
        for (let item of this.state.data) {
            if (
                item.InvoiceDate === query ||
                item.PartyName === query ||
                item.VehicleNo === query ||
                item.Destination === query ||
                item.UnloadedAt === query ||
                item.Weight === query
            ) {
                result.push(item);
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
        let data = [
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

    handleDelete = (id) => {
        const db = getDatabase();
        set(ref(db, '/' + id), {});
    }

    handleApply = () => {
        let x = this.state.data;
        let today = new Date();
        let monthPriorDate = new Date(new Date().setDate(today.getDate() - 30));
        let weekPriorDate = new Date(new Date().setDate(today.getDate() - 7));

        if(this.state.filter === 'Last30'){
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if(InvoiceDate >= monthPriorDate){
                    return e;
                }
            })
        }
        else if(this.state.filter === 'Last7'){
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if(InvoiceDate >= weekPriorDate){
                    return e;
                }
            })
        }
        else if(this.state.filter === "ByDate"){
            if(this.state.startDate == null || this.state.endDate == null){
                alert("Please Fill start and end date fields");
                return;
            }
            let start = new Date(this.state.startDate);
            let end = new Date(this.state.endDate);
            if(start > end){
                alert("Please fill start and end date correctly. End Date should be after start date");
                return;
            }
            console.log(start, end, typeof(start)); 
            
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if(InvoiceDate >= start && InvoiceDate <= end){
                    return e;
                }
            })
        }


        if(this.state.sortOldToNew == true){
            console.log("sorting")                                                                              
            x.sort((a, b) => a.id - b.id);
        }
        else{
            x.sort((b, a) => a.id - b.id);
        }

        console.log(x);
        this.setState({
            displayData : x,
            toggleSidebar : false,
        })
        // console.log(today,monthPriorDate, weekPriorDate);
    }

    render() {
        // let HEIGHT = window.innerHeight;
        return (
            <>

                <div style={{ backgroundColor: "white" }}>

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
                            <span style={{ marginLeft: "5px" }}>HKL</span>
                        </NavbarBrand>


                        {
                            this.state.toggleUpdateBox ?
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


                                    <Button outline
                                        style={{ marginRight: "50px" }}
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
                                </>
                        }


                    </Navbar>

                    {this.state.toggleUpdateBox ?

                        <UpdateData updateData={this.updateData} style={{ marginTop: "-3%" }} data={this.state.toUpdate}></UpdateData>

                        :

                        <>

                            <div style={{
                                color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto", marginTop: "30px",
                                display: "block",
                                height: '400px',
                                overflowY: "scroll",
                                overflowX: "scroll",
                            }}>
                                <Table striped bordered style={{
                                    width: "90vw", color: "black", margin: "3%", border: "1px solid grey",

                                    
                                }}>
                                    <thead>
                                        <tr>
                                            <th>
                                                #
                                            </th>
                                            <th>
                                                Invoice Date
                                            </th>
                                            <th>
                                                Vehicle No.
                                            </th>
                                            <th>
                                                Party Name
                                            </th>
                                            <th>
                                                Destination
                                            </th>
                                            <th>
                                                Unloaded At
                                            </th>
                                            <th>
                                                Weight (MT)
                                            </th>
                                            <th>
                                                Rate (₹)
                                            </th>
                                            <th>
                                                Comission
                                            </th>
                                            <th>
                                                Mkt Comission
                                            </th>
                                            <th>
                                                Payable Freight
                                            </th>
                                            <th>
                                                Net Freight
                                            </th>
                                            <th>
                                                Difference Payable
                                            </th>
                                            <th>
                                                Paid On
                                            </th>
                                            <th>
                                                Our Rate
                                            </th>
                                            <th>
                                                Our Freight
                                            </th>
                                            <th>
                                                Net Profit
                                            </th>
                                            <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                                                {/* Option */}
                                            </th>
                                            <th style={{ borderTop: "2px solid white", borderRight: "2px solid white"}}>
                                                {/* Option */}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.displayData && this.state.displayData.map((item, i) => {
                                            return (

                                                <tr key={i}>
                                                    <th scope="row">
                                                        {i + 1}
                                                    </th>
                                                    <td>
                                                        {item.InvoiceDate}
                                                    </td>
                                                    <td>
                                                        {item.VehicleNo}
                                                    </td>
                                                    <td>
                                                        {item.PartyName}
                                                    </td>
                                                    <td>
                                                        {item.Destination}
                                                    </td>
                                                    <td>
                                                        {item.UnloadedAt}
                                                    </td>
                                                    <td>
                                                        {item.Weight}
                                                    </td>
                                                    <td>
                                                        {item.Rate}
                                                    </td>
                                                    <td>
                                                        {item.Comission}
                                                    </td>
                                                    <td>
                                                        {item.MktComission}
                                                    </td>
                                                    <td>
                                                        {item.PayableFreight}
                                                    </td>
                                                    <td>
                                                        {item.NetFreight}
                                                    </td>
                                                    <td>
                                                        {item.DiffPayable}
                                                    </td>
                                                    <td>
                                                        {item.PaidOn}
                                                    </td>
                                                    <td>
                                                        {item.OurRate}
                                                    </td>
                                                    <td>
                                                        {item.OurFreight}
                                                    </td>
                                                    <td>
                                                        {item.NetProfit}
                                                    </td>
                                                    <td style={{ borderTop: "2px solid white", borderRight: "2px solid white", borderBottom: "2px solid white" }}>  
                                                        <Button outline color='danger'
                                                            onClick={() => this.handleDelete(item.id)}
                                                        // style={{padding : "0"}}
                                                        >
                                                            <Image
                                                                style={{ width: "20px", height: "20px" }}
                                                                src={deleteIcon}
                                                                alt="Picture of the author"
                                                                width="10px"
                                                                height="10px"
                                                            />
                                                        </Button>
                                                    </td>
                                                    <td style={{ borderTop: "2px solid white", borderRight: "2px solid white", borderBottom: "2px solid white" }}>
                                                        <Button outline color='info'
                                                            onClick={() => this.setState({ toUpdate: item, toggleUpdateBox: true })}
                                                        // style={{padding : "0"}}
                                                        >
                                                            <Image
                                                                style={{ width: "20px", height: "20px" }}
                                                                src={edit}
                                                                alt="Picture of the author"
                                                                width="10px"
                                                                height="10px"
                                                            />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </Table>

                            </div>

                            <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                                {this.state.toggle === false ?
                                    <Button outline  style={{ width: "100px" }} onClick={() => this.setState({ toggle: !this.state.toggle })}>Enter</Button>
                                    :
                                    <Button outline onClick={() => this.setState({ toggle: !this.state.toggle })}>Close</Button>
                                }
                            </div>

                            {
                                this.state.toggle === true &&
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                                    <AddData updateData={this.addData}></AddData>
                                </div>
                            }
                        </>

                    }

                    {this.state.toggleSidebar &&

                        <div style={{ width: "300px", height: `100%`, position: 'absolute', backgroundColor: "#1f5457", top: "72px", color: "white", padding: "30px 30px", zIndex: "20",
                            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                        }}>
                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px" }}>
                                <FormGroup >
                                    <Input onChange={(e) => { this.setState({ sortOldToNew: true }) }} defaultChecked type="radio" name='sort' />
                                    <Label style={{ marginLeft: "5px" }}>Old to New</Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input onChange={(e) => { this.setState({ sortOldToNew: false }) }} name="sort" type="radio" />
                                    <Label  style={{ marginLeft: "5px" }}>New to Old</Label>
                                </FormGroup>
                            </div>

                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px", marginTop: "10px" }}>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "showAll", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Show All </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last30", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Last 30 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last7", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Last 7 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "ByDate", showDate: true })} />
                                    <Label style={{ marginLeft: "5px" }} check> Search by date </Label>
                                    {
                                        this.state.showDate
                                            ?
                                            <>
                                                <div className={styles.inputBox} style={{width: "200px"}}>
                                                    <input
                                                        type="date"
                                                        onChange={(e) => this.setState({ startDate : e.target.value })}
                                                    // required
                                                    />
                                                    <span>Start Date</span>
                                                    <i></i>
                                                </div>
                                                <div className={styles.inputBox} style={{width: "200px"}}>
                                                    <input
                                                        type="date"
                                                        onChange={(e) => this.setState({ endDate: e.target.value })}
                                                    // required
                                                    />
                                                    <span>End Date</span>
                                                    <i></i>
                                                </div>
                                            </>
                                            :
                                            null
                                    }
                                </FormGroup>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Button onClick={this.handleApply} outline color='info' style={{ width: "100%" }}>
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

