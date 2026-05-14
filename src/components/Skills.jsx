import { skills } from '../data/resume';

function Skills() {
  return (
    <section id="skills" className="site-section" aria-labelledby="skills-heading">
      <div className="section-inner skills-animate">
        <h2 id="skills-heading" className="section-title">
          Skills
        </h2>
        <p className="section-intro">
          Day-to-day tools and areas I work in most.
        </p>
        <dl className="skills-list">
          {skills.map((group, i) => (
            <div className="skills-row" key={group.category} style={{ '--skills-stagger': i }}>
              <dt className="skills-term">
                {group.category}
                {group.level ? <span className="skills-level">{group.level}</span> : null}
              </dt>
              <dd className="skills-detail">
                <span className="skills-desc">{group.description}</span>
                <span className="skills-items">{group.items.join(', ')}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Skills;
