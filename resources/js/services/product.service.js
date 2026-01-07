import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ProductApi = {
    list: (params) => axios.get("/v1/products", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/products/${id}`).then((res) => res.data),
    create: (data) => axios.post("/v1/products", data).then((res) => res.data),
    update: (id, data) => axios.put(`/v1/products/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/products/${id}`).then((res) => res.data),
};

export const ProductKeys = {
    all: ["products"],
    lists: () => [...ProductKeys.all, "list"],
    list: (params) => [...ProductKeys.lists(), { params }],
    details: () => [...ProductKeys.all, "detail"],
    detail: (id) => [...ProductKeys.details(), id],
};

export const useProducts = (params) => {
    return useQuery({
        queryKey: ProductKeys.list(params),
        queryFn: () => ProductApi.list(params),
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ProductKeys.detail(id),
        queryFn: () => ProductApi.get(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => ProductApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(ProductKeys.lists());
            toast.success("Product created successfully");
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => ProductApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(ProductKeys.all);
            toast.success("Product updated successfully");
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => ProductApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(ProductKeys.lists());
            toast.success("Product deleted successfully");
        },
    });
};
