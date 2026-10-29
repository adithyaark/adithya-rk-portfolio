"use client";

import { useState } from "react";
import { RollText } from "./RollText";

const links = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <header className="site-header">
      <a className="skip-link" href="#intro">Skip to content</a>
      <div className="header-bar">
        <a className="brand" href="#top" aria-label="ARK, home">
          <RollText text="ARK" />
        </a>

        <nav className="header-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}><RollText text={link.label} /></a>
          ))}
          <a href="/resume" target="_blank" rel="noreferrer"><RollText text="Resume ↗" /></a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>

      <nav className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open}>
        {links.map((link, index) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <span>0{index + 1}</span>{link.label}
          </a>
        ))}
        <a href="/resume" target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
          <span>0{links.length + 1}</span>Resume ↗
        </a>
      </nav>
    </>
  );
}
