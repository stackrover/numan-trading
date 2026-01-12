import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const PartnerApi = {
    list: (params) => axios.get("/v1/partners", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/partners/${id}`).then((res) => res.data),
    create: (data) => axios.post("/v1/partners", data).then((res) => res.data),
    update: (id, data) => axios.put(`/v1/partners/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/partners/${id}`).then((res) => res.data),
};

export const PartnerKeys = {
    all: ["partners"],
    lists: () => [...PartnerKeys.all, "list"],
    list: (params) => [...PartnerKeys.lists(), { params }],
    details: () => [...PartnerKeys.all, "detail"],
    detail: (id) => [...PartnerKeys.details(), id],
};

export const usePartners = (params) => {
    return useQuery({
        queryKey: PartnerKeys.list(params),
        queryFn: () => PartnerApi.list(params),
    });
};

export const usePartner = (id) => {
    return useQuery({
        queryKey: PartnerKeys.detail(id),
        queryFn: () => PartnerApi.get(id),
        enabled: !!id,
    });
};

export const useCreatePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => PartnerApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(PartnerKeys.lists());
            toast.success("Partner created successfully");
        },
    });
};

export const useUpdatePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => PartnerApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(PartnerKeys.lists());
            toast.success("Partner updated successfully");
        },
    });
};

export const useDeletePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => PartnerApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(PartnerKeys.lists());
            toast.success("Partner deleted successfully");
        },
    });
};
