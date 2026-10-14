import { useRef, useState } from 'react';
import { EMERGENCY_TYPES, MAX_DESCRIPTION_LENGTH } from '../data/constants';

const EMPTY_FORM = { type: '', description: '', location: '' };

function validate(values) {
  const errors = {};
  if (!values.type) errors.type = 'Choose an emergency type.';

  const description = values.description.trim();
  if (!description) errors.description = 'Describe what is happening.';
  else if (description.length < 10) errors.description = 'Add a little more detail (at least 10 characters).';

  const location = values.location.trim();
  if (!location) errors.location = 'Enter where you are, or use the location button.';
  else if (location.length < 3) errors.location = 'Location is too short. Add a building or landmark.';

  return errors;
}

function describeLocationError(error) {
  // error.code: 1 = permission denied, 2 = position unavailable, 3 = timeout
  if (error.code === 1) {
    return 'Location permission was denied. You can allow it in your browser settings, or just type your location below.';
  }
  if (error.code === 2) {
    return 'Your device could not work out its location right now. Please type your location below.';
  }
  if (error.code === 3) {
    return 'Finding your location took too long. Try again, or type your location below.';
  }
  return 'Something went wrong while getting your location. Please type it below.';
}

export default function SosForm({ onSubmit }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  // kind: 'loading' | 'success' | 'error'
  const [locationMessage, setLocationMessage] = useState(null);

  const firstTypeRef = useRef(null);
  const descriptionRef = useRef(null);
  const locationRef = useRef(null);

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    // Clear the message for a field as soon as the student edits it.
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }

  function handleUseLocation() {
    if (!('geolocation' in navigator)) {
      setLocationMessage({
        kind: 'error',
        text: 'This browser does not support location. Please type your location below.',
      });
      return;
    }
    setLocationMessage({ kind: 'loading', text: 'Looking for your location…' });

    // The browser asks for permission only now, because the student clicked.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const text = `Approx. coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (about ±${Math.round(accuracy)} m)`;
        setField('location', text);
        setLocationMessage({
          kind: 'success',
          text: 'Location added. It is only an estimate and may be wrong. Please check it, and add a building or landmark if you can.',
        });
      },
      (error) => setLocationMessage({ kind: 'error', text: describeLocationError(error) }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first field with a problem.
      if (found.type) firstTypeRef.current?.focus();
      else if (found.description) descriptionRef.current?.focus();
      else locationRef.current?.focus();
      return;
    }

    onSubmit({
      type: values.type,
      description: values.description.trim(),
      location: values.location.trim(),
    });
    setValues(EMPTY_FORM);
    setLocationMessage(null);
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Create a demo SOS alert</h2>

      <fieldset className="field" aria-describedby={errors.type ? 'type-error' : undefined}>
        <legend>
          Emergency type <span className="required">(required)</span>
        </legend>
        <div className="chips">
          {EMERGENCY_TYPES.map((type, index) => (
            <label key={type} className="chip">
              <input
                type="radio"
                name="type"
                value={type}
                checked={values.type === type}
                onChange={() => setField('type', type)}
                ref={index === 0 ? firstTypeRef : undefined}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        {errors.type && (
          <p id="type-error" className="error-text" role="alert">
            {errors.type}
          </p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="description">
          What is happening? <span className="required">(required)</span>
        </label>
        <p id="description-hint" className="hint">
          Keep it short and factual. Please don&apos;t include names or private details in this demo.
        </p>
        <textarea
          id="description"
          ref={descriptionRef}
          rows={4}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={values.description}
          onChange={(e) => setField('description', e.target.value)}
          aria-invalid={errors.description ? 'true' : undefined}
          aria-describedby={`description-hint description-count${errors.description ? ' description-error' : ''}`}
        />
        <p id="description-count" className="hint counter">
          {values.description.length} / {MAX_DESCRIPTION_LENGTH} characters
        </p>
        {errors.description && (
          <p id="description-error" className="error-text" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="location">
          Where are you? <span className="required">(required)</span>
        </label>
        <p id="location-hint" className="hint">
          Type a building, room or landmark. You can also use your device location as a starting point.
        </p>
        <input
          id="location"
          ref={locationRef}
          type="text"
          autoComplete="off"
          maxLength={150}
          value={values.location}
          onChange={(e) => setField('location', e.target.value)}
          aria-invalid={errors.location ? 'true' : undefined}
          aria-describedby={`location-hint${errors.location ? ' location-error' : ''}`}
        />
        {errors.location && (
          <p id="location-error" className="error-text" role="alert">
            {errors.location}
          </p>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleUseLocation}
          disabled={locationMessage?.kind === 'loading'}
        >
          Use my current location
        </button>

        {locationMessage && (
          <p
            className={`message message-${locationMessage.kind}`}
            role={locationMessage.kind === 'error' ? 'alert' : 'status'}
          >
            {locationMessage.text}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-large">
        Send demo SOS
      </button>
      <p className="hint">Demo only: this does not contact responders or emergency services.</p>
    </form>
  );
}
