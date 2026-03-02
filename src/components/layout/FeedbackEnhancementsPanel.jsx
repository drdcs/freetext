import { useTabs } from '../../context/TabContext';
import { useRef, useEffect, useState } from 'react';
import {
    MessageSquare,
    Lightbulb,
    PanelRightClose,
    PanelRightOpen,
    Bold,
    Italic,
    List,
    ListOrdered,
} from 'lucide-react';
import '../editor/RichTextEditor.css';
import './FeedbackEnhancementsPanel.css';

const SUB_TABS = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, field: 'reviewText' },
    { id: 'enhancements', label: 'Enhancements', icon: Lightbulb, field: 'enhancementsText' },
];

export default function FeedbackEnhancementsPanel({ isCollapsed, onCollapse, onExpand }) {
    const { activeTab, updateTabContent } = useTabs();
    const editorRef = useRef(null);
    const [activeSubTab, setActiveSubTab] = useState('feedback');

    const currentField = SUB_TABS.find((t) => t.id === activeSubTab)?.field ?? 'reviewText';

    useEffect(() => {
        if (!activeTab || !editorRef.current) return;
        const value = activeTab[currentField] ?? '';
        if (editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [activeTab?.id, activeSubTab, currentField]);

    if (!activeTab) return null;

    const flushToTab = (field, html) => {
        if (html !== (activeTab[field] ?? '')) {
            updateTabContent(activeTab.id, { [field]: html });
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            updateTabContent(activeTab.id, { [currentField]: content });
        }
    };

    const switchSubTab = (nextId) => {
        if (nextId === activeSubTab) return;
        if (editorRef.current) {
            flushToTab(currentField, editorRef.current.innerHTML);
        }
        setActiveSubTab(nextId);
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    // Collapsed: show thin strip with expand button
    if (isCollapsed) {
        return (
            <div className="feedback-enhancements-panel feedback-enhancements-panel--collapsed">
                <button
                    type="button"
                    className="expand-strip-btn"
                    onClick={onExpand}
                    title="Expand Feedback & Enhancements"
                >
                    <PanelRightOpen size={20} />
                    <span className="expand-strip-label">Expand</span>
                </button>
            </div>
        );
    }

    return (
        <div className="feedback-enhancements-panel">
            <div className="feedback-enhancements-header">
                <span className="feedback-enhancements-title">Feedback & Enhancements</span>
                <button
                    type="button"
                    className="collapse-btn"
                    onClick={onCollapse}
                    title="Collapse panel"
                >
                    <PanelRightClose size={16} />
                </button>
            </div>
            <div className="feedback-enhancements-tabs">
                {SUB_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`feedback-enhancements-tab ${activeSubTab === tab.id ? 'active' : ''}`}
                            onClick={() => switchSubTab(tab.id)}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            <div className="feedback-enhancements-toolbar">
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} title="Bold"><Bold size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} title="Italic"><Italic size={14} /></button>
                <div className="toolbar-divider" />
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} title="Bullet List"><List size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }} title="Numbered List"><ListOrdered size={14} /></button>
            </div>
            <div className="editor-wrapper flex-1 overflow-auto feedback-enhancements-editor-wrap">
                <div
                    ref={editorRef}
                    className="content-editable-area content-editable-area--small"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleInput}
                    data-placeholder={
                        activeSubTab === 'feedback'
                            ? 'Review notes, trade-offs, bottlenecks, scaling feedback...'
                            : 'Future improvements, enhancements, follow-ups...'
                    }
                />
            </div>
        </div>
    );
}
