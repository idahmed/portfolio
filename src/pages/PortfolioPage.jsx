import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('about');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'about': return <Hero />;
      case 'skills': return <Skills />;
      case 'projects': return <Projects />;
      default: return <Hero />;
    }
  };

  return (
    <>
      <Navbar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="portfolio">
        <div className="tab-panel" key={activeTab}>
          {renderTab()}
        </div>
      </main>
    </>
  );
}

export default PortfolioPage;
