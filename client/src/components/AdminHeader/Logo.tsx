import { useNavigate } from "react-router-dom";

export default function Logo() {

    const navigate = useNavigate();

    function goHome() {
        navigate('/');
    }

    return (
        <div onClick={goHome}
        style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
        }}
        >
            <img src="static/logo.png" alt="" 
            style={{width: 25, height: 25}}
            />
            <h2>
                Brl Edu Admin
            </h2>
        </div>
    );
}