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
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-header">
          <h3 className="modal-title" id="modal-title">{project.title}</h3>
          <div className="modal-title-line" />
          <div className="modal-meta">
            <span className="modal-company">{project.company}</span>
            {project.period && <span className="modal-period">{project.period}</span>}
          </div>
        </div>

        <p className="modal-description">{project.description}</p>

        <ul className="modal-details">
          {project.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>

        <div className="modal-tech">
          {project.tech.map((t) => (
            <span className="pill" key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
