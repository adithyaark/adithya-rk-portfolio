import { experience, languages, profile, projects, publications, skillGroups } from "../data";
import { ResumePrintButton } from "./ResumePrintButton";
import type { Metadata } from "next";
import "./resume.css";

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
  description: `Resume of ${profile.name}, AI engineer and research intern.`,
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar"><a href="/">← Back to portfolio</a><ResumePrintButton /></div>
      <article className="resume-sheet">
        <header className="resume-header"><div><p className="resume-kicker">AI Engineer · Research Intern</p><h1>{profile.name}</h1><p className="resume-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><span>|</span><a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a><span>|</span><a href={profile.linkedin}>LinkedIn</a></p></div><div className="resume-location">{profile.location}<br />NITK Surathkal</div></header>
        <section className="resume-section"><h2>Profile</h2><p>AI Engineer with expertise in Generative AI, Machine Learning, Natural Language Processing, and Deep Learning. Experienced in big data processing, building scalable AI pipelines, managing RDBMS, and creating predictive models. Proven problem-solver with hands-on internship experience applying AI to real-world business challenges.</p></section>
        <section className="resume-section"><h2>Professional Experience</h2>{experience.map((item) => <div className="resume-entry" key={`${item.company}-${item.role}`}><div className="resume-entry-top"><div><h3>{item.company}</h3><p>{item.role}</p></div><div><span>{item.location}</span><span>{item.period}</span></div></div><p>{item.description}</p></div>)}</section>
        <section className="resume-section"><h2>Education</h2><div className="resume-entry"><div className="resume-entry-top"><div><h3>Amrita Vishwa Vidyapeetham</h3><p>BTech in Artificial Intelligence | CGPA — 8.17</p></div><div><span>Kollam, Kerala</span><span>Aug 2025</span></div></div></div></section>
        <section className="resume-section"><h2>Projects</h2>{projects.slice(0, 2).map((project) => <div className="resume-entry project-entry" key={project.name}><h3>{project.name}: {project.title}</h3><p>{project.description}</p></div>)}</section>
        <section className="resume-section"><h2>Skills</h2><div className="resume-skills">{skillGroups.map((group) => <p key={group.label}><strong>{group.label}:</strong> {group.items.join(", ")}</p>)}<p><strong>Languages:</strong> {languages.join(", ")}</p></div></section>
        <section className="resume-section"><h2>Publications</h2>{publications.map((paper) => <div className="resume-entry project-entry" key={paper.url}><h3><a href={paper.url}>{paper.title}</a></h3><p>{paper.venue}, {paper.publisher}, {paper.year}, {paper.pages}.{paper.note && ` ${paper.note}.`}</p></div>)}</section>
      </article>
    </main>
  );
}
