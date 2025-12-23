import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url?: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const manuallyClosed = useRef(false);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  useEffect(() => {
    if (!url || !url.startsWith('ws')) return;

    manuallyClosed.current = false;

    const connect = () => {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => setConnected(true);

        ws.onmessage = (event) => setLastMessage(event);

        ws.onclose = () => {
          setConnected(false);
          if (!manuallyClosed.current) {
            setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          // Suppress expected errors silently
        };

        wsRef.current = ws;
      } catch (err) {
        // Fail silently or log to external monitoring, do NOT pollute console
      }
    };

    connect();

    return () => {
      manuallyClosed.current = true;
      wsRef.current?.close();
    };
  }, [url]);

  const sendMessage = (data: string) => {
    if (wsRef.current && connected) wsRef.current.send(data);
  };

  return { connected, lastMessage, sendMessage };
}
