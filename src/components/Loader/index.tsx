import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-white" size={48} />
    </div>
  );
}