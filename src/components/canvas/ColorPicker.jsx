import { Check } from 'lucide-react';
import './ColorPicker.css';

const PRESET_COLORS = [
    { label: 'Default', value: 'var(--bg-card)' },
    { label: 'Slate', value: '#334155' },
    { label: 'Blue', value: '#1e3a8a' },
    { label: 'Indigo', value: '#312e81' },
    { label: 'Purple', value: '#4c1d95' },
    { label: 'Emerald', value: '#064e3b' },
    { label: 'Teal', value: '#134e4a' },
    { label: 'Rose', value: '#881337' },
    { label: 'Amber', value: '#78350f' },
    { label: 'Sky', value: '#0c4a6e' },
];

export default function ColorPicker({ position, selectedNodeId, currentColor, onColorChange, onClose }) {
    if (!selectedNodeId) return null;

    return (
        <div
            className="color-picker-dialog"
            style={{
                position: 'absolute',
                top: position.y + 10,
                left: position.x + 10,
                zIndex: 1000,
            }}
        >
            <div className="color-picker-header">
                <span className="color-picker-title">Fill color</span>
                <button onClick={onClose} className="color-picker-close">&times;</button>
            </div>
            <div className="color-options">
                {PRESET_COLORS.map(c => {
                    const isSelected = currentColor === c.value;
                    const displayColor = c.value === 'var(--bg-card)' ? '#334155' : c.value;
                    return (
                        <button
                            key={c.value}
                            className={`color-btn ${isSelected ? 'color-btn-active' : ''}`}
                            style={{ backgroundColor: displayColor }}
                            onClick={() => onColorChange(selectedNodeId, c.value)}
                            title={c.label}
                        >
                            {isSelected && <Check size={12} strokeWidth={3} color="white" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
