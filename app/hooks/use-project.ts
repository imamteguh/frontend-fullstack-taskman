import type { CreateProjectFormData } from "@/components/project/create-project";
import type { UpdateProjectFormData } from "@/lib/schema";
import { fetchData, postData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};

export const UseProjectDetailQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["projectId", projectId],
    queryFn: () => fetchData(`/projects/${projectId}`),
  });
};

export const UseUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      projectData: UpdateProjectFormData;
    }) => updateData(`/projects/${data.projectId}`, data.projectData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectId", variables.projectId],
      });
    },
  });
};