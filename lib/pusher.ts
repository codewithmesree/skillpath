import Pusher from 'pusher';
import { ADMIN_CHANNEL, EVENTS } from './realtime';

export { ADMIN_CHANNEL, EVENTS };

let client: Pusher | null = null;

export function getPusher(): Pusher | null {
  if (client) return client;

  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    return null;
  }

  client = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
  return client;
}

/**
 * Fire-and-forget realtime event. Never throws: a notification failure
 * must not fail the API request that triggered it.
 */
export async function notifyAdmins(event: string, payload: Record<string, unknown>) {
  const pusher = getPusher();
  if (!pusher) {
    console.warn(`[pusher] Not configured; skipped "${event}" notification.`);
    return;
  }
  try {
    await pusher.trigger(ADMIN_CHANNEL, event, payload);
  } catch (err: any) {
    console.error(`[pusher] Failed to send "${event}":`, err?.message || err);
  }
}
