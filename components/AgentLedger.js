import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';

export default class AgentLedger extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{
                color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto", marginTop: "30px",
                display: "block",
                height: '400px',
                overflowY: "scroll",
                overflowX: "scroll",
            }}>
            <Table striped bordered style={{
             color: "black", border: "1px solid grey", overflowX : "none"


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
                            Vehicle No
                        </th>
                        <th>
                            From
                        </th>
                        <th>
                            To
                        </th>
                        <th>
                            Agent
                        </th>
                        <th>
                            Comission
                        </th>
                        <th>
                            Payment Status
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
                                <th>
                                    {item.InvoiceDate}
                                </th>
                                <td>
                                    {item.VehicleNo}
                                </td>
                                <td>
                                    {item.FromLocation}
                                </td>
                                <td>
                                    {item.ToLocation}
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
                            </tr>
                        )
                    })}

                </tbody>
            </Table>
            </div>

        )
    }
}
