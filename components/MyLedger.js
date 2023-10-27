import React, { Component } from 'react'
import {
    Table,
    Button
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import transfer from '../public/transfer.png'
import Image from 'next/image'
import NoData from './NoData';

export default class MyLedger extends Component {
    constructor(props) {
        super(props)
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    render() {
        return (
            <>
                {this.props.displayData && this.props.displayData.length > 0 &&
                    <div style={{
                        color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                        display: "block",
                        height: '80vh',
                        overflowY: "scroll",
                        overflowX: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"
                    }}>
                        <Table striped bordered >

                            <thead>
                                <tr style={{ position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "black" }}>
                                    <th >
                                        <div style={{ marginRight: "90px" }}>
                                            #
                                        </div>
                                    </th>
                                    <th >
                                        Invoice Date
                                    </th>
                                    <th >
                                        Vehicle No.
                                    </th>
                                    <th>
                                        Party Name
                                    </th>
                                    <th>
                                        MT (location)
                                    </th>
                                    <th>
                                        From (location)
                                    </th>
                                    <th>
                                        {/* FN : Factory Name */}
                                        From (FN)
                                    </th>
                                    <th>
                                        To (location)
                                    </th>
                                    <th>
                                        To (FN)
                                    </th>
                                    <th>
                                        Rate
                                    </th>
                                    <th>
                                        Weight
                                    </th>
                                    <th>
                                        Product
                                    </th>
                                    <th>
                                        Total Advance
                                    </th>
                                    <th>
                                        Advance Status
                                    </th>
                                    <th>
                                        Remaining
                                    </th>
                                    <th>
                                        Payment Status
                                    </th>
                                    <th>
                                        Remarks
                                    </th>
                                    <th>
                                        Received On
                                    </th>
                                    <th>
                                        Agent
                                    </th>
                                    <th>
                                        Agent Commission
                                    </th>
                                    <th>
                                        Agent Payment Status
                                    </th>
                                    <th>
                                        Labour Amount
                                    </th>
                                    <th>
                                        Labour Status
                                    </th>
                                    <th>
                                        Shortage
                                    </th>
                                    <th>
                                        Poch Payment Status
                                    </th>
                                    <th>
                                        Poch Remark
                                    </th>
                                    <th>
                                        Poch Send Date
                                    </th>
                                    <th>
                                        Poch Amount
                                    </th>
                                    <th>
                                        Net Amount Received
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.displayData && this.props.displayData.map((item, i) => {
                                    return (

                                        <tr key={i} >

                                            <th scope="row">
                                               
                                                <details>
                                                    <summary>{i + 1}
                                                    {item.AdvanceReceivedStatus === "Complete" ?
                                                        <div style={{width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "green"}}></div>
                                                        :
                                                        item.AdvanceReceivedStatus === "Partial" ?
                                                        <div style={{width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "yellow"}}></div>
                                                        :
                                                        <div style={{width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "red"}}></div>   

                                                    }
                                                    </summary>
                                                    <div style={{ display: "flex" }}>
                                                        <button onClick={() => this.props.handleDelete(item.id)} style={{ border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px" }}>
                                                            <Image
                                                                style={{ width: "25px", height: "25px" }}
                                                                src={deleteIcon}
                                                                alt="Picture of the author"
                                                            />
                                                        </button>
                                                        <button onClick={() => this.props.onEditClick(item)} style={{ border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px" }}>
                                                            <Image
                                                                style={{ width: "25px", height: "25px" }}
                                                                src={edit}
                                                                alt="Picture of the author"
                                                            />
                                                        </button>
                                                        <button onClick={() => this.props.onTransferClick(item)} style={{ border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px" }}>
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
                                                {this.formatDate(item.InvoiceDate)}
                                            </td>
                                            <td>
                                                {item.VehicleNo}
                                            </td>
                                            <td>
                                                {item.PartyName}
                                            </td>
                                            <td>
                                                {item.MT_Location}
                                            </td>
                                            <td>
                                                {item.FromLocation}
                                            </td>
                                            <td>
                                                {/* FN : Factory Name */}
                                                {item.FromFN}
                                            </td>
                                            <td>
                                                {item.ToLocation}
                                            </td>
                                            <td>
                                                {item.ToFN}
                                            </td>

                                            <td>
                                                {item.Rate}
                                            </td>
                                            <td>
                                                {item.Weight}
                                            </td>
                                            <td>
                                                {item.Product}
                                            </td>
                                            <td>
                                                {item.TotalAdvance} ₹
                                                : {item.Cash || 0} + {item.Online || 0} + {item.Cheque || 0} 
                                            </td>
                                            <td>
                                                {item.AdvanceReceivedStatus}
                                            </td>
                                            <td>
                                                {item.Remaining}
                                            </td>
                                            <td>
                                                {item.PaymentStatus}
                                            </td>
                                            <td>
                                                {item.PaymentMode}
                                                {item.PaymentMode === "Online" && <span style={{ color: "green" }}>{item.ContactNumber}</span>}
                                            </td>
                                            <td>
                                                {item.Remark}
                                            </td>
                                            <td>
                                                {item.PaidOn}
                                            </td>
                                            <td>
                                                {item.Agent}
                                            </td>
                                            <td>
                                                {item.Comission}
                                            </td>
                                            <td>
                                                {item.AgentPaymentStatus}
                                            </td>
                                            <td>
                                                {item.LabourAmount}
                                            </td>
                                            <td>
                                                {item.LabourStatus}
                                            </td>
                                            <td>
                                                {item.Shortage}
                                            </td>
                                            <td>
                                                {item.PochAmount}
                                            </td>

                                            <td>
                                                {item.PochPaymentStatus}
                                            </td>


                                            <td>
                                                {this.formatDate(item.PochSendDate)}
                                            </td>
                                            <td>
                                                {item.NetAmountReceived}
                                            </td>

                                        </tr>


                                    )
                                })}

                            </tbody>
                        </Table>
                    </div>

                }
                {
                    this.props.displayData && this.props.displayData.length === 0 &&
                    <NoData filter={this.props.filter}></NoData>
                }

            </>
        )
    }
}
