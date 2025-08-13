import './App.css';
import {useState} from "react";
import {apiUrl} from "./env";
import logo from "./coop-logo.png"

const Snapshot = () => {
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

export default Snapshot;