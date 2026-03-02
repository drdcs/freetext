import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
    ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';


import { useTabs } from '../../context/TabContext';
import { useTheme } from '../../context/ThemeContext';
import { SquareNode, CircleNode, RoundedRectNode, TriangleNode, HexagonNode, DiamondNode } from './ShapeNodes';
import GenericNode from './CustomNodes';
import { SolidEdge, DashedEdge, DottedEdge, AnimatedEdge } from './CustomEdges';
import SidebarElements from './SidebarElements';
import ColorPicker from './ColorPicker';
import './SystemCanvas.css';

const nodeTypes = {
    // Shapes
    square: SquareNode,
    circle: CircleNode,
    rounded: RoundedRectNode,
    triangle: TriangleNode,
    diamond: DiamondNode,
    hexagon: HexagonNode,
    // System design components
    server: GenericNode,
    database: GenericNode,
    client: GenericNode,
    web: GenericNode,
    queue: GenericNode,
    lb: GenericNode,
    gateway: GenericNode,
    cdn: GenericNode,
    api: GenericNode,
    cache: GenericNode,
    storage: GenericNode,
    firewall: GenericNode,
    container: GenericNode,
    microservice: GenericNode,
    dns: GenericNode,
    user: GenericNode,
    monitor: GenericNode,
    search: GenericNode,
    notification: GenericNode,
    auth: GenericNode,
    upload: GenericNode,
    router: GenericNode,
    webapp: GenericNode,
    scheduler: GenericNode,
    grid: GenericNode,
    analytics: GenericNode,
    task: GenericNode,
    layer: GenericNode,
};

const edgeTypes = {
    solid: SolidEdge,
    dashed: DashedEdge,
    dotted: DottedEdge,
    animated: AnimatedEdge,
};

const defaultEdgeOptions = {
    type: 'solid',
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--text-muted)',
        width: 12,
        height: 12,
    },
};

