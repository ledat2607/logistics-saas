import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export const TripCodeCopyButton = ({
  tripCode,
}: {
  tripCode: string | null;
}) => {
  const [copied, setCopied] = useState(false);

  if (!tripCode) return <span className="text-slate-400">N/A</span>;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tripCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Lỗi khi copy mã:", err);
    }
  };

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/70 px-2 py-1 rounded-md">
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-slate-200/60 rounded transition-colors text-slate-500 hover:text-slate-800"
        title="Sao chép mã chuyến đi"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {copied && (
        <span className="text-[10px] text-emerald-600 font-semibold ml-0.5">
          Đã chép!
        </span>
      )}
    </div>
  );
};
