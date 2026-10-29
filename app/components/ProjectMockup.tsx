const sources = [
  { name: "clinical_guidelines.pdf", score: 0.91 },
  { name: "cardiology_handbook.pdf", score: 0.87 },
  { name: "patient_faq.md", score: 0.74 },
];

function DocAssistMock() {
  return (
    <div className="mock mock-doc">
      <div className="mock-bar"><span>docassist / session</span><span className="mock-live">retrieval on</span></div>
      <div className="mock-query mock-step" style={{ "--step": 0 } as React.CSSProperties}>
        <span>Query</span>
        What is the first-line approach for mild hypertension?
      </div>
      <div className="mock-sources">
        {sources.map((source, index) => (
          <div className="mock-source mock-step" key={source.name} style={{ "--step": index + 1 } as React.CSSProperties}>
            <span>[{index + 1}]</span>
            <b>{source.name}</b>
            <i>{source.score.toFixed(2)}</i>
            <em style={{ "--score": source.score } as React.CSSProperties} />
          </div>
        ))}
      </div>
      <div className="mock-answer mock-step" style={{ "--step": 4 } as React.CSSProperties}>
        <span>Grounded answer</span>
        <p>
          Start with lifestyle changes — diet, activity, reduced sodium <sup>[1]</sup> — and
          move to guideline-recommended medication if targets aren&apos;t met <sup>[2]</sup>.
          <i className="mock-cursor" />
        </p>
      </div>
    </div>
  );
}

const rubric = [
  { label: "Defines memorisation of training data", points: "+3" },
  { label: "Explains the generalisation gap", points: "+3" },
  { label: "Suggests a remedy", points: "0/2", missed: true },
  { label: "Clear, precise wording", points: "+1" },
];

function GradeAidMock() {
  return (
    <div className="mock mock-grade">
      <div className="mock-bar"><span>gradeaid / Q4</span><span>rubric v2</span></div>
      <div className="mock-question">Explain overfitting in your own words.</div>
      <p className="mock-student">
        Overfitting is when a model <mark>memorises the training data</mark> instead of
        learning the pattern, so it <mark>performs poorly on new data</mark>.
      </p>
      <div className="mock-grade-row">
        <ul className="mock-rubric">
          {rubric.map((item, index) => (
            <li className={`mock-step ${item.missed ? "missed" : ""}`} key={item.label} style={{ "--step": index + 1 } as React.CSSProperties}>
              <span>{item.missed ? "○" : "✓"}</span>{item.label}<b>{item.points}</b>
            </li>
          ))}
        </ul>
        <div className="mock-score mock-step" style={{ "--step": 5 } as React.CSSProperties}>
          <strong>7</strong><span>/10</span>
        </div>
      </div>
      <div className="mock-feedback mock-step" style={{ "--step": 6 } as React.CSSProperties}>
        <span>Feedback</span>
        Strong definition. Add one way to prevent it, such as regularisation or more data.
      </div>
    </div>
  );
}

const price = [62, 58, 64, 60, 55, 49, 53, 57, 54, 61, 68, 64, 70, 76, 72, 79, 74, 69, 73, 81, 86, 82, 88];
const trades = [
  { index: 5, kind: "buy" },
  { index: 14, kind: "sell" },
  { index: 17, kind: "buy" },
  { index: 22, kind: "sell" },
];

function RddpgMock() {
  const width = 400;
  const height = 170;
  const point = (value: number, index: number) => ({
    x: (index / (price.length - 1)) * width,
    y: height - ((value - 40) / 55) * height,
  });
  const line = price.map((value, index) => {
    const { x, y } = point(value, index);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="mock mock-rddpg">
      <div className="mock-bar"><span>rddpg / episode replay</span><span className="mock-live">agent</span></div>
      <svg className="mock-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {[0.25, 0.5, 0.75].map((t) => <line key={t} x1="0" x2={width} y1={height * t} y2={height * t} />)}
        <path className="mock-price" d={line} pathLength={1} />
        {trades.map((trade, index) => {
          const { x, y } = point(price[trade.index], trade.index);
          return (
            <g className={`mock-trade ${trade.kind}`} key={trade.index} style={{ "--step": index + 2 } as React.CSSProperties} transform={`translate(${x} ${y})`}>
              <circle r="5" />
            </g>
          );
        })}
      </svg>
      <div className="mock-agent">
        <div className="mock-step" style={{ "--step": 1 } as React.CSSProperties}>
          <span>LSTM state h<sub>t</sub></span>
          <div className="mock-state">{[0.7, 0.35, 0.9, 0.5, 0.2, 0.65, 0.8, 0.4].map((v, i) => <i key={i} style={{ "--v": v } as React.CSSProperties} />)}</div>
        </div>
        <div className="mock-step" style={{ "--step": 3 } as React.CSSProperties}>
          <span>Actor → action</span>
          <strong>BUY 0.42</strong>
        </div>
        <div className="mock-step" style={{ "--step": 5 } as React.CSSProperties}>
          <span>Critic → Q(s, a)</span>
          <strong>+1.27</strong>
        </div>
      </div>
    </div>
  );
}

export function ProjectMockup({ name }: { name: string }) {
  return (
    <figure className="project-mockup" data-reveal>
      {name === "DocAssist" && <DocAssistMock />}
      {name === "GradeAid" && <GradeAidMock />}
      {name === "RDDPG" && <RddpgMock />}
      <figcaption>Illustrative interface</figcaption>
    </figure>
  );
}
