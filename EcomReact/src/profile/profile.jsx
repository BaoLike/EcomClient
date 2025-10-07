import AdminLayout from "../admin/AdminLayout";
import UserProfile from "./userProfile";

const Profile = () => {
    const inforUser = JSON.parse(localStorage.getItem("auth"));
    const roleUser = inforUser["roles"];
    if(roleUser.includes("ROLE_ADMIN")){
        return <AdminLayout/>
    }
    else{
        return <UserProfile/>
    }
}
export default Profile