import { useEffect } from "react";
import { BackButton } from "@/components/back-button";
import { createPageMeta } from "@/lib/meta";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProjectSchema,
  type UpdateProjectFormData,
} from "@/lib/schema";
import { ProjectStatus, type Project, type Task } from "@/types";
import { UseProjectQuery, UseUpdateProject } from "@/hooks/use-project";
import { toast } from "sonner";
import { useParams } from "react-router";

export const meta = () =>
  createPageMeta(
    "Project Settings",
    "Configure project preferences and controls."
  );


const ProjectSetting = () => {
  const { projectId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data?: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  const project = data?.project;

  const form = useForm<UpdateProjectFormData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      status: project?.status ?? ProjectStatus.PLANNING,
      startDate: project?.startDate ? new Date(project.startDate).toISOString() : "",
      dueDate: project?.dueDate ? new Date(project.dueDate).toISOString() : "",
      tags: Array.isArray(project?.tags)
        ? project.tags.join(", ")
        : project?.tags ?? "",
    },
  });

  const { mutate, isPending } = UseUpdateProject();

  const onSubmit = (values: UpdateProjectFormData) => {
    if (!projectId) return;
    mutate(
      {
        projectData: values,
        projectId,
      },
      {
        onSuccess: () => {
          toast.success("Project updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-card border rounded-lg p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Project tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="bg-card border rounded-lg p-6 shadow-sm mb-6 space-y-12">
        <div>
          <BackButton />

          <h3 className="text-lg font-medium mt-3">Project Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your project details or delete the project.
          </p>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Project title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Project description"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select project status" />
                        </SelectTrigger>

                        <SelectContent>
                          {Object.values(ProjectStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                            className={`w-full justify-start text-left font-normal${
                              !field.value ? " text-muted-foreground" : ""
                            }`}
                            >
                              <CalendarIcon className="size-4 mr-2 text-muted-foreground" />
                              {field.value ? (
                                format(new Date(field.value), "MM/dd/yyyy")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(
                                  date?.toISOString() || undefined
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                            className={`w-full justify-start text-left font-normal${
                              !field.value ? " text-muted-foreground" : ""
                            }`}
                            >
                              <CalendarIcon className="size-4 mr-2 text-muted-foreground" />
                              {field.value ? (
                                format(new Date(field.value), "MM/dd/yyyy")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(
                                  date?.toISOString() || undefined
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tags separated by comma (e.g. web, mobile, backend)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-fit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;
