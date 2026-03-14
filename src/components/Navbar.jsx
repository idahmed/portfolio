function Navbar({ tabs, activeTab, onTabChange, theme, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-logo" onClick={() => onTabChange('about')}>
          IY<span className="navbar-logo-dot">.</span>
        </button>

        <div className="navbar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`navbar-tab${activeTab === tab.id ? ' navbar-tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && <span className="navbar-tab-indicator" />}
            </button>
          ))}
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
