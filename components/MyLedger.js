import React, { Component } from 'react'
import {
    Table,
    Button
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import transfer from '../public/transfer.png'
import Image from 'next/image'
import styles from '../styles/LoginPage.module.css'

export default class MyLedger extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            // <div className={styles.dropdown} style={{ marginRight: "8px" }}>
            //                                 <Button outline className={styles.dropbtn}>
            //                                     <Image
            //                                         style={{ width: "20px", height: "20px" }}
            //                                         src={arrow}
            //                                         alt="Picture of the author"
            //                                         width="10px"
            //                                         height="10px"
            //                                     />
            //                                 </Button>
            //                                 <div className={styles.dropdownContent}>
            //                                     {
            //                                         this.state.db === "Ultratech"
            //                                             ?
            //                                             <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeDb("Ultratech")}><h6>Ultratech</h6></div>
            //                                             :
            //                                             <div onClick={() => this.changeDb("Ultratech")}><h6>Ultratech</h6></div>
            //                                     }
            //                                     {
            //                                         this.state.db === "Orient"
            //                                             ?
            //                                             <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeDb("Orient")}><h6>Orient</h6></div>
            //                                             :
            //                                             <div onClick={() => this.changeDb("Orient")}><h6>Orient</h6></div>
            //                                     }
            //                                 </div>
            //                             </div>
            <Table striped bordered style={{
                color: "black", border: "1px solid grey",
            }}>

                <thead>
                    <tr>
                        <th>
                            <div style={{ marginRight: "90px" }}>
                                #
                            </div>
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
                            Miscellaneous Expenses
                        </th>
                        <th>
                            Remark
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
                        {/* <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                            Option
                        </th>
                        <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                            Option
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {this.props.displayData && this.props.displayData.map((item, i) => {
                        return (
                            <>
                                <tr key={i} >

                                    <th scope="row">
                                        <details>
                                            <summary>{i + 1}</summary>
                                            <div style={{display: "flex"}}>
                                                <button onClick={() => this.props.handleDelete(item.id)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}>
                                                    <Image
                                                        style={{ width: "25px", height: "25px"}}
                                                        src={deleteIcon}
                                                        alt="Picture of the author"
                                                    />
                                                </button>
                                                <button onClick={() => this.props.onEditClick(item)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}> 
                                                    <Image
                                                        style={{ width: "25px", height: "25px" }}
                                                        src={edit}
                                                        alt="Picture of the author"
                                                    />
                                                </button>
                                                <button onClick={() => this.props.onTransferClick(item)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}> 
                                                    <Image
                                                        style={{ width: "25px", height: "25px" }}
                                                        src={transfer}
                                                        alt="Picture of the author"
                                                    />
                                                </button>
                                            </div>
                                        </details>
                                    </th>

                                    <td >
                                        {item.InvoiceDate}
                                    </td>
                                    <td>
                                        {item.VehicleNo}
                                    </td>
                                    <td>
                                        {item.PartyName}
                                    </td>
                                    <td>
                                        {`${item.Destination} (${item.Classification})`}
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
                                        {item.MExpense}
                                    </td>
                                    <td>
                                        {item.Remark}
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

                                </tr>

                            </>
                        )
                    })}

                </tbody>
            </Table>

        )
    }
}
