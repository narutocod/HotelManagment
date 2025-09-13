import React from 'react';
import './RoomGrid.css';

const RoomGrid = ({ rooms, selectedRooms, loading }) => {
  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  // Sort floors in descending order (10 to 1)
  const sortedFloors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => b - a);

  const getRoomStatus = (room) => {
    if (selectedRooms.includes(room.number)) return 'selected';
    if (room.occupied) return 'occupied';
    return 'available';
  };

  const getRoomClass = (room) => {
    const status = getRoomStatus(room);
    return `room room--${status}`;
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="room-grid">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading hotel rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-grid">
      <div className="room-grid__header">
        <h2>Hotel Layout</h2>
        <p className="room-grid__subtitle">
          Floors arranged from top (10) to bottom (1) • Staircase/Lift on the left
        </p>
      </div>

      <div className="floors-container">
        {sortedFloors.map(floor => (
          <div key={floor} className="floor">
            <div className="floor__header">
              <h3 className="floor__title">Floor {floor}</h3>
              <div className="floor__info">
                {roomsByFloor[floor].length} rooms
              </div>
            </div>

            <div className="floor__rooms">
              <div className="stair-indicator">
                <div className="stair-icon">🏢</div>
                <span className="stair-label">Stairs/Lift</span>
              </div>

              <div className="rooms-row">
                {roomsByFloor[floor]
                  .sort((a, b) => a.position - b.position)
                  .map(room => (
                    <div
                      key={room.number}
                      className={getRoomClass(room)}
                      title={`Room ${room.number} - ${getRoomStatus(room)}`}
                    >
                      <span className="room__number">{room.number}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="room-grid__footer">
        <p className="travel-info">
          <strong>Travel Time Rules:</strong> 
          Horizontal: 1 min/room • Vertical: 2 min/floor
        </p>
      </div>
    </div>
  );
};

export default RoomGrid;