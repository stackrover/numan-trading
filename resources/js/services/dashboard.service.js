import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const DashboardApi = {
    getStats: (params) => axios.get("/dashboard", { params }).then((res) => res.data),
};

export const DashboardKeys = {
    all: ["dashboard"],
    stats: (params) => [...DashboardKeys.all, "stats", params],
};

export const useDashboardStats = (params) => {
    return useQuery({
        queryKey: DashboardKeys.stats(params),
        queryFn: () => DashboardApi.getStats(params),
    });
};
