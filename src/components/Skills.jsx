import { skills } from '../data/resume';

function Skills() {
  return (
    <div className="skills-content">
      <div className="skills-grid">
        {skills.map((group) => (
          <div className="skill-card" key={group.category}>
            <div className="skill-card-header">
              <span className="skill-card-icon">{group.icon}</span>
              <div>
                <h3 className="skill-card-title">
                  {group.category}
                  {group.level && <span className="skill-card-level">{group.level}</span>}
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
