import { AlertTriangle, Loader2, Pencil, Trash2 } from "lucide-react";
import Modal from "../../ui/modal";
import { useState } from "react";
import { Progress } from "@prisma/client";
import { buttonVariants } from "../../ui/button";
import { toast } from "../../ui/toast";
import { delete_progress } from "../../../lib/fetch/statistics/log-progress/progress";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  progress: Progress;
};

export default function DeleteProgress({ progress }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);

  const router = useRouter();
  async function deleteProgress(progress_id: number) {
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";

      await delete_progress({
        access_token,
        progress_id,
      });

      toast({
        message: "progress deleted",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      toast({
        message:
          "You did everything right - but we could not log your progress",
        title: "Server Error",
        type: "error",
      });
      return;
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <button
        className={buttonVariants({ variant: "ghost", size: "sm" })}
        onClick={() => setOpenWarning(true)}
      >
        <Trash2 className="w-4 h-4  hover:text-red-500 text-red-300" />
      </button>
      <Modal
        title="delete progress"
        isOpen={openWarning}
        setIsOpen={setOpenWarning}
      >
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Delete this progress
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete? this action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center gap-3 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={() => {
              deleteProgress(progress.progress_id);
            }}
          >
            {isLoading ? (
              <Loader2 className=" h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5  text-white group-hover:text-red-800  " />
            )}
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setOpenWarning(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
