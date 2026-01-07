import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// query functions
export const AuthApi = {
    me: () => axios.get("/auth/me", { baseURL: "/" }).then((res) => res.data),
    login: (data) => axios.post("/login", data, { baseURL: "/" }).then((res) => res.data),
    register: (data) => axios.post("/register", data, { baseURL: "/" }).then((res) => res.data),
    logout: () => axios.post("/logout", {}, { baseURL: "/" }).then((res) => res.data),
    forgotPassword: (data) => axios.post("/forgot-password", data, { baseURL: "/" }).then((res) => res.data),
    resetPassword: (data) => axios.post("/reset-password", data, { baseURL: "/" }).then((res) => res.data),
};
// validation keys for react-query
export const authKeys = {
    me: ["auth", "me"],
};

/******************************/
/*********** Queries **********/

export const useAuthQuery = () => {
    const navigate = useNavigate();
    return useQuery({
        queryKey: authKeys.me,
        queryFn: AuthApi.me,
        retry: false,
        onError: () => {
            navigate("/login");
        },
    });
};

/********************************/
/*********** Mutations **********/
export const useLoginMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.login,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
            toast.success(data.message || "Login successful");
            navigate("/");
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Login failed";
                toast.error(message);
            }
        },
    });
};

export const useRegisterMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.register,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
            toast.success(data.message || "Registration successful");
            navigate("/");
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Registration failed";
                toast.error(message);
            }
        },
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: AuthApi.forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset link sent to your email");
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to send reset link";
                toast.error(message);
            }
        },
    });
};

export const useResetPasswordMutation = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: AuthApi.resetPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successful");
            navigate("/login");
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to reset password";
                toast.error(message);
            }
        },
    });
};

export const useLogoutMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
            toast.success("Logged out successfully");
            navigate("/login");
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Logout failed";
                toast.error(message);
            }
        },
    });
};
