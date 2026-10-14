// Shared constants for the Campus SOS demo.

export const EMERGENCY_TYPES = ['Medical', 'Security', 'Fire', 'Other'];

// The status workflow, in order. A responder can only move forward one step.
export const STATUSES = ['New', 'Acknowledged', 'Responding', 'Resolved'];

export const MAX_DESCRIPTION_LENGTH = 300;

// Every alert created in this browser tab belongs to this fake "student".
// This is NOT a real user id - there is no login in this prototype.
export const STUDENT_ID = 'demo-student';

// Plain-language explanation of each status, shown to the student.
export const STATUS_HELP = {
  New: 'Your demo alert was created. In a real system it would now be waiting for a responder.',
  Acknowledged: 'A responder has seen the alert (demo).',
  Responding: 'A responder is on the way (demo).',
  Resolved: 'The responder marked this incident as resolved (demo).',
};

// Returns the next valid status, or null if the incident is already resolved.
export function getNextStatus(status) {
  const index = STATUSES.indexOf(status);
  if (index === -1 || index === STATUSES.length - 1) return null;
  return STATUSES[index + 1];
}
