import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageKeys } from "./page.service";
import { useParams } from "react-router";


export const BlocksApi = {
  create: (blockData) => axios.post(`/blocks`, blockData),
  update: (blockId, blockData) => axios.put(`/blocks/${blockId}`, blockData),
  delete: (blockId) => axios.delete(`/blocks/${blockId}`),
}

/************************/
/****** Mutations *******/
export const useCreateBlock = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BlocksApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Block created successfully");
    }
  });
}

export const useUpdateBlock = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blockId, blockData }) => BlocksApi.update(blockId, blockData),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Block updated successfully");
    }
  });
}

export const useDeleteBlock = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blockId) => BlocksApi.delete(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Block deleted successfully");
    }
  });
}