import { useState } from 'react';
import { Square, Circle, RectangleHorizontal, Triangle, Diamond, Hexagon } from 'lucide-react';
import {
    BsServer, BsHddStack, BsPhone, BsGlobe2, BsLayersHalf,
    BsDiagram3, BsLightning, BsCloudFill,
    BsShieldLock, BsCpu, BsHddNetwork, BsEnvelope,
    BsPerson, BsActivity, BsCodeSlash, BsArchive,
    BsBell, BsSearch, BsGear,
    BsLock, BsCloudArrowUp, BsBoxSeam, BsRouter,
    BsDatabase, BsWindow, BsKanban, BsGraphUp,
} from 'react-icons/bs';
import './SidebarElements.css';

const shapes = [
    { type: 'square', label: 'Rectangle', icon: Square },
    { type: 'rounded', label: 'Rounded Rect', icon: RectangleHorizontal },
    { type: 'circle', label: 'Circle', icon: Circle },
    { type: 'triangle', label: 'Triangle', icon: Triangle },
    { type: 'diamond', label: 'Diamond', icon: Diamond },
    { type: 'hexagon', label: 'Hexagon', icon: Hexagon },
];

const components = [
    { type: 'server', label: 'Server', icon: BsServer, category: 'compute' },
    { type: 'database', label: 'Database', icon: BsDatabase, category: 'data' },
    { type: 'cache', label: 'Cache', icon: BsHddStack, category: 'data' },
    { type: 'storage', label: 'Storage', icon: BsArchive, category: 'data' },
    { type: 'webapp', label: 'Web App', icon: BsWindow, category: 'compute' },
    { type: 'api', label: 'API', icon: BsCodeSlash, category: 'compute' },
    { type: 'microservice', label: 'Microservice', icon: BsCpu, category: 'compute' },
    { type: 'container', label: 'Container', icon: BsBoxSeam, category: 'compute' },
    { type: 'lb', label: 'Load Balancer', icon: BsDiagram3, category: 'network' },
    { type: 'cdn', label: 'CDN', icon: BsCloudFill, category: 'network' },
    { type: 'dns', label: 'DNS', icon: BsHddNetwork, category: 'network' },
    { type: 'gateway', label: 'API Gateway', icon: BsLightning, category: 'network' },
    { type: 'router', label: 'Router', icon: BsRouter, category: 'network' },
    { type: 'firewall', label: 'Firewall', icon: BsShieldLock, category: 'security' },
    { type: 'auth', label: 'Auth Service', icon: BsLock, category: 'security' },
    { type: 'queue', label: 'Message Queue', icon: BsEnvelope, category: 'messaging' },
    { type: 'notification', label: 'Notification', icon: BsBell, category: 'messaging' },
    { type: 'client', label: 'Client App', icon: BsPhone, category: 'client' },
    { type: 'web', label: 'Browser', icon: BsGlobe2, category: 'client' },
    { type: 'user', label: 'User', icon: BsPerson, category: 'client' },
    { type: 'upload', label: 'Cloud Upload', icon: BsCloudArrowUp, category: 'storage' },
    { type: 'monitor', label: 'Monitoring', icon: BsActivity, category: 'ops' },
    { type: 'search', label: 'Search', icon: BsSearch, category: 'ops' },
    { type: 'scheduler', label: 'Scheduler', icon: BsGear, category: 'ops' },
    { type: 'analytics', label: 'Analytics', icon: BsGraphUp, category: 'ops' },
    { type: 'task', label: 'Task Queue', icon: BsKanban, category: 'ops' },
    { type: 'layer', label: 'Layer', icon: BsLayersHalf, category: 'ops' },
];

const connectorStyles = [
    { type: 'solid', label: 'Solid', dasharray: null },
    { type: 'dashed', label: 'Dashed', dasharray: '8 4' },
    { type: 'dotted', label: 'Dotted', dasharray: '2 3' },
    { type: 'animated', label: 'Stream', dasharray: '6 4', animated: true },
];

function ConnectorPreview({ dasharray, animated }) {
    return (
        <svg width="40" height="20" viewBox="0 0 40 20" className={animated ? 'connector-preview-animated' : ''}>
            <path
                d="M 2 17 C 12 0, 28 0, 38 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray={dasharray || 'none'}
                strokeLinecap="round"
            />
            {/* Arrow marker */}
            <polygon
                points="35,14 39,18 35,18"
                fill="currentColor"
                opacity="0.8"
            />
        </svg>
    );
}

export default function SidebarElements({ activeEdgeStyle, onEdgeStyleChange }) {
    const [activeSection, setActiveSection] = useState('shapes');

    const onDragStart = (event, nodeType, label, category) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.setData('application/category', category || 'shape');
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="floating-toolbar">
            {/* Tab switcher */}
            <div className="toolbar-tabs">
                <button
                    className={`toolbar-tab ${activeSection === 'shapes' ? 'active' : ''}`}
                    onClick={() => setActiveSection('shapes')}
                >
                    Shapes
                </button>
                <button
                    className={`toolbar-tab ${activeSection === 'components' ? 'active' : ''}`}
                    onClick={() => setActiveSection('components')}
                >
                    Components
                </button>
                <button
                    className={`toolbar-tab ${activeSection === 'connectors' ? 'active' : ''}`}
                    onClick={() => setActiveSection('connectors')}
                >
                    Connectors
                </button>
            </div>

            {/* Items grid */}
            <div className="toolbar-items-wrapper">
                {activeSection === 'shapes' && (
                    <div className="toolbar-items-row">
                        {shapes.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.type}
                                    className="toolbar-shape-item"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item.type, item.label, 'shape')}
                                    title={item.label}
                                >
                                    <Icon size={16} strokeWidth={1.8} />
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeSection === 'components' && (
                    <div className="toolbar-items-grid">
                        {components.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.type}
                                    className="toolbar-shape-item toolbar-component-item"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item.type, item.label, 'component')}
                                    title={item.label}
                                >
                                    <Icon size={14} />
                                    <span className="component-label">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeSection === 'connectors' && (
                    <div className="connector-styles-row">
                        {connectorStyles.map((cs) => (
                            <button
                                key={cs.type}
                                className={`connector-style-item ${activeEdgeStyle === cs.type ? 'active' : ''}`}
                                onClick={() => onEdgeStyleChange(cs.type)}
                                title={cs.label}
                            >
                                <ConnectorPreview dasharray={cs.dasharray} animated={cs.animated} />
                                <span className="connector-style-label">{cs.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
