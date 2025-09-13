import React, { useState } from 'react';
import './BookingPanel.css';

const BookingPanel = ({
  onFindRooms,
  onBookRooms,
  onRandomOccupancy,
  onReset,
  selectedRooms,
  travelTime,
  stats,
  loading
}) => {
  const [numRooms, setNumRooms] = useState(1);

  const handleFindRooms = () => {
    onFindRooms(numRooms);
  };

  return (
    <div className="booking-panel">
      <div className="card">
        <div className="card__header">
          <h2>Book Rooms</h2>
        </div>

        <div className="card__body">
          <div className="form-group">
            <label htmlFor="roomCount" className="form-label">
              Number of Rooms (1-5)
            </label>
            <select
              id="roomCount"
              className="form-control"
              value={numRooms}
              onChange={(e) => setNumRooms(parseInt(e.target.value))}
              disabled={loading}
            >
              <option value={1}>1 Room</option>
              <option value={2}>2 Rooms</option>
              <option value={3}>3 Rooms</option>
              <option value={4}>4 Rooms</option>
              <option value={5}>5 Rooms</option>
            </select>
          </div>

          <div className="button-group">
            <button
              className="btn btn--primary btn--full-width"
              onClick={handleFindRooms}
              disabled={loading}
            >
              {loading ? 'Finding...' : 'Find Optimal Rooms'}
            </button>

            <button
              className="btn btn--secondary btn--full-width"
              onClick={onBookRooms}
              disabled={loading || selectedRooms.length === 0}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>

          <div className="button-group">
            <button
              className="btn btn--outline"
              onClick={onRandomOccupancy}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Random Occupancy'}
            </button>

            <button
              className="btn btn--outline"
              onClick={onReset}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset All'}
            </button>
          </div>
        </div>
      </div>

      {selectedRooms.length > 0 && (
        <div className="card">
          <div className="card__header">
            <h3>Selected Rooms</h3>
          </div>
          <div className="card__body">
            <div className="selected-rooms">
              {selectedRooms.map(roomId => (
                <span key={roomId} className="room-tag">
                  {roomId}
                </span>
              ))}
            </div>
            <div className="travel-time">
              <strong>Travel Time: {travelTime} minutes</strong>
              <p className="travel-time__description">
                Time between first and last room
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card__header">
          <h3>Hotel Statistics</h3>
        </div>
        <div className="card__body">
          <div className="stats">
            <div className="stat">
              <div className="stat__value">{stats.total}</div>
              <div className="stat__label">Total Rooms</div>
            </div>
            <div className="stat">
              <div className="stat__value stat__value--success">{stats.available}</div>
              <div className="stat__label">Available</div>
            </div>
            <div className="stat">
              <div className="stat__value stat__value--error">{stats.occupied}</div>
              <div className="stat__label">Occupied</div>
            </div>
          </div>
        </div>
      </div>

      <div className="legend">
        <h4>Room Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color legend-color--available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--occupied"></div>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--selected"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPanel;