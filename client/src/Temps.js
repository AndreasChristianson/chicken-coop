import './App.css';
import {useEffect, useState} from "react";
import {apiUrl} from "./env";
import Spinner from "./Spinner";

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

export default Temps;