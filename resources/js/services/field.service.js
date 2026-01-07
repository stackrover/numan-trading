import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageKeys } from "./page.service";
import { useParams } from "react-router";


export const FieldApi = {
  create: (fieldData) => axios.post("/fields", fieldData),
  update: (fieldId, fieldData) => axios.put(`/fields/${fieldId}`, fieldData),
  delete: (fieldId) => axios.delete(`/fields/${fieldId}`),
}


/*****************************/
/********* Mutations *********/
export const useCreateField = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: FieldApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Field created successfully");
    }
  })
}


export const useUpdateField = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fieldId, fieldData }) => FieldApi.update(fieldId, fieldData),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Field updated successfully");
    }
  })
}


export const useDeleteField = () => {
  const { slug: pageSlug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fieldId) => FieldApi.delete(fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.details(pageSlug));
      toast.success("Field deleted successfully");
    }
  })
}