function FlowCanvas() {
    const { activeTab, updateTabContent } = useTabs();
    const { theme } = useTheme();
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // Active connector style
    const [activeEdgeStyle, setActiveEdgeStyle] = useState('solid');

    // Color picker state
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [colorPickerPos, setColorPickerPos] = useState({ x: 0, y: 0 });
    const [pickerNodeId, setPickerNodeId] = useState(null);
    const [pickerCurrentColor, setPickerCurrentColor] = useState(null);

    // Track selection state for the delete button


    const nodes = activeTab?.nodes || [];
    const edges = activeTab?.edges || [];

    // Keep refs to always have the latest nodes/edges (avoids stale closure)
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);
    nodesRef.current = nodes;
    edgesRef.current = edges;

    const setNodes = useCallback((changes) => {
        if (!activeTab) return;
        if (typeof changes === 'function') {
            updateTabContent(activeTab.id, { nodes: changes(nodesRef.current) });
        } else {
            updateTabContent(activeTab.id, { nodes: changes });
        }
    }, [activeTab, updateTabContent]);

    const setEdges = useCallback((changes) => {
        if (!activeTab) return;
        if (typeof changes === 'function') {
            updateTabContent(activeTab.id, { edges: changes(edgesRef.current) });
        } else {
            updateTabContent(activeTab.id, { edges: changes });
        }
    }, [activeTab, updateTabContent]);

    const onNodesChange = useCallback(
        (changes) => {
            const updated = applyNodeChanges(changes, nodesRef.current);
            updateTabContent(activeTab.id, { nodes: updated });
        },
        [activeTab, updateTabContent]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            const updated = applyEdgeChanges(changes, edgesRef.current);
            updateTabContent(activeTab.id, { edges: updated });
        },
        [activeTab, updateTabContent]
    );

    // When nodes are deleted (by ReactFlow internally), also remove connected edges
    const onNodesDelete = useCallback(
        (deletedNodes) => {
            const deletedIds = new Set(deletedNodes.map((n) => n.id));
            const filtered = edgesRef.current.filter(
                (e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)
            );
            updateTabContent(activeTab.id, { edges: filtered });
        },
        [activeTab, updateTabContent]
    );

    // Delete selected nodes/edges — callable from both keyboard and button
    const deleteSelected = useCallback(() => {
        const currentNodes = nodesRef.current;
        const currentEdges = edgesRef.current;

        const selectedNodes = currentNodes.filter((n) => n.selected);
        const selectedEdges = currentEdges.filter((e) => e.selected);

        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

        const deletedNodeIds = new Set(selectedNodes.map((n) => n.id));

        // Remove selected nodes
        const newNodes = currentNodes.filter((n) => !deletedNodeIds.has(n.id));

        // Remove selected edges AND edges connected to deleted nodes
        const selectedEdgeIds = new Set(selectedEdges.map((e) => e.id));
        const newEdges = currentEdges.filter(
            (e) =>
                !selectedEdgeIds.has(e.id) &&
                !deletedNodeIds.has(e.source) &&
                !deletedNodeIds.has(e.target)
        );

        updateTabContent(activeTab.id, { nodes: newNodes, edges: newEdges });
    }, [activeTab, updateTabContent]);

    // Global keyboard listener for Delete/Backspace
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't intercept if user is typing in an input/textarea
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

            // Check if the event is within our canvas wrapper
            const wrapper = reactFlowWrapper.current;
            if (!wrapper) return;
            if (!wrapper.contains(e.target) && e.target !== document.body) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelected();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [deleteSelected]);



    const onConnect = useCallback(
        (params) => {
            const updated = addEdge({
                ...params,
                type: activeEdgeStyle,
                markerEnd: defaultEdgeOptions.markerEnd,
            }, edgesRef.current);
            updateTabContent(activeTab.id, { edges: updated });
        },
        [activeTab, updateTabContent, activeEdgeStyle]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) return;

            const label = event.dataTransfer.getData('application/label') || '';
            const category = event.dataTransfer.getData('application/category') || 'shape';

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Component nodes: standalone, smaller, no bg
            if (category === 'component') {
                const newNode = {
                    id: uuidv4(),
                    type,
                    position,
                    data: { label, type },
                    style: { width: 60, height: 55 },
                };
                const updated = nodesRef.current.concat(newNode);
                updateTabContent(activeTab.id, { nodes: updated });
                return;
            }

            // Shape nodes
            const newNode = {
                id: uuidv4(),
                type,
                position,
                data: { label: '', type, color: 'var(--bg-card)' },
                style: { width: 80, height: 45 },
            };

            if (type === 'circle' || type === 'diamond' || type === 'hexagon') {
                newNode.style = { width: 55, height: 55 };
            }
            if (type === 'triangle') {
                newNode.style = { width: 65, height: 55 };
            }

            const updated = nodesRef.current.concat(newNode);
            updateTabContent(activeTab.id, { nodes: updated });
        },
        [reactFlowInstance, activeTab, updateTabContent]
    );

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();
            const rect = reactFlowWrapper.current.getBoundingClientRect();
            setColorPickerPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
            setPickerNodeId(node.id);
            setPickerCurrentColor(node.data?.color || 'var(--bg-card)');
            setColorPickerVisible(true);
        },
        []
    );

    const onPaneClick = useCallback(() => {
        setColorPickerVisible(false);
    }, []);

    const changeNodeColor = useCallback((nodeId, color) => {
        const updated = nodesRef.current.map((node) => {
            if (node.id === nodeId) {
                return { ...node, data: { ...node.data, color } };
            }
            return node;
        });
        updateTabContent(activeTab.id, { nodes: updated });
        setColorPickerVisible(false);
    }, [activeTab, updateTabContent]);

    if (!activeTab) return null;

    const isDark = theme === 'dark';

    return (
        <div className="canvas-wrapper">
            <div className="reactflow-wrapper" ref={reactFlowWrapper} tabIndex={-1}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodesDelete={onNodesDelete}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeContextMenu={onNodeContextMenu}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionMode={ConnectionMode.Loose}
                    connectionLineType="bezier"
                    connectionLineStyle={{ stroke: 'var(--accent-blue)', strokeWidth: 1.2, strokeDasharray: '5 3' }}
                    deleteKeyCode={['Backspace', 'Delete']}
                    selectionKeyCode={['Shift']}
                    multiSelectionKeyCode={['Meta', 'Control']}
                    snapToGrid={true}
                    snapGrid={[20, 20]}
                    fitView
                    className={isDark ? "flow-canvas dark-theme-flow" : "flow-canvas light-theme-flow"}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        color={isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.06)'}
                        gap={20}
                        size={1.5}
                        variant="dots"
                    />
                    <Controls
                        showInteractive={false}
                        className="flow-controls"
                    />
                </ReactFlow>

                {/* Floating toolbar overlaid on the canvas */}
                <SidebarElements activeEdgeStyle={activeEdgeStyle} onEdgeStyleChange={setActiveEdgeStyle} />



                {colorPickerVisible && (
                    <ColorPicker
                        position={colorPickerPos}
                        selectedNodeId={pickerNodeId}
                        currentColor={pickerCurrentColor}
                        onColorChange={changeNodeColor}
                        onClose={() => setColorPickerVisible(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default function SystemCanvas() {
    return (
        <ReactFlowProvider>
            <FlowCanvas />
        </ReactFlowProvider>
    );
}
