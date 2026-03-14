import { useState } from 'react';
import { projects } from '../data/resume';
import ProjectModal from './ProjectModal';

function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="projects-content">
      <div className="projects-grid">
        {projects.map((project) => (
          <button
            key={project.id}
            className="project-card"
            onClick={() => setSelected(project)}
          >
            <div className="project-card-top">
              <h3 className="project-card-title">{project.title}</h3>
              <span className="project-card-company">{project.company}</span>
            </div>
            <p className="project-card-desc">{project.description}</p>
            <div className="project-card-tech">
              {project.tech.slice(0, 4).map((t) => (
                <span className="pill pill--sm" key={t}>{t}</span>
              ))}
              {project.tech.length > 4 && (
                <span className="pill pill--sm pill--more">+{project.tech.length - 4}</span>
              )}
            </div>
            <span className="project-card-hint">View Details →</span>
          </button>
        ))}
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default Projects;
