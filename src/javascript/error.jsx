export default function Error(props) {
    var status = props.status;
    var desk = "";

    switch (status) {
        case "204":
            desk = "You already signed in!";
            break;
        case "400":
            desk = "Add all of the required arguments!";
            break;
        case "401":
            desk = "You are not logged in!";
            break;
        case "404":
            desk = "Are you in the right place, bro?";
            break;
        case "500":
            desk = "I had a headache and I have no idea what happened.";
            break;
        default:
            desk = "Generic error message (Alpha forgot to add this in).";
            break;
    }

    return (
        <div style={{textAlign: "center"}}>
            <br /><br />
            <div className="status" style={{fontSize:100}}>{status}</div><br />
            <div className="desk" style={{fontSize: 50}}>{desk}</div>
            <br /><br />
        </div>
    );
}