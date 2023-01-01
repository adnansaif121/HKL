import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';

export default class UltratechRateLedger extends Component {
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
             color: "black", overflowX : "none"


            }}>
                <thead>
                    <tr style={{position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "white"}}>
                        <th>
                            #
                        </th>
                        <th>
                            SALES OFFICE
                        </th>
                        <th>
                            DESTINATION
                        </th>
                        <th>
                            TONNAGE
                        </th>
                        <th>
                            KMS LEAD
                        </th>
                        <th>
                            FREIGHT
                        </th>
                        <th>
                            TOLL
                        </th>
                        <th>
                            NET FREIGHT
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
                                    {item["SALES OFFICE"]}
                                </td>
                                <td>
                                    {item["DESTINATION"]}
                                </td>
                                <td>
                                    {item["TONNAGE"]}
                                </td>
                                <td>
                                    {item["KMS LEAD"]}
                                </td>
                                <td>
                                    {item["FREIGHT"]}
                                </td>
                                <td>
                                    {item["TOLL"]}
                                </td>
                                <td>
                                    {item["FREIGHT"] + item["TOLL"]}
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
