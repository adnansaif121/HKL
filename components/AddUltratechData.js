import React, { Component } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    FormGroup,
    Label
} from 'reactstrap'
import styles from '../styles/AddData.module.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
// Firebase
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";

export default class AddUltratechData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InvoiceDate: "",
            VehicleNo: "",
            PartyName: "",
            Destination: "",
            Classification: "Owned",
            UnloadedAt: "",
            Weight: 0,
            Rate: 0,
            Comission: 0,
            MktComission: 0,
            PaidTo: "",
            MExpense: 0,
            Remark: "",
            PayableFreight: 0,
            NetFreight: 0,
            DiffPayable: 0,
            PaidOn: "",
            OurRate: 0,
            OurFreight: 0,
            NetProfit: 0,
            RateData: [],

            VehicleReturnState: "Empty",
            VehicleOwnership: "Owned",
            kmsLead: 0,
            RateSelected: null,

            // IF ATTACHED
            Diesel: 0,
            DieselRate: 0,
            DieselQuantity: 0,
            Toll: 0,
            Warai: 0,
            PetrolPumpName: "",

            // Vehicle Owner
            VehicleOwnerName: "",

            // PartyNameList
            PartyNameList: [],

            // RateDates(dates for different ledgeres, date index provides the ledgeres index in newUltratechRates)
            RateDates: [],
        }
    }

    componentDidMount() {

        //firebase fetch UltratechRateDates
        const db = getDatabase();
        const Ref = ref(db, "/UltratechRateDates");
        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            this.setState({
                RateDates: data,
            }, ()=> {

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

                //  Call handleInvoice to defines Rates 
                this.handleInvoiceDate(todayDate);
            })
        });

        // Party Name Cache List
        let entries = Object.values(this.props.AllData)
        let PartyNameList = [];
        let set = new Set();
        for (let item of entries) {
            set.add(item.PartyName);
        }

        let setArr = [...set];
        let i = 0;
        for (let item of setArr) {
            PartyNameList.push({
                Name: item,
                id: i
            })
            i++;
        }
        this.setState({
            PartyNameList,
        })



    }

    defineRates = (rateData) => {
        // RateData Filter
        // console.log(this.props.RateData);
        let rates = [];
        for (let item of rateData) {
            rates.push({
                id: item.id,
                displayName: `${item.DESTINATION} (${item.TONNAGE}) - ${item["SALES OFFICE"]}`,
            })
        }
        this.setState({
            RateData: rates,
            propsRateData: rateData,
        })
    }

    addData = () => {
        if (this.state.DieselRate === undefined || this.state.DieselQuantity === undefined) {
            alert("Please Enter a value in Diesel Rate and Quantity");
            return;
        }
        else if (this.state.Toll === undefined) {
            alert("Please Enter a value in Toll");
            return;
        }
        else if (this.state.Warai === undefined) {
            alert("Please Enter a value in Warai");
            return;
        }

        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: (this.state.VehicleNo || "").toUpperCase(),
            PartyName: (this.state.PartyName || ""),
            Destination: (this.state.Destination || ""),
            Classification: this.state.VehicleOwnership,
            VehicleReturnState: this.state.VehicleReturnState,
            // VehicleOwnership : this.state.VehicleOwnership,
            VehicleOwnerName: (this.state.VehicleOwnerName || ""),
            kmsLead: this.state.kmsLead,

            UnloadedAt: (this.state.UnloadedAt || ""),
            Weight: this.state.Weight,
            Rate: this.state.Rate,
            Comission: this.state.Comission,
            MktComission: this.state.MktComission,
            PaidTo: this.state.PaidTo,
            MExpense: this.state.MExpense,
            Remark: this.state.Remark,
            PayableFreight: (this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission,
            NetFreight: (this.state.Weight * this.state.Rate) + this.state.MExpense,
            DiffPayable: this.state.DiffPayable,
            PaidOn: this.state.PaidOn,
            OurRate: this.state.OurRate,
            OurFreight: (this.state.Weight * this.state.OurRate) - this.state.DiffPayable,
            NetProfit: (parseFloat(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight * this.state.Rate) + this.state.MExpense)) + parseFloat(this.state.Comission)) - (parseFloat(this.state.DieselRate * this.state.DieselQuantity) + parseFloat(this.state.Toll) + parseFloat(this.state.Warai)),

            // IF ATTACHED
            Diesel: (this.state.DieselRate * this.state.DieselQuantity || 0),
            DieselRate: (this.state.DieselRate || 0),
            DieselQuantity: (this.state.DieselQuantity || 0),
            PetrolPumpName: (this.state.PetrolPumpName || ""),
            Toll: (this.state.Toll || 0),
            Warai: (this.state.Warai || 0),

        }
        // console.log(obj)
        this.props.updateData(obj);
    }

    handleOnSearch = (string, results) => {
        // console.log(string, results);
        this.setState({
            Destination: string,
        })
    };

    handleOnSelect = (item) => {
        let ownedItem = item;
        let index = item.id - 1;
        let RateItem = this.state.propsRateData[index];
        let OurRate = "";
        let kmsLead = 0;
        if (this.state.VehicleReturnState === "Non-Empty") {
            OurRate = RateItem.FREIGHT;
            kmsLead = RateItem["KMS LEAD"];
        }
        else {
            OurRate = RateItem.FREIGHT + RateItem.TOLL;
            kmsLead = 2 * RateItem["KMS LEAD"];
        }

        this.setState({
            Destination: `${RateItem["DESTINATION"]} (${RateItem["TONNAGE"]})`,
            OurRate: parseFloat(OurRate),
            kmsLead: kmsLead,
            RateSelected: this.state.propsRateData[index],
        })
        console.log(ownedItem);
    };

    handleOnSearchPartyName = (string) => {
        this.setState({
            PartyName: string
        })
    }

    handleOnSelectPartyName = (item) => {
        this.setState({
            PartyName: item.Name,
        })
    }

    handleOnSearchVehicleNo = (string) => {
        this.setState({
            VehicleNo: (string || "").toUpperCase()
        })
    }

    handleOnSelectVehicleNo = (item) => {
        this.setState({
            VehicleNo: item.vehicleNo,
            VehicleOwnerName: item.vehicleOwner,
            Weight: item.weight,
            VehicleOwnership: "Attached",
        })
    }

    changeVehicleOwnership = (Ownership) => {
        if (Ownership === "Owned") {
            this.setState({
                DieselRate: 0,
                DieselQuantity: 0,
                Diesel: 0,
                Toll: 0,
                Warai: 0,
                PetrolPumpName: "",
            })
        }
        this.setState({
            VehicleOwnership: Ownership,
        })
    }

    changeVehicleReturnState = (State) => {
        let OurRate = 0;
        let kmsLead = 0;
        let RateItem = this.state.RateSelected;
        if (this.state.RateSelected !== null) {
            if (State === "Non-Empty") {
                OurRate = RateItem.FREIGHT;
                kmsLead = RateItem["KMS LEAD"];
            }
            else {
                OurRate = RateItem.FREIGHT + RateItem.TOLL;
                kmsLead = 2 * RateItem["KMS LEAD"];
            }
            console.log(OurRate, kmsLead, State);
            this.setState({
                OurRate: OurRate,
                kmsLead: kmsLead,
                VehicleReturnState: State,
            })
        }
        else {
            this.setState({
                VehicleReturnState: State,
            })
        }
    }

    calExpense = (ExpenseType, value) => {
        if (value === null) {
            return;
        }
        this.setState({
            [ExpenseType]: parseFloat(value),
        })
    }

    handleInvoiceDate = (date) => {
        // set invoice date
        this.setState({ InvoiceDate: date });
        // get ledger index
        // initialise ledgerSelected to null
        let ledgerSelected = null;
        let queryDate = new Date(date);
        // iterate over all ledgers dates
        console.log(this.state.RateDates);
        for (let i = this.state.RateDates.length - 1; i >= 0; i--) {
            console.log(this.state.RateDates[i].FROM);
            let ledgerDate = new Date(this.state.RateDates[i].FROM);
            // if query date is greater than or equal to ledger date select that ledger
            if (queryDate >= ledgerDate) {
                ledgerSelected = i;
                break;
            }
            console.log(queryDate, ledgerDate);
        }
        // if ledger is not selected
        if (ledgerSelected === null) {
            // alert user
            alert("frieght list before 11 Nov 2022 is Not available");
            return;
        }
        // When ledger is selected
        else {
            // find ledger selected in local storage
            console.log(ledgerSelected);
            let x = JSON.parse(localStorage.getItem(`newUltratechRate/${ledgerSelected}`));
            // If selected ledger is not present in local storage
            if (x == null) {
                // fetch ledger from server
                const db = getDatabase();
                const Ref = ref(db, "/newUltratechRate/" + ledgerSelected);
                onValue(Ref, (snapshot) => {
                    const data = snapshot.val();
                    x = data.data;
                    // store ledger in local storage
                    localStorage.setItem(`newUltratechRate/${ledgerSelected}`, JSON.stringify(x));
                    console.log(x);
                    // DefineRates
                    this.defineRates(x);
                });
            }
            else {
                // DefineRates
                this.defineRates(x);
                console.log(x, "localStorage");
            }
        }

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
                                            onChange={(e) => this.handleInvoiceDate(e.target.value)}
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

                                {/* PARTY NAME */}
                                {/* <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ PartyName: e.target.value.toUpperCase() })}
                                            value={this.state.PartyName}
                                            required
                                        />
                                        <span>Party Name</span>
                                        <i></i>
                                    </div>
                                </Col> */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        <div style={{ marginBottom: 0 }}>Party Name</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.PartyNameList}
                                            fuseOptions={{ keys: ["Name", "id"] }} // Search on both fields
                                            resultStringKeyName="Name" // String to display in the results
                                            onSearch={this.handleOnSearchPartyName}
                                            onSelect={this.handleOnSelectPartyName}
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

                            </Row>

                            <Row style={{ paddingBottom: "30px" }}>
                                {/* DESTINATION */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        <div style={{ marginBottom: 0 }}>Destination</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.RateData}
                                            fuseOptions={{ keys: ["id", "displayName"] }} // Search on both fields
                                            resultStringKeyName="displayName" // String to display in the results
                                            onSearch={this.handleOnSearch}
                                            onSelect={this.handleOnSelect}
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

                                <Col>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0px 30px 0px 30px" }}>

                                        {/* Empty/NonEmpty */}
                                        <div className={styles.dropdown} style={{ marginTop: "30px", width: "50%" }}>
                                            <Button outline className={styles.dropbtn} style={{ width: "200px" }}>
                                                {this.state.VehicleReturnState}
                                            </Button>
                                            <div className={styles.dropdownContent} style={{ width: "200px" }}>
                                                {
                                                    this.state.VehicleReturnState === "Non-Empty"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }}>Non-Empty</div>
                                                        :
                                                        <div onClick={() => this.changeVehicleReturnState("Non-Empty")}>Non-Empty</div>
                                                }
                                                {
                                                    this.state.VehicleReturnState === "Empty"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} >Empty</div>
                                                        :
                                                        <div onClick={() => this.changeVehicleReturnState("Empty")}>Empty</div>
                                                }

                                            </div>
                                        </div>

                                        {/* Owned/Attached */}
                                        <div className={styles.dropdown} style={{ marginTop: "30px" }}>
                                            <Button outline className={styles.dropbtn} style={{ width: "200px" }}>
                                                {this.state.VehicleOwnership}
                                            </Button>
                                            <div className={styles.dropdownContent} style={{ width: "200px" }}>
                                                {
                                                    this.state.VehicleOwnership === "Owned"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }}>Owned</div>
                                                        :
                                                        <div onClick={() => this.changeVehicleOwnership("Owned")}>Owned</div>
                                                }
                                                {
                                                    this.state.VehicleOwnership === "Attached"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }}>Attached</div>
                                                        :
                                                        <div onClick={() => this.changeVehicleOwnership("Attached")}>Attached</div>
                                                }

                                            </div>
                                        </div>

                                    </div>
                                </Col>

                            </Row>


                            {this.state.VehicleOwnership === "Attached"
                                ?
                                <div style={{ border: "1px solid black", padding: "30px" }}>
                                    <Row style={{ marginBottom: "20px" }}>
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="text"
                                                    onChange={(e) => this.setState({ VehicleOwnerName: (e.target.value || "").toUpperCase() })}
                                                    value={this.state.VehicleOwnerName}
                                                    required
                                                />
                                                <span>Vehicle Owner Name</span>
                                                <i></i>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        EXTRA ATTACHED EXPENSES
                                    </Row>
                                    <Row>

                                        {/* Diesel Quantity */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("DieselQuantity", e.target.value)}
                                                    value={this.state.DieselQuantity === 0 ? 0 : this.state.DieselQuantity}
                                                    required
                                                />
                                                <span>Diesel Quantity</span>
                                                <i></i>
                                            </div>
                                        </Col>

                                        {/* Diesel Rate */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("DieselRate", e.target.value)}
                                                    value={this.state.DieselRate === 0 ? 0 : this.state.DieselRate}
                                                    required
                                                />
                                                <span>Diesel Rate</span>
                                                <i></i>
                                            </div>
                                        </Col>

                                        {/* Toll */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("Toll", e.target.value)}
                                                    value={this.state.Toll === undefined ? 0 : this.state.Toll}
                                                    required
                                                />
                                                <span>Toll</span>
                                                <i></i>
                                            </div>
                                        </Col>

                                        {/* Warai */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("Warai", e.target.value)}
                                                    value={this.state.Warai === undefined ? 0 : this.state.Warai}
                                                    required
                                                />
                                                <span>Warai</span>
                                                <i></i>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ display: "flex", justifyContent: 'center', marginTop: "20px" }}>
                                        {/* Diesel */}
                                        <Col>
                                            Diesel : {this.state.DieselRate * this.state.DieselQuantity || 0}
                                        </Col>
                                        <Col>
                                            Total : {(this.state.DieselRate * this.state.DieselQuantity) + this.state.Toll + this.state.Warai}
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* Petrol Pump Name */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="text"
                                                    onChange={(e) => this.setState({ PetrolPumpName: (e.target.value || "").toUpperCase() })}
                                                    value={this.state.PetrolPumpName}
                                                    required
                                                />
                                                <span>Petrol Pump Name</span>
                                                <i></i>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                :
                                null
                            }

                            <Row>
                                {/* OWNED/MARKET */}
                                {/* <Col style={{ marginTop: "30px" }}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <FormGroup>
                                            <Input onChange={() => this.handleClass("OWNED")} style={{ width: "30px", height: "30px" }} name='class' type="radio" />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Owned</Label>
                                        </FormGroup>
                                        <FormGroup style={{ marginLeft: "10%" }}>
                                            <Input onChange={() => this.handleClass("MARKET")} defaultChecked style={{ width: "30px", height: "30px" }} name='class' type="radio" />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Market</Label>
                                        </FormGroup>
                                    </div>

                                </Col> */}

                                {/* KMS Lead */}
                                <Col md={2}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ OurRate: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.kmsLead}
                                            required
                                        />
                                        <span>KMS Lead</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* Unloaded At */}
                                <Col md={10}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ UnloadedAt: (e.target.value || "").toUpperCase() })}
                                            value={this.state.UnloadedAt}
                                            required
                                        />
                                        <span>Unloaded At</span>
                                        <i></i>
                                    </div>
                                </Col>

                            </Row>
                            <Row>

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

                                {/* COMISSION */}
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Comission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Comission</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>

                            <Row>
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

                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                {/* OUR RATE */}
                                <Col md={6}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ OurRate: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.OurRate}
                                            required
                                        />
                                        <span>Our Rate</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>

                            <Row>
                                {/* Payable Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Payable Freight : </span>
                                        {(this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission}
                                    </div>

                                </Col>

                                {/* Net Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Freight : </span>
                                        {(this.state.Weight * this.state.Rate) + this.state.MExpense}
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Our Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Our Freight : </span>
                                        {(this.state.Weight * this.state.OurRate) - this.state.DiffPayable}
                                        <i></i>

                                    </div>

                                </Col>

                                {/* Net Profit */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Profit : </span>
                                        {(parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight * this.state.Rate) + this.state.MExpense)) + parseInt(this.state.Comission)) - (parseFloat(((this.state.DieselRate || 0) * (this.state.DieselQuantity || 0)) || 0) + parseFloat(this.state.Toll) + parseFloat(this.state.Warai))}
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
