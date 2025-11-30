/**
 * WebSocket hook for real-time list synchronization.
 * Manages WebSocket connection lifecycle and message handling.
 * Following SOLID principles - single responsibility for WebSocket management.
 */
import { useEffect, useRef, useState } from 'react';

export default function useWebSocket(listId, onMessage) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    // Update the ref whenever onMessage changes
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!listId) return;

        const connectWebSocket = () => {
            // WebSocket URL - adjust protocol based on current protocol
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/lists/${listId}/`;

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);
                    if (onMessageRef.current) {
                        onMessageRef.current(data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);

                // Attempt to reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 3000);
            };
        };

        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [listId]); // Only reconnect when listId changes

    return { isConnected };
}
