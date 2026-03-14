import { useState } from 'react';
import { personal } from '../data/resume';

function Hero() {
  const [showResumeModal, setShowResumeModal] = useState(false);

  const links = [
    { icon: '📄', label: 'Resume', value: 'EN · FR', isResume: true },
    { icon: '✉', label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: '🔷', label: 'LinkedIn', value: 'idahmed', href: `https://${personal.linkedin}` },
    { icon: '⌘', label: 'GitHub', value: 'idahmed', href: `https://${personal.github}` },
    { icon: '🦊', label: 'GitLab', value: 'idahmed', href: `https://${personal.gitlab}` },
  ];

  return (
    <div className="hero-content">
      <div className="hero-intro">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">{personal.name}</h1>
        <p className="hero-title">{personal.title}</p>
        <p className="hero-location">📍 {personal.location}</p>
      </div>

      <p className="hero-summary">{personal.summary}</p>

      <div className="hero-links">
        {links.map((link) =>
          link.isResume ? (
            <button
              key={link.label}
              className="hero-link-card"
              onClick={() => setShowResumeModal(true)}
            >
              <span className="hero-link-icon">{link.icon}</span>
              <div className="hero-link-info">
                <span className="hero-link-label">{link.label}</span>
                <span className="hero-link-value">{link.value}</span>
              </div>
            </button>
          ) : (
            <a
              key={link.label}
              className="hero-link-card"
              href={link.href}
              target={link.label === 'Email' ? undefined : '_blank'}
              rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
            >
              <span className="hero-link-icon">{link.icon}</span>
              <div className="hero-link-info">
                <span className="hero-link-label">{link.label}</span>
                <span className="hero-link-value">{link.value}</span>
              </div>
            </a>
          )
        )}
      </div>

      {showResumeModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowResumeModal(false); }}>
          <div className="modal-card resume-modal">
            <button className="modal-close" onClick={() => setShowResumeModal(false)} aria-label="Close">✕</button>
            <h3 className="modal-title">Download Resume</h3>
            <p className="resume-modal-sub">Select your preferred language</p>
            <div className="resume-options">
              <a href={personal.resumeEnUrl} target="_blank" rel="noopener noreferrer" className="resume-option">
                <span className="resume-option-flag">🇺🇸</span>
                <div className="resume-option-info">
                  <span className="resume-option-lang">English</span>
                  <span className="resume-option-hint">View on Google Drive</span>
                </div>
                <span className="resume-option-arrow">→</span>
              </a>
              <a href={personal.resumeFrUrl} target="_blank" rel="noopener noreferrer" className="resume-option">
                <span className="resume-option-flag">🇫🇷</span>
                <div className="resume-option-info">
                  <span className="resume-option-lang">Français</span>
                  <span className="resume-option-hint">View on Google Drive</span>
                </div>
                <span className="resume-option-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
