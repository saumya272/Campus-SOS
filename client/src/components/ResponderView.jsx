import { useRef, useState } from 'react';
import StatusBadge from './StatusBadge';
import StatusTracker from './StatusTracker';
import { EMERGENCY_TYPES, STATUSES, getNextStatus } from '../data/constants';
import { formatTime, timeAgo } from '../utils/time';

export default function ResponderView({ incidents, onChangeStatus }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('');
  const detailsHeadingRef = useRef(null);

  const activeCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const countOf = (status) => incidents.filter((i) => i.status === status).length;

  const query = search.trim().toLowerCase();
  const visible = incidents
    .filter((i) => statusFilter === 'All' || i.status === statusFilter)
    .filter((i) => typeFilter === 'All' || i.type === typeFilter)
    .filter(
      (i) =>
        !query ||
        [i.id, i.type, i.location, i.description].some((text) => text.toLowerCase().includes(query))
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const selected = incidents.find((i) => i.id === selectedId) || null;
  const filtersActive = query !== '' || statusFilter !== 'All' || typeFilter !== 'All';

  function clearFilters() {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
  }

  function openIncident(id) {
    setSelectedId(id);
    setNotice('');
    // On small screens the details appear below the list, so bring them into view.
    if (window.matchMedia('(max-width: 899px)').matches) {
      setTimeout(() => {
        detailsHeadingRef.current?.focus();
        detailsHeadingRef.current?.scrollIntoView({ block: 'start' });
      }, 0);
    }
  }

  function advance(incident) {
    const next = getNextStatus(incident.status);
    if (!next) return;
    onChangeStatus(incident.id, next);
    setNotice(`${incident.id} moved to ${next}. The student's tracking view is updated.`);
  }

  const nextStatus = selected ? getNextStatus(selected.status) : null;

  return (
    <div className="stack">
      <div>
        <h1>Responder dashboard (demo)</h1>
        <p className="lead">Review sample incidents and practise moving them through the status workflow.</p>
      </div>

      <section aria-label="Incident summary" className="stats">
        <div className="stat stat-main">
          <span className="stat-number">{activeCount}</span>
          <span className="stat-label">Active incidents</span>
        </div>
        <div className="stat">
          <span className="stat-number">{countOf('New')}</span>
          <span className="stat-label">New</span>
        </div>
        <div className="stat">
          <span className="stat-number">{countOf('Responding')}</span>
          <span className="stat-label">Responding</span>
        </div>
        <div className="stat">
          <span className="stat-number">{countOf('Resolved')}</span>
          <span className="stat-label">Resolved</span>
        </div>
      </section>

      <div className="responder-layout">
        <section aria-labelledby="incident-list-title">
          <h2 id="incident-list-title">Incidents</h2>

          <div className="card filters">
            <div className="field">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                type="search"
                placeholder="Reference, place or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="status-filter">Status</label>
              <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="type-filter">Type</label>
              <select id="type-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="All">All types</option>
                {EMERGENCY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="hint" role="status">
            Showing {visible.length} of {incidents.length} incidents
          </p>

          {visible.length === 0 ? (
            <div className="empty">
              <p>No incidents match your search or filters.</p>
              {filtersActive && (
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <ul className="list">
              {visible.map((incident) => (
                <li key={incident.id}>
                  <button
                    type="button"
                    className={`incident-row${incident.id === selectedId ? ' is-selected' : ''}`}
                    onClick={() => openIncident(incident.id)}
                    aria-current={incident.id === selectedId ? 'true' : undefined}
                    aria-label={`View details for ${incident.id}, ${incident.type}, ${incident.location}, status ${incident.status}`}
                  >
                    <span className="row-between">
                      <span className="row-title">
                        {incident.id} · {incident.type}
                      </span>
                      <StatusBadge status={incident.status} />
                    </span>
                    <span className="row-location">{incident.location}</span>
                    <span className="meta">
                      <span>{formatTime(incident.createdAt)}</span>
                      <span>{timeAgo(incident.createdAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="details" aria-labelledby="details-title">
          {!selected ? (
            <div className="empty">
              <h2 id="details-title">Incident details</h2>
              <p>Select an incident from the list to see its details and update its status.</p>
            </div>
          ) : (
            <div className="card">
              <div className="row-between">
                <h2 id="details-title" tabIndex={-1} ref={detailsHeadingRef}>
                  {selected.id} · {selected.type}
                </h2>
                <StatusBadge status={selected.status} />
              </div>

              <dl className="detail-list">
                <div>
                  <dt>Description</dt>
                  <dd>{selected.description}</dd>
                </div>
                <div>
                  <dt>Location (reported by student, may be approximate)</dt>
                  <dd>{selected.location}</dd>
                </div>
                <div>
                  <dt>Reported</dt>
                  <dd>
                    {formatTime(selected.createdAt)} ({timeAgo(selected.createdAt)})
                  </dd>
                </div>
                <div>
                  <dt>Last status change</dt>
                  <dd>{timeAgo(selected.updatedAt)}</dd>
                </div>
              </dl>

              <h3>Status workflow</h3>
              <StatusTracker status={selected.status} />

              {nextStatus ? (
                <button type="button" className="btn btn-primary" onClick={() => advance(selected)}>
                  Mark as {nextStatus}
                </button>
              ) : (
                <p className="message message-success">This incident is resolved. No further changes are available.</p>
              )}
              <p className="hint">Statuses can only move forward one step at a time.</p>

              <p className="message message-success" role="status" hidden={!notice}>
                {notice}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
