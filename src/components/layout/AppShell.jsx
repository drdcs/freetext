import { useState, useRef } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import TabBar from './TabBar';
import RichTextEditor from '../editor/RichTextEditor';
import SystemCanvas from '../canvas/SystemCanvas';
import FeedbackEnhancementsPanel from './FeedbackEnhancementsPanel';
import './AppShell.css';

const RIGHT_PANEL_COLLAPSED_SIZE = 40;

export default function AppShell() {
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
    const rightPanelRef = useRef(null);

    return (
        <div className="app-shell app-container">
            <TabBar />
            <div className="app-content">
                <Group direction="horizontal">
                    {/* Panel 1: Design notes (high-level / low-level) — sizes in % */}
                    <Panel id="notes" defaultSize="28" minSize="18" maxSize="45" className="panel-pane">
                        <RichTextEditor />
                    </Panel>

                    <Separator className="panel-separator vertical" />

                    {/* Panel 2: Workflow diagram — drag/drop, connectors, flows */}
                    <Panel id="diagram" defaultSize="44" minSize="25" className="panel-pane">
                        <SystemCanvas />
                    </Panel>

                    <Separator className="panel-separator vertical" />

                    {/* Panel 3: Feedback & Enhancements (collapsible, small) */}
                    <Panel
                        id="feedback"
                        panelRef={rightPanelRef}
                        defaultSize="28"
                        minSize="18"
                        maxSize="40"
                        collapsible
                        collapsedSize={RIGHT_PANEL_COLLAPSED_SIZE}
                        onResize={(size) => {
                            setRightPanelCollapsed(size.inPixels <= RIGHT_PANEL_COLLAPSED_SIZE + 2);
                        }}
                        className="panel-pane"
                    >
                        <FeedbackEnhancementsPanel
                            isCollapsed={rightPanelCollapsed}
                            onCollapse={() => rightPanelRef.current?.collapse()}
                            onExpand={() => rightPanelRef.current?.expand()}
                        />
                    </Panel>
                </Group>
            </div>
        </div>
    );
}
