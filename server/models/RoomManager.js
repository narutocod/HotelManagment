class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.occupiedRooms = new Set();
        this.initializeRooms();
    }

    initializeRooms() {
        // Floors 1-9: 10 rooms each (101-110, 201-210, etc.)
        for (let floor = 1; floor <= 9; floor++) {
            for (let room = 1; room <= 10; room++) {
                const roomNumber = floor * 100 + room;
                this.rooms.set(roomNumber, {
                    number: roomNumber,
                    floor: floor,
                    position: room,
                    status: 'available'
                });
            }
        }

        // Floor 10: 7 rooms (1001-1007)
        for (let room = 1; room <= 7; room++) {
            const roomNumber = 1000 + room;
            this.rooms.set(roomNumber, {
                number: roomNumber,
                floor: 10,
                position: room,
                status: 'available'
            });
        }
    }

    getAllRooms() {
        return this.rooms;
    }

    getAvailableRooms() {
        return Array.from(this.rooms.keys()).filter(roomId => !this.occupiedRooms.has(roomId));
    }

    getOccupiedRooms() {
        return this.occupiedRooms;
    }

    isOccupied(roomId) {
        return this.occupiedRooms.has(roomId);
    }

    calculateTravelTime(room1Id, room2Id) {
        const room1 = this.rooms.get(room1Id);
        const room2 = this.rooms.get(room2Id);

        if (!room1 || !room2) return 0;

        // Vertical travel time (2 minutes per floor)
        const verticalTime = Math.abs(room1.floor - room2.floor) * 2;

        // Horizontal travel time (1 minute per room on same floor)
        let horizontalTime = 0;
        if (room1.floor === room2.floor) {
            horizontalTime = Math.abs(room1.position - room2.position);
        }

        return verticalTime + horizontalTime;
    }

    findOptimalRooms(numRooms) {
        if (numRooms <= 0 || numRooms > 5) {
            return { success: false, message: 'Number of rooms must be between 1 and 5' };
        }

        const availableRooms = this.getAvailableRooms();

        if (availableRooms.length < numRooms) {
            return { 
                success: false, 
                message: `Not enough rooms available. Only ${availableRooms.length} rooms left` 
            };
        }

        if (numRooms === 1) {
            // For single room, return the first available room closest to stairs
            const bestRoom = availableRooms.reduce((closest, current) => {
                const currentRoom = this.rooms.get(current);
                const closestRoom = this.rooms.get(closest);

                if (currentRoom.floor < closestRoom.floor) return current;
                if (currentRoom.floor === closestRoom.floor && currentRoom.position < closestRoom.position) return current;
                return closest;
            });

            return { 
                success: true, 
                rooms: [bestRoom], 
                travelTime: 0,
                message: 'Single room selected closest to stairs/lift'
            };
        }

        // Try to book rooms on the same floor first
        const roomsByFloor = {};
        availableRooms.forEach(roomId => {
            const room = this.rooms.get(roomId);
            if (!roomsByFloor[room.floor]) {
                roomsByFloor[room.floor] = [];
            }
            roomsByFloor[room.floor].push(roomId);
        });

        // Check if we can fit all rooms on one floor
        for (const [floor, floorRooms] of Object.entries(roomsByFloor)) {
            if (floorRooms.length >= numRooms) {
                // Sort by position to get consecutive rooms
                floorRooms.sort((a, b) => {
                    return this.rooms.get(a).position - this.rooms.get(b).position;
                });

                const selectedRooms = floorRooms.slice(0, numRooms);
                const firstRoom = selectedRooms[0];
                const lastRoom = selectedRooms[selectedRooms.length - 1];
                const travelTime = this.calculateTravelTime(firstRoom, lastRoom);

                return {
                    success: true,
                    rooms: selectedRooms,
                    travelTime,
                    message: `All rooms selected on floor ${floor} to minimize travel time`
                };
            }
        }

        // Multi-floor selection using greedy algorithm
        return this.greedyMultiFloorSelection(availableRooms, numRooms);
    }

    greedyMultiFloorSelection(availableRooms, numRooms) {
        let bestCombination = null;
        let bestTravelTime = Infinity;

        // For small numbers, try different combinations
        if (numRooms <= 4) {
            // Generate combinations
            const combinations = this.generateCombinations(availableRooms, numRooms);

            for (const combination of combinations) {
                const sortedRooms = combination.sort((a, b) => {
                    const roomA = this.rooms.get(a);
                    const roomB = this.rooms.get(b);
                    if (roomA.floor !== roomB.floor) return roomA.floor - roomB.floor;
                    return roomA.position - roomB.position;
                });

                const travelTime = this.calculateTravelTime(sortedRooms[0], sortedRooms[sortedRooms.length - 1]);

                if (travelTime < bestTravelTime) {
                    bestTravelTime = travelTime;
                    bestCombination = combination;
                }
            }
        } else {
            // For 5 rooms, use greedy approach
            const remainingRooms = [...availableRooms];
            const selected = [];

            // Pick starting room (closest to stairs)
            let startRoom = remainingRooms.reduce((closest, current) => {
                const currentRoom = this.rooms.get(current);
                const closestRoom = this.rooms.get(closest);

                if (currentRoom.floor < closestRoom.floor) return current;
                if (currentRoom.floor === closestRoom.floor && currentRoom.position < closestRoom.position) return current;
                return closest;
            });

            selected.push(startRoom);
            remainingRooms.splice(remainingRooms.indexOf(startRoom), 1);

            // Greedily add rooms that minimize travel time
            while (selected.length < numRooms && remainingRooms.length > 0) {
                let bestNextRoom = null;
                let bestTime = Infinity;

                for (const roomId of remainingRooms) {
                    const tempSelected = [...selected, roomId];
                    const sortedTemp = tempSelected.sort((a, b) => {
                        const roomA = this.rooms.get(a);
                        const roomB = this.rooms.get(b);
                        if (roomA.floor !== roomB.floor) return roomA.floor - roomB.floor;
                        return roomA.position - roomB.position;
                    });

                    const time = this.calculateTravelTime(sortedTemp[0], sortedTemp[sortedTemp.length - 1]);

                    if (time < bestTime) {
                        bestTime = time;
                        bestNextRoom = roomId;
                    }
                }

                if (bestNextRoom !== null) {
                    selected.push(bestNextRoom);
                    remainingRooms.splice(remainingRooms.indexOf(bestNextRoom), 1);
                    bestTravelTime = bestTime;
                } else {
                    break;
                }
            }

            bestCombination = selected;
        }

        return {
            success: true,
            rooms: bestCombination || availableRooms.slice(0, numRooms),
            travelTime: bestTravelTime,
            message: 'Multi-floor selection optimized for minimum travel time'
        };
    }

    generateCombinations(array, size) {
        if (size === 1) return array.map(x => [x]);

        const combinations = [];
        for (let i = 0; i < array.length - size + 1; i++) {
            const smallerCombinations = this.generateCombinations(array.slice(i + 1), size - 1);
            for (const smallerCombination of smallerCombinations) {
                combinations.push([array[i], ...smallerCombination]);
            }
        }

        return combinations;
    }

    bookRooms(roomIds) {
        // Check if all rooms are available
        for (const roomId of roomIds) {
            if (this.occupiedRooms.has(roomId)) {
                return { 
                    success: false, 
                    message: `Room ${roomId} is already occupied` 
                };
            }
            if (!this.rooms.has(roomId)) {
                return { 
                    success: false, 
                    message: `Room ${roomId} does not exist` 
                };
            }
        }

        // Book all rooms
        roomIds.forEach(roomId => {
            this.occupiedRooms.add(roomId);
        });

        return { success: true, message: 'Rooms booked successfully' };
    }

    resetAllBookings() {
        this.occupiedRooms.clear();
    }

    generateRandomOccupancy(rate = 0.3) {
        this.resetAllBookings();

        const allRoomIds = Array.from(this.rooms.keys());
        const numToOccupy = Math.floor(allRoomIds.length * rate);

        // Shuffle array and take first N elements
        const shuffled = allRoomIds.sort(() => Math.random() - 0.5);
        const toOccupy = shuffled.slice(0, numToOccupy);

        toOccupy.forEach(roomId => {
            this.occupiedRooms.add(roomId);
        });

        return numToOccupy;
    }
}

module.exports = RoomManager;