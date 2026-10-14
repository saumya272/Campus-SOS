import { useEffect, useRef, useState } from 'react';
import SosForm from './SosForm';
import StatusBadge from './StatusBadge';
import StatusTracker from './StatusTracker';
import { STATUS_HELP, STUDENT_ID } from '../data/constants';
import { formatTime, timeAgo } from '../utils/time';

export default function StudentView({ incidents, onCreateIncident }) {
  const [confirmation, setConfirmation] = useState(null); // the incident just created
  const confirmationRef = useRef(null);

  // Only this student's own incidents, newest first.
  const myIncidents = incidents
    .filter((incident) => incident.ownerId === STUDENT_ID)
    .sort((a, b) => b.createdAt - a.createdAt);

  function handleSubmit(data) {
    setConfirmation(onCreateIncident(data));
  }

  // Move focus to the confirmation so keyboard and screen-reader users notice it.
  useEffect(() => {
    if (confirmation) confirmationRef.current?.focus();
  }, [confirmation]);

  return (
    <div className="stack">
      <div>
        <h1>Student: request help (demo)</h1>
        <p className="lead">
          Try out how a student would send an alert and follow its progress. Nothing here is sent anywhere.
        </p>
      </div>

      {confirmation && (
        <section
          className="card confirmation"
          role="status"
          tabIndex={-1}
          ref={confirmationRef}
          aria-labelledby="confirmation-title"
        >
          <h2 id="confirmation-title">Demo alert created</h2>
          <p>
            Your incident reference is <strong className="ref">{confirmation.id}</strong>. It now appears in the
            responder view and in your list below.
          </p>
          <p className="hint">No real responder or emergency service has been contacted.</p>
        </section>
      )}

      <SosForm onSubmit={handleSubmit} />

      <section aria-labelledby="my-incidents-title">
        <h2 id="my-incidents-title">My demo incidents</h2>
        {myIncidents.length === 0 ? (
          <div className="empty">
            <p>You haven&apos;t sent any demo alerts yet.</p>
            <p className="hint">Fill in the form above and choose &ldquo;Send demo SOS&rdquo; to see one here.</p>
          </div>
        ) : (
          <ul className="list">
            {myIncidents.map((incident) => (
              <li key={incident.id} className="card incident-card">
                <div className="row-between">
                  <h3>
                    {incident.id} · {incident.type}
                  </h3>
                  <StatusBadge status={incident.status} />
                </div>
                <p>{incident.description}</p>
                <p className="meta">
                  <span>Location: {incident.location}</span>
                  <span>Sent {formatTime(incident.createdAt)}</span>
                  <span>Status updated {timeAgo(incident.updatedAt)}</span>
                </p>
                <StatusTracker status={incident.status} />
                <p className="status-help">
                  <strong>Latest status: {incident.status}.</strong> {STATUS_HELP[incident.status]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
