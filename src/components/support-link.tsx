"use client";

import { useRef, useSyncExternalStore, type MouseEvent } from "react";

const emptySubscribe = () => () => {};

// Built in the browser from parts, so no served HTML or bundle carries the
// address whole for a scraper to find. The minifier folds constant joins, so
// the separator comes from a map it leaves alone. The server renders the link
// bare.
export const supportAddress = () => {
  const at = [63].map((code) => String.fromCharCode(code + 1)).join("");
  return ["support+brit-ready", "beansontoast.app"].join(at);
};

// The scheme is assembled the same way, so the bundle never spells it out.
const scheme = () => ["mail", "to"].map((part) => part).join("");

const mailUrl = (query = "") => [scheme(), supportAddress() + query].join(":");

// The note becomes a pre-filled message in the visitor's mail app. Nothing is
// sent from the page.
export const composeSupportMail = (name: string, message: string) => {
  const from = name.trim();
  const text = message.trim();
  const subject = from ? `Brit Ready support, from ${from}` : "Brit Ready support";
  const body = from ? `${text}\n\n${from}` : text;
  return mailUrl(
    `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
};

// A modifier click means "do what links do", so it keeps the plain address.
const opensElsewhere = (event: MouseEvent) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const fieldClass =
  "rounded-xl border border-border bg-card-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-faint";

export const SupportLink = () => {
  const address = useSyncExternalStore(emptySubscribe, supportAddress, () => null);
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    const element = dialog.current;
    if (!element || typeof element.showModal !== "function") return;
    if (opensElsewhere(event)) return;
    event.preventDefault();
    element.returnValue = "";
    element.showModal();
  };

  const closed = () => {
    const element = dialog.current;
    const fields = form.current;
    if (!element || !fields || element.returnValue !== "send") return;
    const data = new FormData(fields);
    window.location.href = composeSupportMail(
      String(data.get("name") ?? ""),
      String(data.get("message") ?? ""),
    );
    fields.reset();
  };

  return (
    <>
      <a
        href={address ? mailUrl() : undefined}
        onClick={open}
        className="cursor-pointer underline-offset-2 hover:text-fg hover:underline"
      >
        Get support
      </a>
      <dialog
        ref={dialog}
        aria-labelledby="support-title"
        onClose={closed}
        // A click on the backdrop lands on the dialog itself; the card is the form.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-border bg-bg p-0 text-left text-fg shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      >
        <form ref={form} method="dialog" className="flex flex-col gap-4 p-5">
          <div>
            <h2 id="support-title" className="text-2xl font-extrabold tracking-tight">
              Get support
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Write it here and your mail app opens with it, ready to send. Nothing leaves
              this page.
            </p>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Your name (optional)</span>
            <input name="name" autoComplete="name" maxLength={80} className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>What&rsquo;s up?</span>
            <textarea
              name="message"
              rows={5}
              required
              maxLength={2000}
              className={`${fieldClass} resize-y`}
            />
          </label>
          <div className="mt-1 flex flex-wrap justify-end gap-3">
            <button
              type="submit"
              value="cancel"
              formNoValidate
              className="rounded-xl border border-border bg-card-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-card"
            >
              Not now
            </button>
            <button
              type="submit"
              value="send"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-deep"
            >
              Open in my mail app
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
