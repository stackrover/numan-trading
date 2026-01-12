import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const TestimonialApi = {
    list: (params) => axios.get("/v1/testimonials", { params }).then((res) => res.data),
    get: (id) => axios.get(`/v1/testimonials/${id}`).then((res) => res.data),
    create: (data) => axios.post("/v1/testimonials", data).then((res) => res.data),
    update: (id, data) => axios.put(`/v1/testimonials/${id}`, data).then((res) => res.data),
    delete: (id) => axios.delete(`/v1/testimonials/${id}`).then((res) => res.data),
};

export const TestimonialKeys = {
    all: ["testimonials"],
    lists: () => [...TestimonialKeys.all, "list"],
    list: (params) => [...TestimonialKeys.lists(), { params }],
    details: () => [...TestimonialKeys.all, "detail"],
    detail: (id) => [...TestimonialKeys.details(), id],
};

export const useTestimonials = (params) => {
    return useQuery({
        queryKey: TestimonialKeys.list(params),
        queryFn: () => TestimonialApi.list(params),
    });
};

export const useTestimonial = (id) => {
    return useQuery({
        queryKey: TestimonialKeys.detail(id),
        queryFn: () => TestimonialApi.get(id),
        enabled: !!id,
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => TestimonialApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(TestimonialKeys.lists());
            toast.success("Testimonial created successfully");
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => TestimonialApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(TestimonialKeys.lists());
            toast.success("Testimonial updated successfully");
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => TestimonialApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(TestimonialKeys.lists());
            toast.success("Testimonial deleted successfully");
        },
    });
};
