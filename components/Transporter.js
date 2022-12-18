import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';
import NoData from './NoData';

export default class Transporter extends Component {
    constructor(props) {
        super(props)
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
                        <tr style={{position: "sticky", top: "0", backgroundColor: "#59C1BD", color: "black"}}>
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
                                Market Comission
                            </th>
                            <th>
                                Paid To
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
                                        {item.MktComission}
                                    </td>
                                    <td>
                                        {item.PaidTo}
                                    </td>
                                    <td>
                                        {item.PaidOn}
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
