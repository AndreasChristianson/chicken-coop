import './App.css';
import {useEffect, useState} from "react";
import {apiUrl} from "./env";
import Spinner from "./Spinner";

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

export default Relays;