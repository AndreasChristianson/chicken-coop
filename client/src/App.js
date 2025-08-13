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
                        <li>{item.name}: {item.f} °F</li>
                    ))}
                </ul>
            }
        </div>
    );
}

function Relays() {
    const [relays, setRelays] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(apiUrl + "/relays");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setRelays(result);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return (
        <div className="relays">
            <h2>Relays</h2>
            {loading
                ? <Spinner/>
                : <ul>
                    {relays.map((item) => (
                        <li>{item.name}: {item.status}</li>
                    ))}
                </ul>
            }
        </div>
    );
}

function Snapshot() {
    const [loading, setLoading] = useState(true);
    const handleImageLoaded = () => {
        setLoading(false);
    }
    const imageStyle = loading ? {display: "none"} : {};
    return (
        <div className="imageHolder">
            {loading && <img src={logo} className="App-logo" alt={'loading snapshot'}/>}
            <img
                src={apiUrl + "/snapshot.jpg"}
                onLoad={handleImageLoaded}
                style={imageStyle}
                className="App-logo"
                alt={'happy chickens'}
            />
        </div>
    )
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Chicken Coop</h1>
                <Snapshot/>
                <Temps/>
                <Relays/>
            </header>
        </div>
    )
        ;
}

export default App;
