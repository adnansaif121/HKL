import React, { Component } from 'react';
// import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
// import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as XLSX from 'xlsx'
import { make_cols } from '../components/MakeColumns';
import { SheetJSFT } from '../components/types';
import { Input, Button, Label, Row, Col, Container, Navbar, NavbarBrand } from 'reactstrap';
import RateLedger from '../components/RateLedger';
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, update, get } from "firebase/database";
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.png'

class ExcelReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            data: [],
            cols: [],
            toggle: false,
            isDataUploaded: false,
            applyDate: null,
            AllData: null,
            UltratechDb: null,
            OrientDb: null
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const db = getDatabase();
        const starCountRef = ref(db, '/');
        get(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            this.setState({
                AllData: data,
                UltratechDb: data.Ultratech,
                OrientDb: data.Orient,
            })
        })
    }

    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };

    handleFile() {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']), toggle: true }, () => {
                console.log(JSON.stringify(this.state.data, null, 2));
                console.log(this.state.data);
            });

        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }

    handleUpload = () => {
        const db = getDatabase();
        const data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        set(ref(db, '/ourRate'), {
            data
        })
        this.setState({
            isDataUploaded: true,
        }, () => {
            alert("Data Uploaded Sucessfully !!!");
        })
    }

    findRate = (Destination, Classification) => {
        let data = this.state.data
        for (let i of data) {
            if (i["Name of Destination"] === Destination && i["Classification Name"] === Classification) {
                return i["ToT Freight (PMT)"]
            }
        }
        return 500;
    }

    updateDb = (db) => {
        for (let item in db) {
            console.log(item, db[item]);
            let itemDate = new Date(db[item].InvoiceDate);
            let applyDate = new Date(this.state.applyDate);
            if (itemDate >= applyDate) {
                let rate = parseFloat(this.findRate(db[item].Destination, db[item].Classification));
                db[item].OurRate = rate;
                db[item].OurFreight = (db[item].Weight * rate) - db[item].DiffPayable,
                    db[item].NetProfit = (parseFloat(((db[item].Weight * rate) - db[item].DiffPayable) - (db[item].Weight * db[item].Rate)) + parseFloat(db[item].Comission))
            }

        }
        return db;
    }
    updateRates = () => {
        if (this.state.applyDate === null) {
            alert("Enter Apply Date !");
            return;
        }
        console.log(this.state.UltratechDb)

        let newUltratechDb = this.updateDb(this.state.UltratechDb);
        let newOrientDb = this.updateDb(this.state.OrientDb);

        const db = getDatabase();
        set(ref(db, '/Ultratech/'), {
            ...newUltratechDb
        }).then(() => {
            set(ref(db, '/Orient/'), {
                ...newOrientDb
            }).then(() => {
                alert("Data Updated Successfully !!")
            })
        })
    }

    render() {
        return (
            <>
                <Navbar
                    className="my-2"
                // color="dark"
                // dark
                >
                    <NavbarBrand>
                        <Link href="/">
                            <Button outline>
                                Back
                            </Button>
                        </Link>
                        <Image
                            style={{ width: "2.5rem", height: "2.5rem", marginLeft: "0.5rem", borderRadius: "10%" }}
                            src={logo}
                            alt="Picture of the author"
                            width="10px"
                            height="10px"
                        />
                    </NavbarBrand>
                </Navbar>

                <div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", }}>
                        <div>
                            <Label htmlFor="file">Upload an excel to Update frieght data</Label>
                            <div style={{ display: "flex" }}>
                                <Input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
                                <Button style={{ marginLeft: "5px" }} onClick={this.handleFile}>Submit</Button>
                            </div>
                        </div>

                    </div>



                    {
                        this.state.toggle &&
                        <>
                            <RateLedger displayData={this.state.data}></RateLedger>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                                <Button outline onClick={this.handleUpload}>
                                    Upload
                                </Button>

                            </div>
                        </>
                    }

                    {
                        this.state.isDataUploaded &&

                        <>
                            <div style={{ textAlign: "center", border: "1px solid black", margin: "20px", padding: "20px" }}>
                                <h3>Do you want to update existing data with these new Rate ?</h3>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <h4>Then enter the date you want to apply it from : </h4>
                                    <Input onChange={(e) => this.setState({ applyDate: e.target.value })} style={{ width: "30%", color: "white", backgroundColor: "#1f5457" }} type="date" />
                                </div>
                                <Button onClick={this.updateRates} color='warning'>UPDATE</Button>
                            </div>
                        </>
                    }

                </div>
            </>

        )
    }
}

export default ExcelReader;