import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';

export default class Company extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Table striped bordered style={{
                width: "90vw", color: "black", margin: "3%", border: "1px solid grey",


            }}>
                <thead>
                    <tr style={{position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "white", border: "2px solid black"}}>
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
                            Difference Payable
                        </th>
                        <th>
                            Paid On
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
                                    {item.Destination}
                                </td>
                                <td>
                                    {item.UnloadedAt}
                                </td>
                                <td>
                                    {item.Weight}
                                </td>
                                <td>
                                    {item.DiffPayable}
                                </td>
                                <td>
                                    {item.PaidOn}
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </Table>

        )
    }
}
