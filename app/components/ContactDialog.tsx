"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Arrow } from "./Arrow";

// Web3Forms access keys are public by design; set it in .env.local.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactDialog({ email }: { email: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const open = () => {
    if (dialogRef.current?.open) return;
    dialogRef.current?.showModal();
    document.documentElement.classList.add("dialog-open");
  };

  // The contact knot asks for the dialog when its thread is pulled.
  useEffect(() => {
    window.addEventListener("talk:open", open);
    return () => window.removeEventListener("talk:open", open);
  });

  const close = () => dialogRef.current?.close();

  const onClose = () => {
    document.documentElement.classList.remove("dialog-open");
    setStatus((current) => (current === "sent" || current === "error" ? "idle" : current));
  };

  // A click that lands on the <dialog> itself (not its content) is on the backdrop.
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return;

    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Portfolio enquiry from ${name}`;

    if (!ACCESS_KEY) {
      const body = `${message}\n\n— ${name} (${from})`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: ACCESS_KEY, subject, from_name: "Portfolio contact form", name, email: from, message }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button className="talk-trigger" type="button" onClick={open}>
        Let&apos;s talk. <Arrow diagonal />
      </button>

      <dialog className="talk" ref={dialogRef} onClose={onClose} onClick={onBackdropClick} aria-labelledby="talk-title">
        <div className="talk-inner">
          <button className="talk-close" type="button" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>

          <div className="talk-intro">
            <h2 className="display talk-title" id="talk-title">Let&apos;s<span>talk.</span></h2>
            <p>A problem, a dataset,<br />a research idea.</p>
          </div>

          {status === "sent" ? (
            <div className="talk-sent" role="status">
              <span>Message sent</span>
              <p>Thanks — it&apos;s in my inbox. I&apos;ll get back to you soon.</p>
              <button className="talk-send" type="button" onClick={close}>Close <Arrow diagonal /></button>
            </div>
          ) : (
            <form className="talk-form" onSubmit={submit}>
              <label className="talk-field">
                <span>Your name</span>
                <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
              </label>
              <label className="talk-field">
                <span>Your email</span>
                <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              </label>
              <label className="talk-field talk-field-wide">
                <span>What&apos;s on your mind?</span>
                <textarea name="message" rows={5} placeholder="A problem, an idea, or something you're figuring out." required />
              </label>
              <input className="talk-honeypot" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="talk-footer">
                <p className="talk-status" role="status">
                  {status === "error" && <>Something went wrong. Email me at <a href={`mailto:${email}`}>{email}</a>.</>}
                </p>
                <button className="talk-send" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"} <Arrow diagonal />
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
