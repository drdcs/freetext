import { Handle, Position, NodeResizer, useReactFlow } from 'reactflow';
import { useState, memo, useCallback } from 'react';
import { X, RotateCw } from 'lucide-react';
import { useTabs } from '../../context/TabContext';

// Bootstrap icons for system design components
import {
    BsServer, BsHddStack, BsPhone, BsGlobe2, BsLayersHalf,
    BsDiagram3, BsLightning, BsCloudFill,
    BsShieldLock, BsCpu, BsHddNetwork, BsEnvelope,
    BsPerson, BsActivity, BsCodeSlash, BsArchive,
    BsGridFill, BsBell, BsSearch, BsGear,
    BsLock, BsCloudArrowUp, BsBoxSeam, BsRouter,
    BsDatabase, BsWindow, BsKanban, BsGraphUp,
} from 'react-icons/bs';

// Map node data.type to Bootstrap icons
const iconMap = {
    server: BsServer,
    database: BsDatabase,
    client: BsPhone,
    web: BsGlobe2,
    queue: BsEnvelope,
    lb: BsDiagram3,
    gateway: BsLightning,
    cdn: BsCloudFill,
    api: BsCodeSlash,
    cache: BsHddStack,
    storage: BsArchive,
    firewall: BsShieldLock,
    container: BsBoxSeam,
    microservice: BsCpu,
    dns: BsHddNetwork,
    user: BsPerson,
    monitor: BsActivity,
    search: BsSearch,
    notification: BsBell,
    auth: BsLock,
    upload: BsCloudArrowUp,
    router: BsRouter,
    webapp: BsWindow,
    scheduler: BsGear,
    grid: BsGridFill,
    analytics: BsGraphUp,
    task: BsKanban,
    layer: BsLayersHalf,
};

function useNodeContent(id, initialText) {
    const { activeTab, updateTabContent } = useTabs();
    const [content, setContent] = useState(initialText || '');

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

    return { content, setContent, handleBlur };
}

const GenericNode = memo(function GenericNode({ id, data, selected }) {
    const Icon = iconMap[data.type] || BsServer;
    const { content, setContent, handleBlur } = useNodeContent(id, data.label);
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

    return (
        <>
            <NodeResizer
                color="var(--accent-blue)"
                isVisible={selected}
                minWidth={50}
                minHeight={40}
                lineStyle={{ borderWidth: '0.5px', borderColor: 'var(--accent-blue)', opacity: 0.3, borderStyle: 'dashed' }}
                handleStyle={{
                    width: '5px', height: '5px',
                    borderRadius: '1px',
                    backgroundColor: 'var(--accent-blue)',
                    border: 'none',
                }}
            />
            <div className="standalone-node">
                {/* Handles */}
                <Handle type="target" position={Position.Top} className="flow-handle" id="top-target" />
                <Handle type="target" position={Position.Left} className="flow-handle" id="left-target" />

                {/* Icon + Label (vertically stacked) */}
                <div className="standalone-node-content" style={{
                    transition: 'transform 0.15s ease',
                    transform: `rotate(${rotation}deg)`,
                }}>
                    <div className="standalone-node-icon">
                        <Icon size={18} />
                    </div>
                    <input
                        className="nodrag standalone-node-label"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="Label"
                    />
                </div>

                {/* Action buttons */}
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

                <Handle type="source" position={Position.Bottom} className="flow-handle" id="bottom-source" />
                <Handle type="source" position={Position.Right} className="flow-handle" id="right-source" />
            </div>
        </>
    );
});

export default GenericNode;
