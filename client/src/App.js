import './App.css';
import Snapshot from "./Snapshot";
import Temps from "./Temps";
import Relays from "./Relays";


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
