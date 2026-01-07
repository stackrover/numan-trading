import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const PageApi = {
  list: (queries) => axios.get("/v1/pages", {
    params: queries
  }).then(res => res.data),
  get: (id) => axios.get(`/v1/pages/${id}`).then(res => res.data),
  create: (data) => axios.post("/v1/pages", data).then(res => res.data),
  update: (id, data) => axios.put(`/v1/pages/${id}`, data).then(res => res.data),
  delete: (id) => axios.delete(`/v1/pages/${id}`).then(res => res.data),
  updateSeo: (slug, data) => {
    return axios.put(`/v1/pages/${slug}/seo`, data);
  },
}

export const PageKeys = {
  all: ["pages"],
  lists: () => [...PageKeys.all, "list"],
  list: (filters) => [...PageKeys.lists(), { filters }],
  details: () => [...PageKeys.all, "detail"],
  detail: (id) => [...PageKeys.details(), id],
}


/***************************/
/********* Queries *********/
export const usePages = (queries) => {
  return useQuery({
    queryKey: PageKeys.list(queries),
    queryFn: () => PageApi.list(queries),
  })
}

export const usePage = (id) => {
  return useQuery({
    queryKey: PageKeys.detail(id),
    queryFn: () => PageApi.get(id),
    enabled: !!id,
  })
}


/*****************************/
/********* Mutations *********/
export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => PageApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(PageKeys.lists());
      toast.success("Page created successfully");
    }
  })
}

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => PageApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.lists());
      toast.success("Page updated successfully");
    }
  })
}

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => PageApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.lists());
      toast.success("Page deleted successfully");
    }
  })
}


/***************************/
/********* SEO Mutations *******/
export const useUpdateSeoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => PageApi.updateSeo(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries(PageKeys.all);
      toast.success("SEO settings updated successfully");
    }
  })
}