export default function Alert(props) {
    let { type, message } = props;

    switch (type) {
        case "error":
            return (
                <div className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 w-64" role="alert">
                    <p className="font-bold">🛑 Error 🛑</p>
                    <p className="text-sm">{message}</p>
                </div>
            );
        case "info":
            return (
                <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-64" role="alert">
                    <p className="font-bold">ℹ️ Info ℹ️</p>
                    <p className="text-sm">{message}</p>
                </div>
            );
        case "success":
            return (
                <div className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 w-64" role="alert">
                    <p className="font-bold">✅ Success ✅</p>
                    <p className="text-sm">{message}</p>
                </div>
            );
        case "warning":
            return (
                <div className="bg-yellow-100 border-t border-b border-yellow-500 text-yellow-700 px-4 py-3 w-64" role="alert">
                    <p className="font-bold">⚠️ Warning ⚠️</p>
                    <p className="text-sm">{message}</p>
                </div>
            );
        default:
            return (
                <div className="bg-gray-100 border-t border-b border-gray-500 text-gray-700 px-4 py-3 w-64" role="alert">
                    <p className="font-bold">💬 Unknown 💬</p>
                    <p className="text-sm">{message}</p>
                </div>
            )
    }
}