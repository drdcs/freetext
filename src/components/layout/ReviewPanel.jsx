import { useTabs } from '../../context/TabContext';
import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';
import './ReviewPanel.css';

export default function ReviewPanel() {
    const { activeTab, updateTabContent } = useTabs();
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        if (activeTab) {
            setReviewText(activeTab.reviewText || '');
        }
    }, [activeTab]);

    const handleChange = (e) => {
        const text = e.target.value;
        setContent(text);
        if (activeTab) {
            updateTabContent(activeTab.id, { reviewText: text });
        }
    };

    const setContent = (text) => {
        setReviewText(text);
    }

    if (!activeTab) return null;

    return (
        <div className="review-panel flex flex-col h-full bg-primary border-t border-color">
            <div className="panel-header px-4 py-3 flex items-center justify-between border-b border-color">
                <div className="flex items-center gap-2 text-muted">
                    <MessageSquare size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Review & Improvements</span>
                </div>
            </div>

            <div className="panel-content flex-1 p-4 overflow-y-auto">
                <textarea
                    className="review-textarea w-full h-full p-3 text-sm resize-none focus:outline-none bg-transparent"
                    placeholder="Document your trade-offs, bottlenecks, and future scaling improvements here..."
                    value={reviewText}
                    onChange={handleChange}
                    spellCheck="false"
                />
            </div>
        </div>
    );
}
