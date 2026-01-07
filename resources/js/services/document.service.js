import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DocumentApi = {
    list: (queries) => axios.get("/documents", {
        params: queries
    }).then(res => res.data),
    get: (id) => axios.get(`/documents/${id}`).then(res => res.data),
    create: (data) => axios.post("/documents", data).then(res => res.data),
    update: (id, data) => axios.put(`/documents/${id}`, data).then(res => res.data),
    delete: (id) => axios.delete(`/documents/${id}`).then(res => res.data),
    restore: (id) => axios.post(`/documents/${id}/restore`).then(res => res.data),
    forceDelete: (id) => axios.delete(`/documents/${id}/permanent`).then(res => res.data),
    savePageDocument: (data) => axios.post("/documents/save-page", data).then(res => res.data),
}

export const DocumentKeys = {
    all: ["documents"],
    lists: () => [...DocumentKeys.all, "list"],
    list: (filters) => [...DocumentKeys.lists(), { filters }],
    details: () => [...DocumentKeys.all, "detail"],
    detail: (id) => [...DocumentKeys.details(), id],
}


/***************************/
/********* Queries *********/
export const useDocuments = (queries) => {
    return useQuery({
        queryKey: DocumentKeys.list(queries),
        queryFn: () => DocumentApi.list(queries),
    })
}

export const useDocument = (id) => {
    return useQuery({
        queryKey: DocumentKeys.detail(id),
        queryFn: () => DocumentApi.get(id),
        enabled: !!id,
    })
}


/*****************************/
/********* Mutations *********/
export const useCreateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => DocumentApi.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Document created successfully");
        }
    })
}

export const useUpdateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => DocumentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Document updated successfully");
        }
    })
}

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => DocumentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Document deleted successfully");
        }
    })
}

export const useRestoreDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => DocumentApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Document restored successfully");
        }
    })
}

export const useForceDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => DocumentApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Document permanently deleted");
        }
    })
}

export const useSavePageDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => DocumentApi.savePageDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries(DocumentKeys.lists());
            toast.success("Page content saved successfully");
        }
    })
}

