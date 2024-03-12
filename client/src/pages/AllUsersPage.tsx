import Header from "components/AdminHeader/Header";
import DownloadUsers from "components/AllUsers/DownloadUsers";
import UsersTable from "components/AllUsers/Table";
import CheckIfAdmin from "features/CheckIfAdmin";

export default function AllUsersPage(){

    CheckIfAdmin();

    return (
        <>
            <Header/>
            <main>
                <DownloadUsers/>
                <UsersTable/>
            </main>
        </>
    )
}