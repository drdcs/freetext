import { memo } from 'react';
import { getBezierPath, MarkerType } from 'reactflow';

/* ─── Shared edge rendering ──────────────────────────────────── */

function BaseEdge({
    id, sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    style = {}, markerEnd, selected,
    strokeDasharray, className = '',
}) {
    const [edgePath] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
    });

    return (
        <>
            {/* Invisible wide path for easy clicking */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                className="react-flow__edge-interaction"
            />
            <path
                id={id}
                d={edgePath}
                fill="none"
                className={`react-flow__edge-path custom-edge-path ${className} ${selected ? 'selected' : ''}`}
                markerEnd={markerEnd}
                style={{
                    stroke: selected ? 'var(--accent-blue)' : 'var(--text-muted)',
                    strokeWidth: selected ? 1.8 : 1.2,
                    ...style,
                    ...(strokeDasharray ? { strokeDasharray } : {}),
                }}
            />
        </>
    );
}

/* ─── Solid Edge ─────────────────────────────────────────────── */

export const SolidEdge = memo((props) => (
    <BaseEdge {...props} className="edge-solid" />
));
SolidEdge.displayName = 'SolidEdge';

/* ─── Dashed Edge ────────────────────────────────────────────── */

export const DashedEdge = memo((props) => (
    <BaseEdge {...props} strokeDasharray="8 4" className="edge-dashed" />
));
DashedEdge.displayName = 'DashedEdge';

/* ─── Dotted Edge ────────────────────────────────────────────── */

export const DottedEdge = memo((props) => (
    <BaseEdge {...props} strokeDasharray="2 3" className="edge-dotted" />
));
DottedEdge.displayName = 'DottedEdge';

/* ─── Animated / Stream Edge ─────────────────────────────────── */

export const AnimatedEdge = memo((props) => (
    <BaseEdge
        {...props}
        strokeDasharray="6 4"
        className="edge-animated"
    />
));
AnimatedEdge.displayName = 'AnimatedEdge';
