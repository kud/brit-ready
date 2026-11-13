import { cn } from "@/lib/utils";
import { SupportLink } from "./support-link";

// Who makes this and where to get help: quiet, at the very end of a page.
export const SiteFooter = ({ className }: { className?: string }) => (
  <footer className={cn("site-footer px-5 py-6 text-center text-xs text-faint", className)}>
    <div>
      Made by{" "}
      <a
        href="https://beansontoast.app"
        className="underline-offset-2 hover:text-fg hover:underline"
      >
        beansontoast.app
      </a>{" "}
      · <SupportLink />
    </div>
  </footer>
);
