"use client";

import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { ADMIN_CHANNEL, EVENTS } from '@/lib/realtime';

type Handlers = Partial<Record<(typeof EVENTS)[keyof typeof EVENTS], (data: any) => void>>;

let client: Pusher | null = null;

function getClient(): Pusher | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!key || !cluster) return null;

  // One shared WebSocket connection per browser tab
  if (!client) {
    client = new Pusher(key, {
      cluster,
      channelAuthorization: { endpoint: '/api/pusher/auth', transport: 'ajax' },
    });
  }
  return client;
}

/**
 * Subscribes the current admin to the private admin channel over WebSockets.
 * Handlers can change between renders without re-subscribing.
 */
export function useAdminChannel(handlers: Handlers) {
  const handlersRef = useRef(handlers);
  const [status, setStatus] = useState<'disabled' | 'connecting' | 'live' | 'error'>('connecting');

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const pusher = getClient();
    if (!pusher) {
      setStatus('disabled');
      return;
    }

    const channel = pusher.subscribe(ADMIN_CHANNEL);
    channel.bind('pusher:subscription_succeeded', () => setStatus('live'));
    channel.bind('pusher:subscription_error', () => setStatus('error'));

    for (const event of Object.values(EVENTS)) {
      channel.bind(event, (data: any) => handlersRef.current[event]?.(data));
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(ADMIN_CHANNEL);
    };
  }, []);

  return status;
}
