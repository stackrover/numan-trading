import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const BrandApi = {
    list: (params) => axios.get("/v1/brands", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/brands/${id}`).then((res) => res.data),
    create: (data) => axios.post("/v1/brands", data).then((res) => res.data),
    update: (id, data) => axios.put(`/v1/brands/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/brands/${id}`).then((res) => res.data),
};

export const BrandKeys = {
    all: ["brands"],
    lists: () => [...BrandKeys.all, "list"],
    list: (params) => [...BrandKeys.lists(), { params }],
    details: () => [...BrandKeys.all, "detail"],
    detail: (id) => [...BrandKeys.details(), id],
};

export const useBrands = (params) => {
    return useQuery({
        queryKey: BrandKeys.list(params),
        queryFn: () => BrandApi.list(params),
    });
};

export const useBrand = (id) => {
    return useQuery({
        queryKey: BrandKeys.detail(id),
        queryFn: () => BrandApi.get(id),
        enabled: !!id,
    });
};

export const useCreateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => BrandApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(BrandKeys.lists());
            toast.success("Brand created successfully");
        },
    });
};

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => BrandApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(BrandKeys.all);
            toast.success("Brand updated successfully");
        },
    });
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => BrandApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(BrandKeys.lists());
            toast.success("Brand deleted successfully");
        },
    });
};
