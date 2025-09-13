import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomGrid from './RoomGrid';
import BookingPanel from './BookingPanel';
import './HotelBookingSystem.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const HotelBookingSystem = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [travelTime, setTravelTime] = useState(0);
  const [stats, setStats] = useState({ total: 97, available: 97, occupied: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      if (response.data.success) {
        setRooms(response.data.data.rooms);
        setStats({
          total: response.data.data.totalRooms,
          available: response.data.data.availableRooms,
          occupied: response.data.data.occupiedRooms
        });
      }
    } catch (error) {
      showMessage('Failed to fetch rooms', 'error');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const findOptimalRooms = async (numRooms) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rooms/find-optimal`, {
        numRooms: parseInt(numRooms)
      });

      if (response.data.success) {
        setSelectedRooms(response.data.data.selectedRooms);
        setTravelTime(response.data.data.travelTime);
        showMessage(response.data.data.message, 'success');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to find optimal rooms';
      showMessage(errorMsg, 'error');
      setSelectedRooms([]);
      setTravelTime(0);
    } finally {
      setLoading(false);
    }
  };

  const bookRooms = async () => {
    if (selectedRooms.length === 0) {
      showMessage('No rooms selected', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rooms/book`, {
        roomIds: selectedRooms
      });

      if (response.data.success) {
        showMessage(`Successfully booked ${selectedRooms.length} rooms!`, 'success');
        setSelectedRooms([]);
        setTravelTime(0);
        await fetchRooms(); // Refresh room data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to book rooms';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomOccupancy = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rooms/random-occupancy`, {
        rate: 0.3 + Math.random() * 0.2 // 30-50% occupancy
      });

      if (response.data.success) {
        showMessage(response.data.data.message, 'info');
        setSelectedRooms([]);
        setTravelTime(0);
        await fetchRooms();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate random occupancy';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetAllBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rooms/reset`);

      if (response.data.success) {
        showMessage('All bookings have been reset', 'success');
        setSelectedRooms([]);
        setTravelTime(0);
        await fetchRooms();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to reset bookings';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  return (
    <div className="hotel-booking-system">
      <header className="header">
        <h1>Hotel Room Reservation System</h1>
        <p className="subtitle">97 rooms across 10 floors - Optimized for minimal travel time</p>
      </header>

      {message && (
        <div className={`message message--${messageType}`}>
          {message}
        </div>
      )}

      <div className="main-content">
        <BookingPanel
          onFindRooms={findOptimalRooms}
          onBookRooms={bookRooms}
          onRandomOccupancy={generateRandomOccupancy}
          onReset={resetAllBookings}
          selectedRooms={selectedRooms}
          travelTime={travelTime}
          stats={stats}
          loading={loading}
        />

        <RoomGrid
          rooms={rooms}
          selectedRooms={selectedRooms}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HotelBookingSystem;