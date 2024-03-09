import CheckIfAdmin from 'features/CheckIfAdmin';
import './Header.css';
import Logo from "./Logo";
import Sections from './Section';
import UserAvatar from "./UserAvatar";

export default function Header() {

    CheckIfAdmin();

    return (
        <header>
            <Logo/>
            <Sections/>
            <UserAvatar/>
        </header>
    )
}