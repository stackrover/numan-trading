import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Team {
    id: number;
    name: string;
    position: string;
    avatar: string;
    social_links?: Record<string, string>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const API_URL = "/api/v1/teams";

const teamService = {
    getAll: async (): Promise<Team[]> => {
        const { data } = await axios.get(API_URL);
        return data;
    },

    getOne: async (id: number): Promise<Team> => {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data;
    },

    create: async (team: Partial<Team>): Promise<Team> => {
        const { data } = await axios.post(API_URL, team);
        return data;
    },

    update: async (id: number, team: Partial<Team>): Promise<Team> => {
        const { data } = await axios.put(`${API_URL}/${id}`, team);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
};

export const useTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: teamService.getAll,
    });
};

export const useTeam = (id: number) => {
    return useQuery({
        queryKey: ["teams", id],
        queryFn: () => teamService.getOne(id),
        enabled: !!id,
    });
};

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teamService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });
};

export const useUpdateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Team> }) =>
            teamService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            queryClient.invalidateQueries({ queryKey: ["teams", variables.id] });
        },
    });
};

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teamService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });
};
