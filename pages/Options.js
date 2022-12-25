import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Link from 'next/link';
const style = {
    width: "500px",
    height: "500px",
    margin: "10px",
    fontSize: "50px",
}
const body = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
}
export default class Options extends Component {
    // constructor(){
    //     super();
    //     this.openUltratech = this.openUltratech.bind(this);
    //     this.openOrient = this.openOrient.bind(this);
    //     this.state={
    //         DB : null,
    //     }
    // }

    // openUltratech = () => {
    //     console.log("Ultratech");
    //     this.setState({
    //         DB : "Ultratech"
    //     })
    // }

    // openOrient = () => {
    //     console.log("Orient");
    //     this.setState({
    //         DB : "Orient"
    //     })
    // }
    
  render() {
    return (
        <>
            {
                <div style={body}>
                    <Link href="/dashboard?db=Ultratech">
                        <Button outline style={style} >ULTRATECH</Button>
                    </Link>
                    <Link href="/dashboard?db=Orient">
                        <Button outline style={style} >ORIENT</Button>
                    </Link>
                </div>
             
            }
            
        </>
    )
  }
}
