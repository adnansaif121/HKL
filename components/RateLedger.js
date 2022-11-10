import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';

export default class RateLedger extends Component {
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
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            Classification Name
                        </th>
                        <th>
                            Sales Office Name
                        </th>
                        <th>
                            Destination Code
                        </th>
                        <th>
                            Name of Destination
                        </th>
                        <th>
                            ToT Freight (PMT)
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
                                    {item["Classification Name"]}
                                </td>
                                <td>
                                    {item["Sales Office Name"]}
                                </td>
                                <td>
                                    {item["Destination Code"]}
                                </td>
                                <td>
                                    {item["Name of Destination"]}
                                </td>
                                <td>
                                    {item["ToT Freight (PMT)"]}
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
