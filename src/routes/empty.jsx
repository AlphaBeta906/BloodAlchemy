import { Link, useLocation } from 'react-router-dom';

export default function Empty() {
    let location = useLocation();
    var links = null;

    switch (location.pathname) {
        case '/':
            links = (
                <div style={{textAlign: "center"}}>
                    <b>Home</b> ● <Link to="/about">About</Link> ● <Link to="/contact">Contact</Link> ● <Link to="/play">Play</Link> ● <Link to="/suggestions">Suggestions</Link> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
        case '/about':
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <b>About</b> ● <Link to="/contact">Contact</Link> ● <Link to="/play">Play</Link> ● <Link to="/suggestions">Suggestions</Link> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
        case '/contact':
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <Link to="/about">About</Link> ● <b>Contact</b> ● <Link to="/play">Play</Link> ● <Link to="/suggestions">Suggestions</Link> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
        case '/play':
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <Link to="/about">About</Link> ● <Link to="/contact">Contact</Link> ● <b>Play</b> ● <Link to="/suggestions">Suggestions</Link> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
        case '/suggestions':
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <Link to="/about">About</Link> ● <Link to="/contact">Contact</Link> ● <Link to="/play">Play</Link> ● <b>Suggestions</b> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
        case '/upgrade':
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <Link to="/about">About</Link> ● <Link to="/contact">Contact</Link> ● <Link to="/play">Play</Link> ● <Link to="/suggestions">Suggestions</Link> ● <b>Upgrade</b>
                </div>
            )
            break;
        default:
            links = (
                <div style={{textAlign: "center"}}>
                    <Link to="/">Home</Link> ● <Link to="/about">About</Link> ● <Link to="/contact">Contact</Link> ● <Link to="/play">Play</Link> ● <Link to="/suggestions">Suggestions</Link> ● <Link to="/upgrade">Upgrade</Link>
                </div>
            )
            break;
    }
        

    return [
        (<div>
            <hr />
            <center>
                <h1 className="logo">Blood Alchemy</h1>
            </center>
        </div>),
        links,
        (<div>
            <hr />
        </div>)
    ]
}