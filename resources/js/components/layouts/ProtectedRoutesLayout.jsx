import { Outlet } from "react-router";

export default function ProtectedRoutesLayout() {
    return (
        <>
            <Outlet />
        </>
    );
}
