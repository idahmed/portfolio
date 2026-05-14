import { useEffect } from 'react';

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h3 className="modal-title" id="modal-title">
          {project.title}
        </h3>
        <p className="modal-meta">
          <span className="modal-company">{project.company}</span>
          {project.period ? <span className="modal-period">{project.period}</span> : null}
        </p>

        <p className="modal-description">{project.description}</p>

        <ul className="modal-details">
          {project.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>

        <p className="modal-tech-line">{project.tech.join(' · ')}</p>
      </div>
    </div>
  );
}

export default ProjectModal;
