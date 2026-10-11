import { useState } from 'react';
import './App.css';

const startingIncidents = [
  {
    id: 1,
    type: 'Medical',
    location: 'Library, first floor',
    status: 'New',
    time: '10:42 AM',
  },
  {
    id: 2,
    type: 'Security',
    location: 'Near the main gate',
    status: 'Acknowledged',
    time: '10:18 AM',
  },
];

function App() {
  const [view, setView] = useState('student');
  const [emergencyType, setEmergencyType] = useState('Medical');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [incidents, setIncidents] = useState(startingIncidents);

  function sendDemoAlert(event) {
    event.preventDefault();

    const newIncident = {
      id: Date.now(),
      type: emergencyType,
      location: location.trim() || 'Location not provided',
      status: 'New',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setIncidents((currentIncidents) => [newIncident, ...currentIncidents]);
    setMessage('Demo alert added to the responder list.');
    setLocation('');
  }

  function updateStatus(id) {
    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) => {
        if (incident.id !== id) return incident;

        const nextStatus =
          incident.status === 'New' ? 'Acknowledged' : 'Resolved';

        return { ...incident, status: nextStatus };
      }),
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CAMPUS SAFETY PROJECT</p>
          <h1>Campus SOS</h1>
        </div>

        <span className="prototype-label">Prototype · sample data</span>
      </header>

      <nav className="view-switch" aria-label="Choose a prototype screen">
        <button
          className={view === 'student' ? 'selected' : ''}
          onClick={() => setView('student')}
        >
          Student screen
        </button>
        <button
          className={view === 'responder' ? 'selected' : ''}
          onClick={() => setView('responder')}
        >
          Responder screen
        </button>
      </nav>

      {view === 'student' ? (
        <section className="panel student-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">STUDENT</p>
              <h2>Request help</h2>
            </div>
            <span className="status-pill">Ready</span>
          </div>

          <p className="intro">
            Choose an emergency type and add a location for this demo alert.
          </p>

          <form onSubmit={sendDemoAlert}>
            <label htmlFor="emergencyType">Emergency type</label>
            <select
              id="emergencyType"
              value={emergencyType}
              onChange={(event) => setEmergencyType(event.target.value)}
            >
              <option>Medical</option>
              <option>Security</option>
              <option>Fire</option>
              <option>Other</option>
            </select>

            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Example: Science block, room 204"
            />

            <button className="sos-button" type="submit">
              Send demo SOS
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}

          <p className="notice">
            Demo only. This button does not contact campus security or emergency
            services.
          </p>
        </section>
      ) : (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RESPONDER</p>
              <h2>Incident dashboard</h2>
            </div>
            <span className="status-pill">{incidents.length} incidents</span>
          </div>

          <p className="intro">
            Sample incidents for the screen prototype. Select an action to
            change an incident’s status.
          </p>

          <div className="incident-list">
            {incidents.map((incident) => (
              <article className="incident-card" key={incident.id}>
                <div>
                  <div className="incident-title">
                    <h3>{incident.type}</h3>
                    <span className={`incident-status ${incident.status.toLowerCase()}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p>{incident.location}</p>
                  <small>Reported at {incident.time}</small>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => updateStatus(incident.id)}
                  disabled={incident.status === 'Resolved'}
                >
                  {incident.status === 'New'
                    ? 'Acknowledge'
                    : incident.status === 'Resolved'
                      ? 'Resolved'
                      : 'Mark resolved'}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;