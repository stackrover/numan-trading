import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const DashboardApi = {
    getStats: () => axios.get("/dashboard/stats").then((res) => res.data),
};

export const DashboardKeys = {
    all: ["dashboard"],
    stats: () => [...DashboardKeys.all, "stats"],
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: DashboardKeys.stats(),
        queryFn: DashboardApi.getStats,
    });
};
