// Letters roll up on hover of the nearest link, revealing a copy drawn
// beneath each one with text-shadow; screen readers get the plain text.
export function RollText({ text }: { text: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      <span className="roll-letters" aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties}>
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
