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
                        <li>{item.name}: {item.status} <button onClick={toggle(item)}>toggle</button></li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default Relays;