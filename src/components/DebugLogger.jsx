
import React, { useState, useEffect } from 'react';

const DebugLogger = () => {
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Capture Console Log
        const originalLog = console.log;
        console.log = (...args) => {
            setLogs(prev => [...prev.slice(-10), `LOG: ${args.join(' ')}`]);
            originalLog(...args);
        };

        // Capture Console Error
        const originalError = console.error;
        console.error = (...args) => {
            setLogs(prev => [...prev.slice(-10), `ERR: ${args.join(' ')}`]);
            setIsVisible(true); // Auto-show on error
            originalError(...args);
        };

        // Capture Window Errors
        const handleError = (event) => {
            setLogs(prev => [...prev.slice(-10), `WIN: ${event.message}`]);
            setIsVisible(true);
        };

        // Capture Promise Rejections
        const handleRejection = (event) => {
            setLogs(prev => [...prev.slice(-10), `PRM: ${event.reason}`]);
            setIsVisible(true);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            console.log = originalLog;
            console.error = originalError;
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: 'rgba(0,0,0,0.9)',
            color: '#0f0',
            zIndex: 99999,
            overflowY: 'auto',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'monospace',
            pointerEvents: 'none' // Click through except mainly for reading
        }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                DEBUG CONSOLE
                <button
                    onClick={() => setIsVisible(false)}
                    style={{ float: 'right', pointerEvents: 'auto', color: 'white' }}
                >
                    [X]
                </button>
            </h3>
            {logs.map((log, i) => (
                <div key={i} style={{ borderBottom: '1px solid #111', padding: '2px 0' }}>
                    {log}
                </div>
            ))}
        </div>
    );
};

export default DebugLogger;
