import { Avatar, Button, IconButton, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetAvatar from "components/CreateAvatar";
import React from "react";
import axios from "axios";

export default function UserAvatar() {

    const navigate = useNavigate();

    const user_name = localStorage.getItem('user_name') || '';

    function login(){
        navigate('/login')
    }

    return (
        <div>
            {
                user_name ?
                <AvatarComponent user_name={user_name}/>:
                <Button onClick={login}>
                    Войти
                </Button>
            }
        </div>
    );
}

function AvatarComponent({user_name}: {user_name: string}) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    function logout(){
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = '';
        navigate('/login');
    }

    const is_admin = localStorage.getItem('user') === 'admin';

    return (
        <>
            <IconButton onClick={handleClick}>
                <GetAvatar name={user_name}/> 
            </IconButton>
            <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
            >
                {
                    is_admin ? 
                    <div className="d-flex fd-column">
                        <Button onClick={logout} id="header-avatar-button">Выход</Button>
                        <Button onClick={() => navigate('/create_user')} id="header-admin-button"
                        sx={{textTransform: "none"}}
                        >
                            Админка
                        </Button>
                    </div> :
                    <Button onClick={logout} id="header-avatar-button">Выход</Button>
                }
            </Popover>
        </>
    )
}