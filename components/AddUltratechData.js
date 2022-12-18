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

            VehicleReturnState : "Non-Empty",
            VehicleOwnership : "Owned",
            kmsLead : 0,
            RateSelected : null,

            // IF ATTACHED
            Diesel : 0,
            Toll : 0,
            Warai : 0,

            // Vehicle Owner
            VehicleOwnerName : "",

            // PartyNameList
            PartyNameList : [],

        }
    }

    componentDidMount(){

        // RateData Filter
        console.log(this.props.RateData);
        let rates = [];
        for(let item of this.props.RateData){
            rates.push({
                id: item.id,
                displayName : `${item.DESTINATION} (${item.TONNAGE})`,
            })
        }
        this.setState({
            RateData : rates,
        })

        // Party Name Cache List
        let entries = Object.values(this.props.AllData)
        let PartyNameList = [];
        let set = new Set();
        for(let item of entries){
            set.add(item.PartyName);
        }
        // for(let item of )
        // console.log(set.entries());
        let setArr = [...set];
        let i = 0;
        for(let item of setArr){
            PartyNameList.push({
                Name : item,
                id : i
            })
            i++;
        }
        this.setState({
            PartyNameList,
        })

    }

    addData = () => {
        if(this.state.Diesel=== undefined){
            alert("Please Enter a value in Diesel");
            return;
        }
        else if(this.state.Toll === undefined){
            alert("Please Enter a value in Toll");
            return;
        }
        else if(this.state.Warai === undefined){
            alert("Please Enter a value in Warai");
            return;
        }

        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: (this.state.VehicleNo).toUpperCase(),
            PartyName: this.state.PartyName.toUpperCase(),
            Destination: this.state.Destination.toUpperCase(),
            Classification: this.state.VehicleOwnership,
            VehicleReturnState : this.state.VehicleReturnState,
            // VehicleOwnership : this.state.VehicleOwnership,
            VehicleOwnerName : this.state.VehicleOwnerName,
            kmsLead : this.state.kmsLead,

            UnloadedAt: this.state.UnloadedAt.toUpperCase(),
            Weight: this.state.Weight,
            Rate: this.state.Rate,
            Comission: this.state.Comission,
            MktComission: this.state.MktComission,
            PaidTo: this.state.PaidTo,
            MExpense: this.state.MExpense,
            Remark: this.state.Remark,
            PayableFreight: (this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission,
            NetFreight: (this.state.Weight*this.state.Rate) + this.state.MExpense,
            DiffPayable: this.state.DiffPayable,
            PaidOn: this.state.PaidOn,
            OurRate: this.state.OurRate,
            OurFreight: (this.state.Weight * this.state.OurRate) - this.state.DiffPayable,
            NetProfit: (parseFloat(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight*this.state.Rate) + this.state.MExpense)) + parseFloat(this.state.Comission)) - (parseFloat(this.state.Diesel) + parseFloat(this.state.Toll) + parseFloat(this.state.Warai)),

             // IF ATTACHED
             Diesel : this.state.Diesel,
             Toll : this.state.Toll,
             Warai : this.state.Warai,

        }
        // console.log(obj)
        this.props.updateData(obj);
    }

    handleOnSearch = (string, results) => {
        // console.log(string, results);
        this.setState({
            Destination : string,
        })
    };

    handleOnSelect = (item) => {
        let ownedItem = item;
        let index = item.id - 1;
        let RateItem = this.props.RateData[index];
        let OurRate = "";
        let kmsLead = 0;
        if (this.state.VehicleReturnState === "Non-Empty") {
            OurRate = RateItem.FREIGHT;
            kmsLead = RateItem["KMS LEAD"];
        }
        else{
            OurRate = RateItem["NET FREIGHT"];
            kmsLead = 2*RateItem["KMS LEAD"];
        }

        this.setState({
            Destination: `${RateItem["DESTINATION"]} (${RateItem["TONNAGE"]})`,
            OurRate: parseFloat(OurRate),
            kmsLead : kmsLead,
            RateSelected : this.props.RateData[index],
        })
        console.log(ownedItem);
    };

    handleOnSearchPartyName = (string) => {
        this.setState({
            PartyName : string
        })
    }

    handleOnSelectPartyName = (item) => {
        this.setState({
            PartyName : item.Name,
        })
    }

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

    changeVehicleOwnership = (Ownership) => {
        if(Ownership === "Owned"){
            this.setState({
                Diesel : 0,
                Toll : 0,
                Warai : 0,
            })
        }
        this.setState({
            VehicleOwnership : Ownership,
        })
    }

    changeVehicleReturnState = (State) => {
        let OurRate = 0;
        let kmsLead = 0;
        let RateItem = this.state.RateSelected;
        if(this.state.RateSelected !== null){
            if (State === "Non-Empty") {
                OurRate = RateItem.FREIGHT;
                kmsLead = RateItem["KMS LEAD"];
            }
            else{
                OurRate = RateItem["NET FREIGHT"];
                kmsLead = 2*RateItem["KMS LEAD"];
            }
            console.log(OurRate, kmsLead, State);
            this.setState({
                OurRate : OurRate,
                kmsLead: kmsLead,
                VehicleReturnState : State,
            })
        }
        else{
            this.setState({
                VehicleReturnState : State,
            })
        }
    }

    calExpense = (ExpenseType, value) => {
        this.setState({
            [ExpenseType] : parseFloat(value)
        })
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
                                        // required
                                        />
                                        <span>Invoice Date</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* VEHICLE NO. */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ VehicleNo: e.target.value.toUpperCase() })}
                                            value={this.state.VehicleNo}
                                            required
                                        />
                                        <span>Vehicle No.</span>
                                        <i></i>
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

                            <Row style={{ paddingBottom:"30px"}}>
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
                                    <div style={{display: "flex", justifyContent: "space-between", padding: "0px 30px 0px 30px"}}>

                                        {/* Empty/NonEmpty */}
                                            <div className={styles.dropdown} style={{ marginTop: "30px", width: "50%" }}>
                                                <Button outline className={styles.dropbtn} style={{width: "200px"}}>
                                                    {this.state.VehicleReturnState}
                                                </Button>
                                                <div className={styles.dropdownContent} style={{width: "200px"}}>
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
                                                <Button outline className={styles.dropbtn} style={{width: "200px"}}>
                                                    {this.state.VehicleOwnership}
                                                </Button>
                                                <div className={styles.dropdownContent} style={{width:"200px"}}>
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

                            <Row style={{marginBottom : "20px"}}>
                                <Col>
                                    <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ VehicleOwnerName: e.target.value.toUpperCase() })}
                                                value={this.state.VehicleOwnerName}
                                                required
                                            />
                                            <span>Vehicle Owner Name</span>
                                            <i></i>
                                        </div>
                                </Col>
                            </Row>

                            {this.state.VehicleOwnership === "Attached"
                                ?
                                <div style={{border: "1px solid black", padding: "30px"}}>
                                    <Row>
                                        EXTRA ATTACHED EXPENSES
                                    </Row>
                                    <Row>
                                        {/* Diesel */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("Diesel", e.target.value) }
                                                    value={this.state.Diesel === 0 ? 0 : this.state.Diesel}
                                                    required
                                                />
                                                <span>Diesel</span>
                                                <i></i>
                                            </div>
                                        </Col>

                                        {/* Toll */}
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="number"
                                                    onChange={(e) => this.calExpense("Toll", e.target.value)}
                                                    value={this.state.Toll === undefined ? 0 : this.state.Toll }
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

                                    <Row style={{display : "flex", justifyContent: 'center', marginTop: "20px"}}>
                                        Total : {this.state.Diesel + this.state.Toll + this.state.Warai}
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
                                            onChange={(e) => this.setState({ UnloadedAt: e.target.value.toUpperCase() })}
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
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Weight: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Weight (MT)</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* RATE */}
                                <Col md={3}>
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
                                <Col md={3}>
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

                                {/* Mkt Comission */}
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MktComission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Mkt Comission</span>
                                        <i></i>
                                    </div>
                                </Col>
                                {
                                    (this.state.MktComission && this.state.MktComission > 0) 
                                    ?
                                    // PAID TO
                                        <Col>
                                            <div className={styles.inputBox}>
                                                <input
                                                    type="text"
                                                    onChange={(e) => this.setState({ PaidTo: e.target.value.toUpperCase() })}
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
                                {/* MISC EXPENSES */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MExpense: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Miscellaneous Expenses</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {this.state.MExpense > 0 &&
                                // REMARK
                                    <Col>
                                        <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ Remark: e.target.value.toUpperCase() })}
                                                value={this.state.Remark}
                                                required
                                            />
                                            <span>Remark</span>
                                            <i></i>
                                        </div>

                                    </Col>
                                }

                                {/* DIFFERENCE PAYABLE */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ DiffPayable: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Difference Payable</span>
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
                            
                            <Row style={{display: "flex", justifyContent: "center"}}>
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
                                        {(this.state.Weight*this.state.Rate) + this.state.MExpense}
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
                                        {(parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight*this.state.Rate) + this.state.MExpense)) + parseInt(this.state.Comission)) - (parseFloat(this.state.Diesel) + parseFloat(this.state.Toll) + parseFloat(this.state.Warai))}
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
