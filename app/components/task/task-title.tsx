import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();
  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Title updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {isEditing ? (
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className="text-xl font-semibold">{title}</h2>
      )}

      {isEditing ? (
        <>
          <Button
            className="py-0"
            size="sm"
            onClick={updateTitle}
            disabled={isPending}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            className="py-0"
            size="sm"
            onClick={() => {
              setIsEditing(false);
              setNewTitle(title);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Edit
          className="size-3 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};