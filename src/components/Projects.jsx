import { useState } from 'react';
import { projects } from '../data/resume';
import ProjectModal from './ProjectModal';

function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="site-section" aria-labelledby="projects-heading">
      <div className="section-inner">
        <h2 id="projects-heading" className="section-title">
          Projects
        </h2>
        <p className="section-intro">
          Selected work. Click a row for detail.
        </p>
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className="project-row"
                onClick={() => setSelected(project)}
              >
                <span className="project-row-main">
                  <span className="project-row-title">{project.title}</span>
                  <span className="project-row-company">{project.company}</span>
                </span>
                <span className="project-row-desc">{project.description}</span>
                <span className="project-row-tech">{project.tech.join(' · ')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected ? <ProjectModal project={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  );
}

export default Projects;
