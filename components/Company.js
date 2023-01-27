import React, { Component } from 'react'
import {
    Table,
} from 'reactstrap';
import NoData from './NoData';

export default class Company extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("Company", this.props.displayData, this.props.displayData.length);
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
            {
                this.props.displayData && this.props.displayData.length > 0 &&
                <div style={{
                    color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                    display: "block",
                    height: '80vh',
                    overflowY: "scroll",
                    overflowX: "scroll",
                    boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"
                }}>
                    <Table striped bordered>
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
                                            {this.formatDate(item.InvoiceDate)}
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
