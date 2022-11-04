import React, { Component } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'
import styles from '../styles/AddData.module.css';
export default class AddData extends Component {
    constructor(props) {
        super();
        this.state = {
            InvoiceDate: "",
            VehicleNo: "",
            PartyName: "",
            Destination: "",
            UnloadedAt: "",
            Weight: 0,
            Rate: 0,
            Comission: 0,
            MktComission: 0,
            PaidTo : "",
            MExpense : 0,
            Remark : "",
            PayableFreight: 0,
            NetFreight: 0,
            DiffPayable: 0,
            PaidOn: "",
            OurRate: 0,
            OurFreight: 0,
            NetProfit: 0,
        }
    }

    addData = () => {
        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: this.state.VehicleNo,
            PartyName: this.state.PartyName,
            Destination: this.state.Destination,
            UnloadedAt: this.state.UnloadedAt,
            Weight: this.state.Weight,
            Rate: this.state.Rate,
            Comission: this.state.Comission,
            MktComission: this.state.MktComission,
            PaidTo : this.state.PaidTo,
            MExpense : this.state.MExpense,
            Remark : this.state.Remark,
            PayableFreight: (this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission,
            NetFreight: this.state.Weight * this.state.Rate,
            DiffPayable: this.state.DiffPayable,
            PaidOn: this.state.PaidOn,
            OurRate: this.state.OurRate,
            OurFreight: (this.state.Weight * this.state.OurRate) - this.state.DiffPayable,
            NetProfit: (parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - (this.state.Weight * this.state.Rate)) + parseInt(this.state.Comission)),
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
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ VehicleNo: e.target.value })}
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
                                            onChange={(e) => this.setState({ PartyName: e.target.value })}
                                            required
                                        />
                                        <span>Party Name</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ Destination: e.target.value })}
                                            required
                                        />
                                        <span>Destination</span>
                                        <i></i>
                                    </div>
                                </Col>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ UnloadedAt: e.target.value })}
                                            required
                                        />
                                        <span>Unloaded At</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Weight: e.target.value })}
                                            required
                                        />
                                        <span>Weight (MT)</span>
                                        <i></i>
                                    </div>

                                </Col>
                                <Col md={6}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Rate: e.target.value })}
                                            required
                                        />
                                        <span>Rate</span>
                                        <i></i>
                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Comission: e.target.value })}
                                            required
                                        />
                                        <span>Comission</span>
                                        <i></i>
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MktComission: e.target.value })}
                                            required
                                        />
                                        <span>Mkt Comission</span>
                                        <i></i>
                                    </div>
                                </Col>
                                {
                                    this.state.MktComission && this.state.MktComission > 0 &&
                                    <Col>
                                        <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ PaidTo: e.target.value })}
                                                required
                                            />
                                            <span>Mkt Comission Paid To</span>
                                            <i></i>
                                        </div>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MExpense: e.target.value })}
                                            required
                                        />
                                        <span>Miscellaneous Expenses</span>
                                        <i></i>
                                    </div>

                                </Col>
                                { this.state.MExpense>0 &&
                                    <Col md={6}>
                                        <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ Remark: e.target.value })}
                                                required
                                            />
                                            <span>Remark</span>
                                            <i></i>
                                        </div>

                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Payable Freight : </span>
                                        <input
                                            style={{ backgroundColor: "#1f5457", color: "white" }}
                                            type="number"
                                            value={(this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission}
                                            // onChange={(e) => this.setState({Comission: e.target.value})}
                                            required
                                            readOnly
                                        
                                        />
                                        <i></i>

                                    </div>

                                </Col>
                                <Col md={6}>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Freight : </span>
                                        <input
                                            style={{ backgroundColor: "#1f5457", color: "white" }}
                                            type="number"
                                            value={this.state.Weight * this.state.Rate}
                                            // onChange={(e) => this.setState({MktComission: e.target.value})}
                                            required
                                            readOnly
                                        />
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ DiffPayable: e.target.value })}
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
                                        // required
                                        />
                                        <span>Paid On</span>
                                        <i></i>
                                    </div>

                                </Col>
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ OurRate: e.target.value })}
                                            required
                                        />
                                        <span>Our Rate</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Our Freight : </span>
                                        <input
                                            style={{ backgroundColor: "#1f5457", color: "white" }}
                                            type="number"
                                            value={(this.state.Weight * this.state.OurRate) - this.state.DiffPayable}
                                            // onChange={(e) => this.setState({Comission: e.target.value})}
                                            required
                                            readOnly
                                        
                                        />
                                        <i></i>

                                    </div>

                                </Col>
                                <Col md={6}>
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Profit : </span>
                                        <input
                                            style={{ backgroundColor: "#1f5457", color: "white" }}
                                            type="number"
                                            value={(parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - (this.state.Weight * this.state.Rate)) + parseInt(this.state.Comission))}
                                            // onChange={(e) => this.setState({MktComission: e.target.value})}
                                            required
                                            readOnly
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
