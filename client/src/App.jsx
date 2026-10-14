import { useRef, useState } from 'react';
import StudentView from './components/StudentView';
import ResponderView from './components/ResponderView';
import { STUDENT_ID, getNextStatus } from './data/constants';
import { FIRST_SAMPLE_NUMBER, createSampleIncidents } from './data/sampleIncidents';

export default function App() {
  const [role, setRole] = useState('student');
  // All demo data lives here, in memory only. It resets when the page reloads.
  const [incidents, setIncidents] = useState(createSampleIncidents);
  const lastNumber = useRef(FIRST_SAMPLE_NUMBER);

  function createIncident({ type, description, location }) {
    lastNumber.current += 1;
    const now = new Date();
    const incident = {
      id: `SOS-${lastNumber.current}`,
      type,
      description,
      location,
      status: 'New',
      ownerId: STUDENT_ID,
      createdAt: now,
      updatedAt: now,
    };
    setIncidents((current) => [incident, ...current]);
    return incident;
  }

  // Only allow the next step in the workflow (New -> Acknowledged -> Responding -> Resolved).
  function changeStatus(id, newStatus) {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === id && getNextStatus(incident.status) === newStatus
          ? { ...incident, status: newStatus, updatedAt: new Date() }
          : incident
      )
    );
  }

  function resetDemo() {
    lastNumber.current = FIRST_SAMPLE_NUMBER;
    setIncidents(createSampleIncidents());
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <div className="demo-banner" role="note">
        <strong>Demo only.</strong> Campus SOS is a prototype. It does not contact responders or emergency
        services. In a real emergency, contact your campus security or local emergency number directly.
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <p className="brand">Campus SOS</p>
          <nav aria-label="Prototype view switcher" className="switcher">
            <span className="switcher-label">Demo view (not a real login):</span>
            <button
              type="button"
              className="switch-btn"
              aria-pressed={role === 'student'}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className="switch-btn"
              aria-pressed={role === 'responder'}
              onClick={() => setRole('responder')}
            >
              Responder
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="container">
        {role === 'student' ? (
          <StudentView incidents={incidents} onCreateIncident={createIncident} />
        ) : (
          <ResponderView incidents={incidents} onChangeStatus={changeStatus} />
        )}
      </main>

      <footer className="container site-footer">
        <p>
          Prototype frontend with sample data stored only in this page&apos;s memory. Locations are estimates and
          are never guaranteed to be exact.
        </p>
        <button type="button" className="btn btn-link" onClick={resetDemo}>
          Reset demo data
        </button>
      </footer>
    </>
  );
}
