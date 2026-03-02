import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TabContext = createContext();

const initialTab = {
    id: uuidv4(),
    name: 'System Design 1',
    nodes: [],
    edges: [],
    text: '',
    reviewText: '',
    enhancementsText: '',
};

export function TabProvider({ children }) {
    const [tabs, setTabs] = useState(() => {
        try {
            const savedTabs = localStorage.getItem('feetext_tabs');
            if (savedTabs) {
                const parsed = JSON.parse(savedTabs);
                return parsed.map((t) => ({ ...t, enhancementsText: t.enhancementsText ?? '' }));
            }
        } catch (e) {
            console.error('Failed to parse local storage tabs:', e);
        }
        return [initialTab];
    });

    const [activeTabId, setActiveTabId] = useState(() => {
        try {
            const savedActiveId = localStorage.getItem('feetext_activeTabId');
            if (savedActiveId && tabs.some(t => t.id === savedActiveId)) {
                return savedActiveId;
            } else if (tabs.length > 0) {
                return tabs[0].id; // Fallback to first tab if ID is invalid but tabs exist
            }
        } catch (e) {
            console.error('Failed to parse local storage active tab ID:', e);
        }
        return initialTab.id;
    });

    // Sync to local storage on changes
    useEffect(() => {
        localStorage.setItem('feetext_tabs', JSON.stringify(tabs));
    }, [tabs]);

    useEffect(() => {
        localStorage.setItem('feetext_activeTabId', activeTabId);
    }, [activeTabId]);

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    const addTab = () => {
        const newTab = {
            id: uuidv4(),
            name: `System Design ${tabs.length + 1}`,
            nodes: [],
            edges: [],
            text: '',
            reviewText: '',
            enhancementsText: '',
        };
        // Insert new tab right after the current active tab
        const activeIndex = tabs.findIndex(t => t.id === activeTabId);
        const insertAt = activeIndex >= 0 ? activeIndex + 1 : tabs.length;
        const newTabs = [...tabs.slice(0, insertAt), newTab, ...tabs.slice(insertAt)];
        setTabs(newTabs);
        setActiveTabId(newTab.id);
    };

    const removeTab = (id) => {
        if (tabs.length === 1) return; // Must have at least one tab

        const newTabs = tabs.filter(tab => tab.id !== id);
        if (activeTabId === id) {
            // If we closed the active tab, switch to the last available one
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
        setTabs(newTabs);
    };

    const updateTabContent = (id, updates) => {
        setTabs(prevTabs =>
            prevTabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab)
        );
    };

    return (
        <TabContext.Provider value={{
            tabs,
            activeTabId,
            activeTab,
            setActiveTabId,
            addTab,
            removeTab,
            updateTabContent
        }}>
            {children}
        </TabContext.Provider>
    );
}

export function useTabs() {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTabs must be used within a TabProvider');
    }
    return context;
}
