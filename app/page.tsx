import { Arrow } from "./components/Arrow";
import { ContactDialog } from "./components/ContactDialog";
import { Header } from "./components/Header";
import { Knot } from "./components/Knot";
import { Lines } from "./components/Lines";
import { Loader } from "./components/Loader";
import { ProjectMockup } from "./components/ProjectMockup";
import { RevealObserver } from "./components/RevealObserver";
import { RollText } from "./components/RollText";
import { ScrollDrift } from "./components/ScrollDrift";
import { Thread } from "./components/Thread";
import {
  experience,
  profile,
  projects,
  publications,
  skillGroups,
} from "./data";

const practice = [
  { label: "Retrieve", note: "Ground every answer in evidence." },
  { label: "Reason", note: "Turn context into decisions." },
  { label: "Refine", note: "Measure, evaluate, improve." },
];

export default function Home() {
  return (
    <main id="top">
      <Loader />
      <Header />
      <Thread />
      <RevealObserver />
      <ScrollDrift />

      <section className="world dark hero" data-thread>
        <p className="kicker" data-reveal>
          AI engineer / research intern
        </p>
        <h1 className="display hero-title" data-reveal>
          <Lines
            lines={["Building", "intelligence", "with intention."]}
            drift
          />
        </h1>
        <div className="hero-bottom" data-reveal>
          <p className="hero-intro">
            I&apos;m <strong>Adithya R K Nambiar</strong> — an AI engineer
            turning messy data, language, and research into systems people can
            trust.
          </p>
          <div className="hero-meta">
            <span>Currently</span>
            <strong>Research Intern · NITK Surathkal</strong>
          </div>
          <a className="scroll-cue" href="#intro">
            Scroll to follow the thread <span>↓</span>
          </a>
        </div>
      </section>

      <section className="world light intro" id="intro" data-thread>
        <p className="kicker" data-reveal>
          From retrieval pipelines to cloud data systems
        </p>
        <h2 className="display statement" data-reveal>
          <Lines
            lines={["I care about", "the layer where ideas", "become useful."]}
            drift
          />
        </h2>
        <ol className="practice" data-reveal>
          {practice.map((item, index) => (
            <li
              key={item.label}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span>0{index + 1}</span>
              <strong>{item.label}</strong>
              <p>{item.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="world light capabilities"
        id="capabilities"
        data-thread
      >
        <div className="section-head" data-reveal>
          <p className="kicker">Capabilities</p>
          <h2 className="display">
            <Lines lines={["Tools are only", "half the story."]} />
          </h2>
          <p className="section-note">
            The other half is knowing when to use them, and when to build
            something better.
          </p>
        </div>

        <div className="cap-tree" data-reveal>
          <div className="cap-core">
            <span>✦</span>Language · Learning · Infrastructure
          </div>
          <div className="cap-columns">
            {skillGroups.map((group, index) => (
              <div
                className="cap-column"
                key={group.label}
                style={{ "--i": index } as React.CSSProperties}
              >
                <h3>
                  <span>0{index + 1}</span>
                  {group.label}
                </h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="work">
        {projects.map((project) => (
          <section
            className={`world ${project.theme} project`}
            key={project.name}
            data-thread
          >
            <div className="project-copy" data-reveal>
              <p className="kicker">
                <b>{project.number}</b> {project.type}
              </p>
              <h2 className="display project-name">
                <Lines lines={[project.name]} />
              </h2>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <ul className="tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <ProjectMockup name={project.name} />
          </section>
        ))}
      </div>

      <section className="world light experience" id="experience" data-thread>
        <div className="section-head" data-reveal>
          <p className="kicker">The path so far</p>
          <h2 className="display">
            <Lines lines={["Experience that", "compounds."]} />
          </h2>
          <p className="section-note">
            Every role has added a new lens — from pixels, to platforms, to
            possibilities.
          </p>
        </div>
        <ol className="experience-list">
          {experience.map((item, index) => (
            <li
              className="experience-row"
              key={`${item.company}-${item.role}`}
              data-reveal
            >
              <span className="experience-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="experience-main">
                <h3>
                  {item.company}
                  {item.current && (
                    <span className="current-pill">Current</span>
                  )}
                </h3>
                <p className="experience-role">{item.role}</p>
                <p className="experience-description">{item.description}</p>
              </div>
              <div className="experience-meta">
                <span>{item.period}</span>
                <span>{item.location}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="world dark publications"
        id="publications"
        data-thread
      >
        <div className="section-head" data-reveal>
          <p className="kicker">Publications</p>
          <h2 className="display">
            <Lines lines={["Published", "research."]} />
          </h2>
          <p className="section-note">
            Peer-reviewed work in Springer&apos;s Lecture Notes in Networks and
            Systems.
          </p>
        </div>
        <ol className="publication-list">
          {publications.map((paper, index) => (
            <li className="publication-row" key={paper.url} data-reveal>
              <span className="publication-year">
                {String(index + 1).padStart(2, "0")} / {paper.year}
              </span>
              <div className="publication-main">
                <h3>{paper.title}</h3>
                <p className="publication-venue">
                  {paper.venue} · {paper.publisher} · {paper.pages}
                </p>
                {paper.note && (
                  <p className="publication-venue">{paper.note}</p>
                )}
                <p className="publication-authors">
                  {paper.authors.map((author, i) => (
                    <span key={author}>
                      {author.includes("Nambiar") ? (
                        <strong>{author}</strong>
                      ) : (
                        author
                      )}
                      {i < paper.authors.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
              <a
                className="publication-link"
                href={paper.url}
                target="_blank"
                rel="noreferrer"
              >
                Read on Springer <Arrow diagonal />
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="world dark contact" id="contact" data-thread>
        <div className="contact-layout">
          <div className="contact-copy">
            <h2 className="display contact-title" data-reveal>
              <Lines lines={["Got a", "problem", "worth", "untangling?"]} />
            </h2>
            <div className="contact-actions" data-reveal>
              <ContactDialog email={profile.email} />
            </div>
          </div>
          <Knot />
        </div>
        <footer className="site-footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a className="footer-linkedin" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
            <span className="footer-linkedin-mark" aria-hidden="true">in</span>
            <RollText text="LinkedIn ↗" />
          </a>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>
    </main>
  );
}
