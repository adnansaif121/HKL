import React, { Component } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'
import styles from '../styles/AddData.module.css';
export default class UpdateData extends Component {
    constructor(props){
        super(props);
        this.state = {
            InvoiceDate: this.props.data.InvoiceDate,
            VehicleNo : this.props.data.VehicleNo,
            PartyName : this.props.data.PartyName,
            Destination : this.props.data.Destination,
            UnloadedAt : this.props.data.UnloadedAt,
            Weight : this.props.data.Weight,
            Rate : this.props.data.Rate,
            Comission : this.props.data.Comission,
            MktComission : this.props.data.MktComission,
            PaidTo : this.props.data.PaidTo,
            MExpense : this.props.data.MExpense,
            Remark : this.props.data.Remark,
            PayableFreight : this.props.data.PayableFreight,
            NetFreight : this.props.data.NetFreight,
            DiffPayable : this.props.data.DiffPayable,
            PaidOn: this.props.data.PaidOn,
            OurRate : this.props.data.OurRate,
            OurFreight : this.props.data.OurFreight,
            NetProfit : this.props.data.NetProfit,
            id : this.props.data.id,
        }
    }

    addData = () => {
        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo : this.state.VehicleNo,
            PartyName : this.state.PartyName,
            Destination : this.state.Destination,
            UnloadedAt : this.state.UnloadedAt,
            Weight : this.state.Weight,
            Rate : this.state.Rate,
            Comission : this.state.Comission,
            MktComission : this.state.MktComission,
            PaidTo : this.state.PaidTo,
            MExpense : this.state.MExpense,
            Remark : this.state.Remark,
            PayableFreight : (this.state.Weight*this.state.Rate) - this.state.Comission - this.state.MktComission,
            NetFreight : this.state.Weight*this.state.Rate,
            DiffPayable : this.state.DiffPayable,
            PaidOn: this.state.PaidOn,
            OurRate : this.state.OurRate,
            OurFreight : (this.state.Weight * this.state.OurRate) - this.state.DiffPayable,
            NetProfit : (parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - (this.state.Weight * this.state.Rate)) + parseInt(this.state.Comission)),
            id : this.props.data.id,
        }
        // console.log(obj)
        this.props.updateData(obj, this.props.data.id);
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
                                            onChange={(e) => this.setState({InvoiceDate : e.target.value})} 
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
                                            onChange={(e) => this.setState({VehicleNo: e.target.value})}
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
                                            onChange={(e) => this.setState({PartyName: e.target.value})}
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
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({Destination: e.target.value})}
                                            value={this.state.Destination}   
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
                                            onChange={(e) => this.setState({UnloadedAt: e.target.value})}
                                            value={this.state.UnloadedAt}   
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
                                            onChange={(e) => this.setState({Weight: e.target.value})}
                                            value={this.state.Weight}   
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
                                            onChange={(e) => this.setState({Rate: e.target.value})}
                                            value={this.state.Rate}   
                                            required
                                        />
                                        <span>Rate</span>
                                        <i></i>
                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <Col >
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({Comission: e.target.value})}
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
                                            onChange={(e) => this.setState({MktComission: e.target.value})}
                                            value={this.state.MktComission}   
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
                                                value={this.state.PaidTo}
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
                                            value={this.state.MExpense}
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
                                                value={this.state.Remark}
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
                                            onChange={(e) => this.setState({DiffPayable: e.target.value})}
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
                                            onChange={(e) => this.setState({PaidOn: e.target.value})}
                                            value={this.state.PaidOn}   
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
                                            onChange={(e) => this.setState({OurRate: e.target.value})}
                                            value={this.state.OurRate}   
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
                            <button onClick={this.addData} className={styles.button}><span>Update</span></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
