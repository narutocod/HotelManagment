const express = require('express');
const router = express.Router();
const RoomManager = require('../models/RoomManager');

// Initialize room manager
const roomManager = new RoomManager();

// Get all rooms with current status
router.get('/', (req, res) => {
    try {
        const rooms = roomManager.getAllRooms();
        res.json({
            success: true,
            data: {
                rooms: Array.from(rooms.entries()).map(([id, room]) => ({
                    id: id,
                    number: room.number,
                    floor: room.floor,
                    position: room.position,
                    status: room.status,
                    occupied: roomManager.isOccupied(id)
                })),
                totalRooms: rooms.size,
                availableRooms: roomManager.getAvailableRooms().length,
                occupiedRooms: roomManager.getOccupiedRooms().size
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Find optimal rooms for booking
router.post('/find-optimal', (req, res) => {
    try {
        const { numRooms } = req.body;

        if (!numRooms || numRooms < 1 || numRooms > 5) {
            return res.status(400).json({
                success: false,
                error: 'Number of rooms must be between 1 and 5'
            });
        }

        const result = roomManager.findOptimalRooms(numRooms);

        if (result.success) {
            res.json({
                success: true,
                data: {
                    selectedRooms: result.rooms,
                    travelTime: result.travelTime,
                    message: result.message
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.message
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Book selected rooms
router.post('/book', (req, res) => {
    try {
        const { roomIds } = req.body;

        if (!Array.isArray(roomIds) || roomIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Room IDs array is required'
            });
        }

        const result = roomManager.bookRooms(roomIds);

        if (result.success) {
            res.json({
                success: true,
                data: {
                    bookedRooms: roomIds,
                    message: `Successfully booked ${roomIds.length} rooms`
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.message
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate random occupancy
router.post('/random-occupancy', (req, res) => {
    try {
        const { rate = 0.3 } = req.body;

        if (rate < 0 || rate > 1) {
            return res.status(400).json({
                success: false,
                error: 'Occupancy rate must be between 0 and 1'
            });
        }

        const occupiedCount = roomManager.generateRandomOccupancy(rate);

        res.json({
            success: true,
            data: {
                occupiedCount,
                availableCount: roomManager.getAvailableRooms().length,
                message: `Generated random occupancy: ${occupiedCount} rooms occupied`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reset all bookings
router.post('/reset', (req, res) => {
    try {
        roomManager.resetAllBookings();

        res.json({
            success: true,
            data: {
                availableRooms: roomManager.getAvailableRooms().length,
                message: 'All bookings have been reset'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;