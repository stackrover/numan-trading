import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ImageCategoryApi = {
    list: () => axios.get("/v1/image-categories").then((res) => res.data),
    create: (data) => axios.post("/v1/image-categories", data).then((res) => res.data),
};

export const ImageCategoryKeys = {
    all: ["image-categories"],
    lists: () => [...ImageCategoryKeys.all, "list"],
};

export const useImageCategories = () => {
    return useQuery({
        queryKey: ImageCategoryKeys.lists(),
        queryFn: ImageCategoryApi.list,
    });
};

export const useCreateImageCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => ImageCategoryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(ImageCategoryKeys.lists());
            toast.success("Category created successfully");
        },
    });
};
