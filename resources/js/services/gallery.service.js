import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const GalleryApi = {
    list: (params) => axios.get("/v1/gallery", { params }).then((res) => res.data),
    create: (formData) => {
        return axios.post("/v1/gallery", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => res.data);
    },
    update: (id, data) => axios.put(`/v1/gallery/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/gallery/${id}`).then((res) => res.data),
};

export const GalleryKeys = {
    all: ["gallery"],
    lists: () => [...GalleryKeys.all, "list"],
};

export const useGallery = (params) => {
    return useQuery({
        queryKey: [...GalleryKeys.lists(), params],
        queryFn: () => GalleryApi.list(params),
    });
};

export const useCreateGallery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => GalleryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(GalleryKeys.lists());
            toast.success("Images uploaded successfully");
        },
        onError: (error) => {
            toast.error("Failed to upload images");
            console.error(error);
        }
    });
};

export const useUpdateGallery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => GalleryApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(GalleryKeys.lists());
            toast.success("Image updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update image");
            console.error(error);
        }
    });
};

export const useDeleteGallery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => GalleryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(GalleryKeys.lists());
            toast.success("Image deleted successfully");
        },
    });
};
