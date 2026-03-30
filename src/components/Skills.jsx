import { skills } from '../data/resume';

function Skills() {
  return (
    <div className="skills-content">
      <p className="section-label">Expertise</p>
      <div className="skills-grid">
        {skills.map((group, i) => (
          <div
            className="skill-card"
            key={group.category}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="skill-card-header">
              <span className="skill-card-icon" aria-hidden="true">{group.icon}</span>
              <div className="skill-card-meta">
                <h3 className="skill-card-title">
                  {group.category}
                  {group.level && (
                    <span className="skill-card-level">{group.level}</span>
                  )}
                </h3>
                <p className="skill-card-desc">{group.description}</p>
              </div>
            </div>
            <div className="skill-card-pills">
              {group.items.map((skill) => (
                <span className="pill" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
