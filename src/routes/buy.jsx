import { useForm } from "react-hook-form";

export default function Buy() {
    const { register, handleSubmit } = useForm();
    const [result, setResult] = useState("...");

    return (
        <div>
            <center>
                <h1>Buy</h1>
            </center>
            <center>You wanna buy something?</center>
            <center>It costs 900 watts.</center>
        </div>
    );
}