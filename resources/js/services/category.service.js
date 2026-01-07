import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CategoryApi = {
    list: (params) => axios.get("/v1/categories", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/categories/${id}`).then((res) => res.data),
    create: (data) => axios.post("/v1/categories", data).then((res) => res.data),
    update: (id, data) => axios.put(`/v1/categories/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/categories/${id}`).then((res) => res.data),
};

export const CategoryKeys = {
    all: ["categories"],
    lists: () => [...CategoryKeys.all, "list"],
    list: (params) => [...CategoryKeys.lists(), { params }],
    details: () => [...CategoryKeys.all, "detail"],
    detail: (id) => [...CategoryKeys.details(), id],
};

export const useCategories = (params) => {
    return useQuery({
        queryKey: CategoryKeys.list(params),
        queryFn: () => CategoryApi.list(params),
    });
};

export const useCategory = (id) => {
    return useQuery({
        queryKey: CategoryKeys.detail(id),
        queryFn: () => CategoryApi.get(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => CategoryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(CategoryKeys.lists());
            toast.success("Category created successfully");
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => CategoryApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(CategoryKeys.all);
            toast.success("Category updated successfully");
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => CategoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(CategoryKeys.lists());
            toast.success("Category deleted successfully");
        },
    });
};
