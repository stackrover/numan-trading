import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Testimonial {
    id: number;
    author_name: string;
    author_position?: string;
    content: string;
    author_image?: string;
    rating?: number;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const API_URL = "/api/v1/testimonials";

const testimonialService = {
    getAll: async (): Promise<Testimonial[]> => {
        const { data } = await axios.get(API_URL);
        return data;
    },

    getOne: async (id: number): Promise<Testimonial> => {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data;
    },

    create: async (testimonial: Partial<Testimonial>): Promise<Testimonial> => {
        const { data } = await axios.post(API_URL, testimonial);
        return data;
    },

    update: async (id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
        const { data } = await axios.put(`${API_URL}/${id}`, testimonial);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
};

export const useTestimonials = () => {
    return useQuery({
        queryKey: ["testimonials"],
        queryFn: testimonialService.getAll,
    });
};

export const useTestimonial = (id: number) => {
    return useQuery({
        queryKey: ["testimonials", id],
        queryFn: () => testimonialService.getOne(id),
        enabled: !!id,
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: testimonialService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Testimonial> }) =>
            testimonialService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            queryClient.invalidateQueries({ queryKey: ["testimonials", variables.id] });
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: testimonialService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
};
