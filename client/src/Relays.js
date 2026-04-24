import './App.css';
import {useEffect, useState} from "react";
import {apiUrl} from "./env";
import Spinner from "./Spinner";

function Relays() {
    const [relays, setRelays] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [changed, setChanged] = useState(0);


    useEffect(() => {
        const fetchRelays = async () => {
            setLoading(true);
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
        }
        fetchRelays();
    }, [changed]);

    const toggle = item => async () => {
        setLoading(true);
        const response = await fetch(
            apiUrl + "/relays/" + item.name,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: item.status === "off" ? "on" : "off"
                }),
            }
        );
        console.log(response)
        console.log(await response.json())
        setChanged(changed + 1)
    }

    return (
        <div className="relays">
            <h2>Relays</h2>
            <span>{error}</span>
            {loading
                ? <Spinner/>
                : <ul>
                    {relays.map((item) => (
                        <li key={item.name} className="relay-row">{item.name}: <span className={`status ${item.status}`}>{item.status}</span> <button className={`relay-toggle ${item.status}`} onClick={toggle(item)}>{item.status === "on" ? "Turn off" : "Turn on"}</button></li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default Relays;