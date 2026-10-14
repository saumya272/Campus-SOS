// Made-up sample incidents so the responder dashboard is useful on first launch.
// No real people, places or incidents are used.

const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000);

export const FIRST_SAMPLE_NUMBER = 1005; // highest sample reference number

export function createSampleIncidents() {
  return [
    {
      id: 'SOS-1001',
      type: 'Medical',
      description: 'A student feels dizzy and faint after a workout and is sitting on the floor.',
      location: 'Sports complex, main entrance',
      status: 'Responding',
      ownerId: 'sample',
      createdAt: minutesAgo(14),
      updatedAt: minutesAgo(6),
    },
    {
      id: 'SOS-1002',
      type: 'Security',
      description: 'An unfamiliar person is trying the locks on several parked bicycles.',
      location: 'Bike racks behind the Science Block',
      status: 'New',
      ownerId: 'sample',
      createdAt: minutesAgo(4),
      updatedAt: minutesAgo(4),
    },
    {
      id: 'SOS-1003',
      type: 'Fire',
      description: 'Smell of burning and light smoke coming from a microwave in the common room.',
      location: 'Hostel B, ground-floor common room',
      status: 'Acknowledged',
      ownerId: 'sample',
      createdAt: minutesAgo(22),
      updatedAt: minutesAgo(18),
    },
    {
      id: 'SOS-1004',
      type: 'Other',
      description: 'Water is leaking across the corridor floor. It is a slip risk.',
      location: 'Library, 2nd-floor corridor',
      status: 'Resolved',
      ownerId: 'sample',
      createdAt: minutesAgo(95),
      updatedAt: minutesAgo(40),
    },
    {
      id: 'SOS-1005',
      type: 'Medical',
      description: 'Minor cut on a hand from broken lab glassware. Bleeding is slow but needs a dressing.',
      location: 'Chemistry Lab 3',
      status: 'New',
      ownerId: 'sample',
      createdAt: minutesAgo(9),
      updatedAt: minutesAgo(9),
    },
  ];
}
