import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full absolute bg-white bg-opacity-30 flex items-center justify-center  top-0 bottom-0 left-0 right-0">
      <Loader2 className="w-6 h-6 bg-green-600 animate-spin  " />
    </div>
  );
}
