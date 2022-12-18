import React, { Component } from 'react'

export default class NoData extends Component {
    constructor(props) {
        super(props)
    }

  render() {
    return (
        
             <div style={{ textAlign: "center", marginTop: "20px" }}>
                 {this.props.filter === "ByDate" &&
                     <h3>No Entries In Between These Dates</h3>
                 }
                 {this.props.filter === "Last30" &&
                     <h3>No Entries In Last 30 Days</h3>
                 }
                 {this.props.filter === "Last7" &&
                     <h3>No Entries In Last 7 Days</h3>
                 }
                 {
                    this.props.filter === "showAll" &&
                    <h3>No Entries</h3>
                 }
             </div>
    )
  }
}
