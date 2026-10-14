import { STATUSES } from '../data/constants';

// Shows the four workflow steps and highlights the current one.
export default function StatusTracker({ status }) {
  const currentIndex = STATUSES.indexOf(status);
  return (
    <ol className="tracker" aria-label="Status progress">
      {STATUSES.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo';
        return (
          <li
            key={step}
            className={`tracker-step tracker-${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="tracker-marker" aria-hidden="true">
              {state === 'done' ? '✓' : index + 1}
            </span>
            <span className="tracker-label">
              {step}
              {state === 'done' && <span className="sr-only"> (completed)</span>}
              {state === 'current' && <span className="sr-only"> (current)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
