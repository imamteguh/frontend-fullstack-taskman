import { Loader as LoaderIcon } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-[#f9fafb] p-4 rounded-2xl shadow-md">
        <LoaderIcon className="w-10 h-10 animate-spin" />
      </div>
    </div>
  );
};