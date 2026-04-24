import './App.css';
import {useState} from "react";
import logo from "./coop-logo.png"

const Snapshot = () => {
    return (
        <div className="imageHolder">
            <img src={logo} className="App-logo" alt={'chicken coop'}/>
        </div>
    )
}

export default Snapshot;