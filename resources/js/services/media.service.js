import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const MediaApi = {
    list: (queries) => axios.get("/media", {
        params: queries
    }).then(res => res.data),
    get: (id) => axios.get(`/media/${id}`).then(res => res.data),
    upload: (formData) => axios.post("/media", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(res => res.data),
    update: (id, data) => axios.put(`/media/${id}`, data).then(res => res.data),
    delete: (id) => axios.delete(`/media/${id}`).then(res => res.data),
}

export const MediaKeys = {
    all: ["media"],
    lists: () => [...MediaKeys.all, "list"],
    list: (filters) => [...MediaKeys.lists(), { filters }],
    details: () => [...MediaKeys.all, "detail"],
    detail: (id) => [...MediaKeys.details(), id],
}


/***************************/
/********* Queries *********/
export const useMedia = (queries) => {
    return useQuery({
        queryKey: MediaKeys.list(queries),
        queryFn: () => MediaApi.list(queries),
    })
}

export const useMediaItem = (id) => {
    return useQuery({
        queryKey: MediaKeys.detail(id),
        queryFn: () => MediaApi.get(id),
        enabled: !!id,
    })
}


/*****************************/
/********* Mutations *********/
export const useUploadMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => MediaApi.upload(formData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(MediaKeys.lists());
            toast.success("Media uploaded successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to upload media");
        }
    })
}

export const useUpdateMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => MediaApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(MediaKeys.lists());
            toast.success("Media updated successfully");
        }
    })
}

export const useDeleteMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => MediaApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(MediaKeys.lists());
            toast.success("Media deleted successfully");
        }
    })
}
