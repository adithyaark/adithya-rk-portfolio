export function Lines({ lines, drift = false }: { lines: string[]; drift?: boolean }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className="line" key={line}>
          <span style={{ transitionDelay: `${index * 90}ms` }}>
            {drift ? <span className="drift" data-drift={index % 2 === 0 ? -1 : 1}>{line}</span> : line}
          </span>
        </span>
      ))}
    </>
  );
}
