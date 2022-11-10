import React, { Component } from 'react'
import {
    Table,
    Button
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import Image from 'next/image'

export default class MyLedger extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Table striped bordered style={{
             color: "black", border: "1px solid grey",


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
                        <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                            {/* Option */}
                        </th>
                        <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                            {/* Option */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.displayData && this.props.displayData.map((item, i) => {
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
                                <td style={{ borderTop: "2px solid white", borderRight: "2px solid white", borderBottom: "2px solid white" }}>
                                    <Button outline color='danger'
                                        onClick={() => this.props.handleDelete(item.id)}
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
                                        onClick={() => this.props.onEditClick(item)}
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

        )
    }
}
