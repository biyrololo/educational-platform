import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckIfAdmin() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("user") !== "admin") {
            navigate("/admin_login");
        }
    }, [navigate]);
}