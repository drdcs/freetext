import { useTabs } from '../../context/TabContext';
import { useRef, useEffect, useState } from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Eraser,
    AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Palette,
    Type
} from 'lucide-react';
import './RichTextEditor.css';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
const TEXT_COLORS = [
    '#f8fafc', '#94a3b8', '#3b82f6', '#10b981',
    '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6',
    '#0f172a', '#ef4444', '#6366f1', '#ec4899',
];

export default function RichTextEditor() {
    const { activeTab, updateTabContent } = useTabs();
    const editorRef = useRef(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);

    useEffect(() => {
        if (editorRef.current && activeTab && editorRef.current.innerHTML !== activeTab.text) {
            editorRef.current.innerHTML = activeTab.text || '';
        }
    }, [activeTab?.id]);

    if (!activeTab) return null;

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            if (content !== activeTab.text) {
                updateTabContent(activeTab.id, { text: content });
            }
        }
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const applyColor = (color) => {
        execCommand('foreColor', color);
        setShowColorPicker(false);
    };

    const applyFontSize = (size) => {
        // execCommand fontSize takes 1-7, so we use inline style via insertHTML
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && sel.toString().length > 0) {
            execCommand('fontSize', '7');
            // Now find all font size=7 elements and replace with the actual size
            const fonts = editorRef.current.querySelectorAll('font[size="7"]');
            fonts.forEach(f => {
                f.removeAttribute('size');
                f.style.fontSize = size;
            });
            handleInput();
        }
        setShowSizePicker(false);
    };

    return (
        <div className="rich-text-container h-full flex flex-col">
            <div className="panel-label">
                <Type size={14} />
                <span>System Design Notes</span>
            </div>

            <div className="editor-header p-3 border-b border-color">
                <input
                    type="text"
                    className="tab-title-input text-lg font-semibold w-full bg-transparent border-none outline-none"
                    value={activeTab.name}
                    onChange={(e) => updateTabContent(activeTab.id, { name: e.target.value })}
                    placeholder="System Design Name..."
                />
            </div>

            <div className="editor-toolbar flex gap-1 p-2 border-b border-color bg-secondary">
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} title="Bold"><Bold size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} title="Italic"><Italic size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} title="Underline"><Underline size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }} title="Strikethrough"><Strikethrough size={14} /></button>

                <div className="toolbar-divider" />

                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', '<h1>'); }} title="Heading 1"><Heading1 size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', '<h2>'); }} title="Heading 2"><Heading2 size={14} /></button>

                <div className="toolbar-divider" />

                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }} title="Align Left"><AlignLeft size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }} title="Align Center"><AlignCenter size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyRight'); }} title="Align Right"><AlignRight size={14} /></button>

                <div className="toolbar-divider" />

                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} title="Bullet List"><List size={14} /></button>
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }} title="Numbered List"><ListOrdered size={14} /></button>

                <div className="toolbar-divider" />

                {/* Text Color Picker */}
                <div className="toolbar-dropdown-wrap">
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker); setShowSizePicker(false); }} title="Text Color">
                        <Palette size={14} />
                    </button>
                    {showColorPicker && (
                        <div className="toolbar-dropdown color-grid">
                            {TEXT_COLORS.map(c => (
                                <button key={c} className="color-swatch" style={{ backgroundColor: c }} onMouseDown={(e) => { e.preventDefault(); applyColor(c); }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Font Size Picker */}
                <div className="toolbar-dropdown-wrap">
                    <button className="toolbar-btn text-xs" onMouseDown={(e) => { e.preventDefault(); setShowSizePicker(!showSizePicker); setShowColorPicker(false); }} title="Font Size">
                        A<small>a</small>
                    </button>
                    {showSizePicker && (
                        <div className="toolbar-dropdown size-list">
                            {FONT_SIZES.map(s => (
                                <button key={s} className="size-option" onMouseDown={(e) => { e.preventDefault(); applyFontSize(s); }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="toolbar-divider" />
                <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); execCommand('removeFormat'); }} title="Clear Formatting"><Eraser size={14} /></button>
            </div>

            <div className="editor-wrapper flex-1 overflow-auto">
                <div
                    ref={editorRef}
                    className="content-editable-area"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleInput}
                    data-placeholder="High-level & low-level design notes... (requirements, capacity estimation, API design, data model, etc.)"
                />
            </div>
        </div>
    );
}
