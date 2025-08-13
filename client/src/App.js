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
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(apiUrl + "/temps");
                if (response.ok) {
                    const result = await response.json();
                    setTemps(result);
                } else {
                    setError("non 200 status: " + response.status)
                }
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return (
        <div className="temps">

            <h2>Temps</h2>
            <span>{error}</span>
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
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(apiUrl + "/relays");
                if (response.ok) {
                    const result = await response.json();
                    setRelays(result);
                } else {
                    setError("non 200 status: " + response.status)
                }
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return (
        <div className="relays">
            <h2>Relays</h2>
            <span>{error}</span>
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
