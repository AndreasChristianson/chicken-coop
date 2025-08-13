import './App.css';
import {useEffect, useState} from "react";
import {apiUrl} from "./env";
import spinner from "./spinner.svg"
import logo from "./coop-logo.png"

function Spinner() {
    return <img src={spinner} className="spinner" alt={"please wait"}/>;
}

function Temps() {
    const [temps, setTemps] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(apiUrl + "/temps");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setTemps(result);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return (
        <div className="temps">
            <h2>Temps</h2>
            {loading
                ? <Spinner/>
                : <ul>
                    {temps.map((item) => (
                        <li>{item.name}: {item.f}</li>
                    ))}
                </ul>
            }
        </div>
    );
}

function Relays() {
    return null;
}

function Snapshot() {
    return null;
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Chicken Coop</h1>
                <img src={logo} className="App-logo" alt="logo"/>
                <Temps/>
                <Relays/>
                <Snapshot/>
            </header>
        </div>
    )
        ;
}

export default App;
