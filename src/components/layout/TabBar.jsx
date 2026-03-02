import { useTabs } from '../../context/TabContext';
import { useTheme } from '../../context/ThemeContext';
import { Plus, X, Sun, Moon } from 'lucide-react';
import './TabBar.css';

export default function TabBar() {
    const { tabs, activeTabId, setActiveTabId, addTab, removeTab } = useTabs();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="tab-bar">
            <div className="tabs-container">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        <span className="tab-name">{tab.name}</span>
                        {tabs.length > 1 && (
                            <button
                                className="tab-close"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTab(tab.id);
                                }}
                                title="Close Tab"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                ))}
                <button className="add-tab-btn" onClick={addTab} title="New Tab">
                    <Plus size={16} strokeWidth={2} />
                </button>
            </div>
            <div className="tab-actions">
                <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </div>
    );
}
