import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/providers/auth.provider";

export default function AuthRoutesLayout() {
    const navigate = useNavigate();
    const { auth, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        if (auth) navigate("/");
    }, [auth, isLoading, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Outlet />
        </>
    );
}
