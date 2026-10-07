import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { getPusher, ADMIN_CHANNEL } from '@/lib/pusher';

/**
 * Authorizes private Pusher channel subscriptions.
 * Only admins may join the admin notifications channel.
 */
export async function POST(req: Request) {
  const pusher = getPusher();
  if (!pusher) {
    return NextResponse.json({ error: 'Realtime not configured' }, { status: 503 });
  }

  const user: any = await getUserFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const socketId = form.get('socket_id')?.toString();
  const channel = form.get('channel_name')?.toString();

  if (!socketId || !channel) {
    return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
  }

  if (channel !== ADMIN_CHANNEL || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(pusher.authorizeChannel(socketId, channel));
}
