/**
 * Realtime channel/event names shared by server and browser code.
 * Keep this file free of imports so it is safe to bundle on the client.
 */
export const ADMIN_CHANNEL = 'private-admin';

export const EVENTS = {
  COURSE_SUBMITTED: 'course-submitted',
  COURSE_STATUS_UPDATED: 'course-status-updated',
} as const;

export type CourseSubmittedPayload = {
  _id: string;
  title: string;
  category?: string;
  price?: number;
  instructor?: string;
  thumbnail?: string;
  status: 'pending';
  resubmitted?: boolean;
  createdAt?: string;
};

export type CourseStatusUpdatedPayload = {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
};
