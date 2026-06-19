import { Coffee } from "lucide-react";

// Clean Ko-fi support link (Ko-fi blue). Equivalent to the kofiwidget2 button
// but without its document.write script, which is unsafe in React/SSR.
export const KofiButton = ({ className }: { className?: string }) => (
  <a
    href="https://ko-fi.com/B4I421NYZC"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform active:translate-y-[1px] ${className ?? ""}`}
    style={{ backgroundColor: "#72a4f2" }}
  >
    <Coffee size={16} /> Support me on Ko-fi
  </a>
);
