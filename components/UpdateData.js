import React, { Component } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Label,
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
            InvoiceDate: this.props.data.InvoiceDate !== undefined ? this.props.data.InvoiceDate : "",
            VehicleNo: this.props.data.VehicleNo !== undefined ? this.props.data.VehicleNo : "",
            PartyName: this.props.data.PartyName !== undefined ? this.props.data.PartyName : "",
            Destination: this.props.data.Destination !== undefined ? this.props.data.Destination : "",
            Classification: this.props.data.Classification !== undefined ? this.props.data.Classification : "OWNED",
            UnloadedAt: this.props.data.UnloadedAt !== undefined ? this.props.data.UnloadedAt : "",
            Weight: this.props.data.Weight !== undefined ? this.props.data.Weight : 0,
            Rate: this.props.data.Rate !== undefined ? this.props.data.Rate : 0,
            Comission: this.props.data.Comission !== undefined ? this.props.data.Comission : 0,
            MktComission: this.props.data.MktComission !== undefined ? this.props.data.MktComission : 0,
            PaidTo: this.props.data.PaidTo !== undefined ? this.props.data.PaidTo : "",
            MExpense: this.props.data.MExpense !== undefined ? this.props.data.MExpense : 0,
            Remark: this.props.data.Remark !== undefined ? this.props.data.Remark : "",
            PayableFreight: this.props.data.PayableFreight !== undefined ? this.props.data.PayableFreight : 0,
            NetFreight: this.props.data.NetFreight !== undefined ? this.props.data.NetFreight : 0,
            DiffPayable: this.props.data.DiffPayable !== undefined ? this.props.data.DiffPayable : 0,
            PaidOn: this.props.data.PaidOn !== undefined ? this.props.data.PaidOn : "",
            OurRate: this.props.data.OurRate !== undefined ? this.props.data.OurRate : 0,
            OurFreight: this.props.data.OurFreight !== undefined ? this.props.data.OurFreight : 0,
            NetProfit: this.props.data.NetProfit !== undefined ? this.props.data.NetProfit : 0,
            id: this.props.data.id,
            // RateData: this.props.RateData

            RateData: [],
            // RateDates(dates for different ledgeres, date index provides the ledgeres index in newOrientRates)
            RateDates : [],
            RateSelected : null,
        }
    }

    componentDidMount() {

        //firebase fetch OrientRateDates
        const db = getDatabase();
        const Ref = ref(db, "/OrientRateDates/");
        onValue(Ref, (snapshot) => {
            const data = snapshot.val();
            this.setState({
                RateDates: data,
            }, () => {

                //  Call handleInvoice to defines Rates 
                this.handleInvoiceDate(this.props.data.InvoiceDate);
            })
        });
    }

    defineRates = (rateData) => {
        // RateData Filter
        // console.log(this.props.RateData);
        let rates = [];
        for (let item of rateData) {
            rates.push({
                id: item.id,
                displayName: `${item["Name of Destination"]} - ${item["Classification Name"]} (${item["Sales Office Name"]})`,
            })
        }
        this.setState({
            RateData: rates,
            propsRateData: rateData,
        })
    }

    addData = () => {
        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: this.state.VehicleNo,
            PartyName: this.state.PartyName,
            Destination: this.state.Destination,
            Classification: this.state.Classification,
            UnloadedAt: this.state.UnloadedAt,
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
            NetProfit: (parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight * this.state.Rate) + this.state.MExpense)) + parseInt(this.state.Comission)),
            id: this.props.data.id,
        }
        // console.log(obj)
        this.props.updateData(obj, this.props.data.id);
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
        // if (item["Classification Name"] !== this.state.Classification) {
        //     for (let i of this.state.RateData) {
        //         if (i["Name of Destination"] === item["Name of Destination"] && i["Classification Name"] === this.state.Classification) {
        //             ownedItem = i;
        //             break;
        //         }
        //     }
        // }
        this.setState({
            Destination: `${RateItem["Name of Destination"]} (${RateItem["Classification Name"]})`,
            OurRate: parseFloat(RateItem["ToT Freight (PMT)"])
        })
        console.log(ownedItem);
    };

    // handleClass = (Classification) => {
    //     if (this.state.Destination === "") {
    //         alert("Destination not selected");
    //         this.setState({
    //             Classification: Classification
    //         })
    //         return;
    //     }
    //     let item;
    //     for (let i of this.state.RateData) {
    //         if (i["Name of Destination"] == this.state.Destination && i["Classification Name"] == Classification) {
    //             item = i;
    //             break;
    //         }
    //     }
    //     if (item === undefined) {
    //         alert("Destination do not exist in list. Are you sure to continue?");
    //         this.setState({
    //             Classification: Classification
    //         })
    //     }
    //     else {
    //         // console.log(item);
    //         this.setState({
    //             Destination: item["Name of Destination"],
    //             OurRate: parseFloat(item["ToT Freight (PMT)"]),
    //             Classification: Classification
    //         })
    //     }
    // }

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
            let x = JSON.parse(localStorage.getItem(`newOrientRate/${ledgerSelected}`));
            // If selected ledger is not present in local storage
            if (x == null) {
                // fetch ledger from server
                const db = getDatabase();
                const Ref = ref(db, "/newOrientRate/" + ledgerSelected);
                onValue(Ref, (snapshot) => {
                    const data = snapshot.val();
                    x = data.data;
                    // store ledger in local storage
                    localStorage.setItem(`newOrientRate/${ledgerSelected}`, JSON.stringify(x));
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
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ VehicleNo: (e.target.value || "").toUpperCase()})}
                                            value={this.state.VehicleNo}
                                            required
                                        />
                                        <span>Vehicle No.</span>
                                        <i></i>
                                    </div>
                                </Col>
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
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>Destination</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.RateData}
                                            fuseOptions={{ keys: ["id", "displayName"] }} // Search on both fields
                                            resultStringKeyName="displayName" // String to display in the results
                                            onSearch={this.handleOnSearch}
                                            onSelect={this.handleOnSelect}
                                            placeholder={this.state.Destination}
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
                                        {/* <div style={{ marginTop: 20 }}>This text will be covered!</div> */}
                                    </div>
                                </Col>

                                {/* <Col style={{ marginTop: "30px" }}>
                                    <h5 style={{ display: "flex", justifyContent: "center", color: "#1f5457" }}>
                                        {this.state.Classification}
                                    </h5>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <FormGroup>
                                            <Input
                                                onChange={() => this.handleClass("OWNED")}
                                                style={{ width: "30px", height: "30px" }}
                                                name='class'
                                                type="radio"
                                            />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Owned</Label>
                                        </FormGroup>
                                        <FormGroup style={{ marginLeft: "10%" }}>
                                            <Input
                                                onChange={() => this.handleClass("MARKET")}
                                                style={{ width: "30px", height: "30px" }}
                                                name='class'
                                                type="radio"
                                            />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Market</Label>
                                        </FormGroup>
                                    </div>

                                </Col>
 */}

                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ UnloadedAt: (e.target.value|| "").toUpperCase() })}
                                            value={this.state.UnloadedAt}
                                            required
                                        />
                                        <span>Unloaded At</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
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
                                <Col>
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

                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Comission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.Comission}
                                            required
                                        />
                                        <span>Comission</span>
                                        <i></i>
                                    </div>

                                </Col>
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MktComission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.MktComission}
                                            required
                                        />
                                        <span>Mkt Comission</span>
                                        <i></i>
                                    </div>

                                </Col>

                            </Row>
                            <Row>
                                {
                                    (this.state.MktComission && this.state.MktComission > 0) ?
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="text"
                                                    onChange={(e) => this.setState({ PaidTo: (e.target.value || "").toUpperCase() })}
                                                    value={this.state.PaidTo}
                                                    required
                                                />
                                                <span>Mkt Comission Paid To</span>
                                                <i></i>
                                            </div>
                                        </Col>
                                        :
                                        null
                                }
                            </Row>
                            <Row>
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MExpense: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.MExpense}
                                            required
                                        />
                                        <span>Miscellaneous Expenses</span>
                                        <i></i>
                                    </div>

                                </Col>
                                
                                    <Col >
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
                                
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ DiffPayable: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.DiffPayable}
                                            required
                                        />
                                        <span>Difference Payable</span>
                                        <i></i>
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ PaidOn: e.target.value })}
                                            value={this.state.PaidOn}
                                        // required
                                        />
                                        <span>Paid On</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            
                            <Row style={{display: "flex", justifyContent: "center"}}>

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
                            <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Payable Freight : </span>
                                        {(this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission}
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Freight : </span>
                                        {(this.state.Weight * this.state.Rate) + this.state.MExpense}
                                        
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Our Freight : </span>
                                        {(this.state.Weight * this.state.OurRate) - this.state.DiffPayable}
                                    
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Profit : </span>
                                        {(parseFloat(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight * this.state.Rate) + this.state.MExpense)) + parseFloat(this.state.Comission))}
                                        
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
