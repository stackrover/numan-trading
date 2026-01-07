import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const EnquiryApi = {
    list: (params) => axios.get("/v1/enquiries", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/enquiries/${id}`).then((res) => res.data),
    reply: (id, data) => axios.post(`/v1/enquiries/${id}/reply`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/enquiries/${id}`).then((res) => res.data),
};

export const EnquiryKeys = {
    all: ["enquiries"],
    lists: () => [...EnquiryKeys.all, "list"],
    list: (params) => [...EnquiryKeys.lists(), { params }],
    details: () => [...EnquiryKeys.all, "detail"],
    detail: (id) => [...EnquiryKeys.details(), id],
};

export const useEnquiries = (params) => {
    return useQuery({
        queryKey: EnquiryKeys.list(params),
        queryFn: () => EnquiryApi.list(params),
    });
};

export const useEnquiry = (id) => {
    return useQuery({
        queryKey: EnquiryKeys.detail(id),
        queryFn: () => EnquiryApi.get(id),
        enabled: !!id,
    });
};

export const useReplyEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => EnquiryApi.reply(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(EnquiryKeys.all);
            toast.success("Reply recorded successfully");
        },
    });
};
