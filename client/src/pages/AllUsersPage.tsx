import Header from "components/AdminHeader/Header";
import UsersTable from "components/AllUsers/Table";
import CheckIfAdmin from "features/CheckIfAdmin";

export default function AllUsersPage(){

    CheckIfAdmin();

    return (
        <>
            <Header/>
            <UsersTable/>
        </>
    )
}