import { Handle, Position, NodeResizer, useReactFlow } from 'reactflow';
import { useState, memo, useCallback, useRef, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';
import { useTabs } from '../../context/TabContext';

function useNodeContent(id, initialText) {
    const { activeTab, updateTabContent } = useTabs();
    const [content, setContent] = useState(initialText || '');
    const textareaRef = useRef(null);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }, []);

    useEffect(() => {
        autoResize();
    }, [content, autoResize]);

    const handleBlur = () => {
        if (!activeTab) return;
        const newNodes = activeTab.nodes.map(node => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, label: content } };
            }
            return node;
        });
        updateTabContent(activeTab.id, { nodes: newNodes });
    };

    return { content, setContent, handleBlur, textareaRef };
}

/* ─── SVG Shape Renderers ─────────────────────────────────────── */

function RectSVG({ fill, stroke, strokeWidth }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect
                x={strokeWidth} y={strokeWidth}
                width={100 - strokeWidth * 2} height={100 - strokeWidth * 2}
                rx="4" ry="4"
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
            />
        </svg>
    );
}

function RoundedRectSVG({ fill, stroke, strokeWidth }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect
                x={strokeWidth} y={strokeWidth}
                width={100 - strokeWidth * 2} height={100 - strokeWidth * 2}
                rx="14" ry="14"
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
            />
        </svg>
    );
}

function CircleSVG({ fill, stroke, strokeWidth }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse
                cx="50" cy="50"
                rx={50 - strokeWidth} ry={50 - strokeWidth}
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
            />
        </svg>
    );
}

function TriangleSVG({ fill, stroke, strokeWidth }) {
    const inset = strokeWidth + 1;
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
                points={`50,${inset} ${100 - inset},${100 - inset} ${inset},${100 - inset}`}
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DiamondSVG({ fill, stroke, strokeWidth }) {
    const inset = strokeWidth + 1;
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
                points={`50,${inset} ${100 - inset},50 50,${100 - inset} ${inset},50`}
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HexagonSVG({ fill, stroke, strokeWidth }) {
    const inset = strokeWidth + 1;
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
                points={`50,${inset} ${100 - inset},25 ${100 - inset},75 50,${100 - inset} ${inset},75 ${inset},25`}
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
                strokeLinejoin="round"
            />
        </svg>
    );
}

const SVG_MAP = {
    'rectangle': RectSVG,
    'rounded-rectangle': RoundedRectSVG,
    'circle': CircleSVG,
    'triangle': TriangleSVG,
    'diamond': DiamondSVG,
    'hexagon': HexagonSVG,
};

/* ─── Main Shape Node ─────────────────────────────────────────── */

export function ShapeNode({ id, data, selected, shape }) {
    const { content, setContent, handleBlur, textareaRef } = useNodeContent(id, data.label);
    const { deleteElements } = useReactFlow();
    const { activeTab, updateTabContent } = useTabs();

    const onDelete = useCallback((e) => {
        e.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    }, [id, deleteElements]);

    const onRotate = useCallback((e) => {
        e.stopPropagation();
        if (!activeTab) return;
        const newNodes = activeTab.nodes.map(node => {
            if (node.id === id) {
                const currentRotation = node.data.rotation || 0;
                return { ...node, data: { ...node.data, rotation: (currentRotation + 90) % 360 } };
            }
            return node;
        });
        updateTabContent(activeTab.id, { nodes: newNodes });
    }, [id, activeTab, updateTabContent]);

    const rotation = data.rotation || 0;

    const bgColor = data.color || 'var(--bg-card)';
    const strokeColor = selected ? 'var(--accent-blue)' : 'var(--border-color)';
    const strokeWidth = selected ? 2.5 : 1.8;

    const SVGShape = SVG_MAP[shape] || RectSVG;

    // Adjust input positioning for triangle / diamond shapes
    const inputStyle = {
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        textAlign: 'center',
        width: shape === 'triangle' ? '55%' : shape === 'diamond' ? '60%' : '85%',
        outline: 'none',
        fontSize: '11px',
        fontWeight: '600',
        fontFamily: 'inherit',
        letterSpacing: '0.01em',
        position: 'relative',
        zIndex: 2,
        marginTop: shape === 'triangle' ? '15%' : '0',
    };

    return (
        <>
            <NodeResizer
                color="var(--accent-blue)"
                isVisible={selected}
                minWidth={40}
                minHeight={40}
                lineStyle={{ borderWidth: '0.5px', borderColor: 'var(--accent-blue)', opacity: 0.3, borderStyle: 'dashed' }}
                handleStyle={{
                    width: '5px', height: '5px',
                    borderRadius: '1px',
                    backgroundColor: 'var(--accent-blue)',
                    border: 'none',
                }}
            />
            <div
                className={`shape-node-container ${selected ? 'shape-node-selected' : ''}`}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    filter: selected
                        ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.2))'
                        : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))',
                    transition: 'filter 0.2s ease',
                }}
            >
                {/* SVG shape — rotates independently */}
                <div style={{
                    position: 'absolute', inset: 0,
                    pointerEvents: 'none',
                    transition: 'transform 0.2s ease',
                    transform: `rotate(${rotation}deg)`,
                }}>
                    <SVGShape fill={bgColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                </div>

                {/* Label — counter-rotates to stay readable, or rotates with shape */}
                <textarea
                    ref={textareaRef}
                    className="shape-input nodrag"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Label"
                    rows={1}
                    style={inputStyle}
                />

                {/* Action buttons (above node, not rotated) */}
                {selected && (
                    <div className="node-action-buttons nodrag">
                        <button className="node-action-btn node-rotate-btn" onClick={onRotate} title="Rotate 90°">
                            <RotateCw size={8} strokeWidth={2.5} />
                        </button>
                        <button className="node-action-btn node-delete-btn" onClick={onDelete} title="Delete">
                            <X size={8} strokeWidth={2.5} />
                        </button>
                    </div>
                )}

                {/* Connection handles — fixed positions, NOT rotated */}
                <Handle type="target" position={Position.Top} className="flow-handle" id="top-target" />
                <Handle type="target" position={Position.Left} className="flow-handle" id="left-target" />
                <Handle type="source" position={Position.Bottom} className="flow-handle" id="bottom-source" />
                <Handle type="source" position={Position.Right} className="flow-handle" id="right-source" />
            </div>
        </>
    );
}

/* ─── Exported Shape Variants ─────────────────────────────────── */

export const SquareNode = memo((props) => <ShapeNode {...props} shape="rectangle" />);
export const CircleNode = memo((props) => <ShapeNode {...props} shape="circle" />);
export const RoundedRectNode = memo((props) => <ShapeNode {...props} shape="rounded-rectangle" />);
export const TriangleNode = memo((props) => <ShapeNode {...props} shape="triangle" />);
export const HexagonNode = memo((props) => <ShapeNode {...props} shape="hexagon" />);
export const DiamondNode = memo((props) => <ShapeNode {...props} shape="diamond" />);
