import { useState } from 'react';
import { personal } from '../data/resume';
import ChatWidget from './ChatWidget';

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function GitLabIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
    </svg>
  );
}

function Hero() {
  const [showResumeModal, setShowResumeModal] = useState(false);

  const links = [
    { icon: <ResumeIcon />, label: 'Resume', isResume: true },
    { icon: <EmailIcon />, label: 'Email', href: `mailto:${personal.email}` },
    { icon: <LinkedInIcon />, label: 'LinkedIn', href: `https://${personal.linkedin}` },
    { icon: <GitHubIcon />, label: 'GitHub', href: `https://${personal.github}` },
    { icon: <GitLabIcon />, label: 'GitLab', href: `https://${personal.gitlab}` },
  ];

  return (
    <section id="about" className="site-section site-section--hero" aria-labelledby="intro-heading">
      <div className="section-inner hero-animate">
        <p className="lede">Backend engineer · Python</p>
        <h1 id="intro-heading" className="display-name">
          {personal.name}
        </h1>
        <p className="display-title">{personal.title}</p>
        <p className="display-meta">
          <PinIcon />
          {personal.location}
        </p>
        <p className="prose">{personal.summary}</p>
        <p className="availability-line">Open to remote and on-site roles.</p>

        <ul className="contact-row">
          {links.map((link) => (
            <li key={link.label}>
              {link.isResume ? (
                <button
                  type="button"
                  className="text-link text-link--button"
                  onClick={() => setShowResumeModal(true)}
                >
                  <span className="text-link-icon">{link.icon}</span>
                  {link.label}
                </button>
              ) : (
                <a
                  className="text-link"
                  href={link.href}
                  target={link.label === 'Email' ? undefined : '_blank'}
                  rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                >
                  <span className="text-link-icon">{link.icon}</span>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <ChatWidget />
      </div>

      {showResumeModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResumeModal(false);
          }}
        >
          <div className="modal-card resume-modal">
            <button type="button" className="modal-close" onClick={() => setShowResumeModal(false)} aria-label="Close">
              ×
            </button>
            <h3 className="modal-title">Resume</h3>
            <p className="resume-modal-sub">Pick a language.</p>
            <div className="resume-options">
              <a href={personal.resumeEnUrl} target="_blank" rel="noopener noreferrer" className="resume-option">
                <span className="resume-option-lang">English</span>
                <span className="resume-option-hint">Google Drive</span>
              </a>
              <a href={personal.resumeFrUrl} target="_blank" rel="noopener noreferrer" className="resume-option">
                <span className="resume-option-lang">Français</span>
                <span className="resume-option-hint">Google Drive</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
