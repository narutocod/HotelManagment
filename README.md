# Hotel Room Reservation System

A comprehensive full-stack hotel room booking system with travel time optimization algorithm, built with **React** frontend and **Node.js** backend.

## 🏨 Project Overview

This system manages a 97-room hotel across 10 floors with intelligent room assignment that minimizes travel time between booked rooms. The system prioritizes booking rooms on the same floor and uses advanced algorithms to optimize multi-floor bookings.

### Hotel Structure
- **Floors 1-9**: 10 rooms each (101-110, 201-210, etc.)
- **Floor 10**: 7 rooms (1001-1007)
- **Total**: 97 rooms
- **Layout**: Staircase/lift on left side, rooms arranged left to right

### Travel Time Calculation Rules
- **Horizontal Travel**: 1 minute per room on the same floor
- **Vertical Travel**: 2 minutes per floor using stairs/lift

### Booking Rules
- Maximum 5 rooms per booking
- Priority: Same floor first
- Minimize travel time between first and last room
- Multi-floor booking with optimization when necessary

## 🚀 Features

### Core Functionality
- ✅ **Room Selection Interface**: Input 1-5 rooms for booking
- ✅ **Visual Room Grid**: Interactive floor-by-floor layout
- ✅ **Travel Time Optimization**: Algorithm finds optimal room combinations
- ✅ **Real-time Updates**: Instant visual feedback
- ✅ **Random Occupancy Generator**: Test different scenarios
- ✅ **Booking Reset**: Clear all bookings

### Advanced Features
- 🎯 **Smart Algorithm**: Greedy optimization for multi-floor scenarios
- 📊 **Live Statistics**: Available/occupied room counts
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔄 **Real-time Sync**: Backend API integration
- 💡 **User Feedback**: Success/error messages and loading states

### Technical Features
- 🏗️ **Microservices Architecture**: Separate frontend and backend
- 🔗 **RESTful API**: Clean API design
- 📱 **Progressive Web App**: Mobile-friendly interface
- 🎨 **Modern UI/UX**: Professional hotel booking appearance
- ⚡ **Performance Optimized**: Fast rendering and updates

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger

### Development Tools
- **Concurrently**: Run frontend and backend simultaneously
- **Nodemon**: Auto-restart server during development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14.0.0 or higher)
- **npm** (usually comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hotel-room-booking-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the client directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Application

#### Development Mode (Recommended)
```bash
# Run both frontend and backend simultaneously
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **React frontend** on `http://localhost:3000`

#### Manual Startup
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the React frontend
cd client
npm start
```

### 5. Build for Production
```bash
# Build React app for production
npm run build
```

## 📖 Usage Guide

### 1. **Select Number of Rooms**
   - Choose 1-5 rooms from the dropdown
   - Click "Find Optimal Rooms" to see the best selection

### 2. **View Selected Rooms**
   - Selected rooms appear highlighted in blue on the grid
   - Travel time between first and last room is calculated
   - Room numbers are displayed in the booking panel

### 3. **Confirm Booking**
   - Click "Confirm Booking" to finalize the reservation
   - Rooms turn red to indicate they're occupied
   - System updates availability counts

### 4. **Test Different Scenarios**
   - "Random Occupancy": Generates 30-50% random room occupancy
   - "Reset All": Clears all bookings to start fresh

### 5. **Monitor Statistics**
   - View total, available, and occupied room counts
   - See real-time updates as bookings change

## 🧮 Algorithm Details

### Room Selection Logic

1. **Single Room**: Selects room closest to stairs/lift
2. **Same Floor Priority**: Attempts to fit all rooms on one floor
3. **Multi-Floor Optimization**: Uses greedy algorithm when needed

### Travel Time Optimization

```javascript
// Example calculation
Room 101 to Room 105 = 4 minutes (horizontal)
Room 101 to Room 201 = 2 minutes (vertical)
Room 101 to Room 205 = 6 minutes (2 vertical + 4 horizontal)
```

### Optimization Strategies

- **Small bookings (≤4 rooms)**: Tests all combinations
- **Large bookings (5 rooms)**: Greedy approach starting from optimal position
- **Edge cases**: Handles insufficient availability gracefully

## 🏗️ Project Structure

```
hotel-room-booking-system/
├── README.md
├── package.json
├── server/
│   ├── package.json
│   ├── index.js                 # Express server setup
│   ├── routes/
│   │   └── rooms.js            # Room booking API routes
│   └── models/
│       └── RoomManager.js      # Core booking logic & algorithm
├── client/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── App.css
│       └── components/
│           ├── HotelBookingSystem.js    # Main application component
│           ├── HotelBookingSystem.css
│           ├── BookingPanel.js          # Booking controls & stats
│           ├── BookingPanel.css
│           ├── RoomGrid.js              # Visual room layout
│           └── RoomGrid.css
```

## 🔌 API Endpoints

### GET `/api/rooms`
- **Description**: Get all rooms with current status
- **Response**: Room data, availability counts

### POST `/api/rooms/find-optimal`
- **Description**: Find optimal room selection
- **Body**: `{ "numRooms": 3 }`
- **Response**: Selected rooms and travel time

### POST `/api/rooms/book`
- **Description**: Book selected rooms
- **Body**: `{ "roomIds": [101, 102, 103] }`
- **Response**: Booking confirmation

### POST `/api/rooms/random-occupancy`
- **Description**: Generate random room occupancy
- **Body**: `{ "rate": 0.4 }` (optional)
- **Response**: Occupancy statistics

### POST `/api/rooms/reset`
- **Description**: Reset all bookings
- **Response**: Reset confirmation

## 🎨 UI/UX Features

### Visual Design
- **Modern Interface**: Clean, professional hotel booking appearance
- **Color Coding**: Green (available), Red (occupied), Blue (selected)
- **Responsive Layout**: Adapts to all screen sizes
- **Loading States**: Visual feedback during API calls

### User Experience
- **Intuitive Controls**: Simple dropdown and button interface
- **Real-time Feedback**: Immediate visual updates
- **Error Handling**: Clear error messages and validation
- **Accessibility**: Semantic HTML and keyboard navigation

## 🧪 Testing the System

### Test Scenarios

1. **Basic Booking**: Book 1-5 rooms and verify optimization
2. **Limited Availability**: Generate random occupancy and test constraints
3. **Edge Cases**: Try booking when insufficient rooms available
4. **Multi-floor Logic**: Force bookings across multiple floors
5. **Reset Functionality**: Clear all bookings and verify system state

### Performance Testing
- Test with high occupancy rates (80-90%)
- Verify algorithm performance with different room counts
- Check responsiveness on various device sizes

## 🔧 Customization

### Modify Hotel Structure
Edit `server/models/RoomManager.js` to change:
- Number of floors
- Rooms per floor
- Room numbering scheme

### Adjust Travel Time Rules
Modify the `calculateTravelTime` method to change:
- Minutes per room (horizontal)
- Minutes per floor (vertical)

### UI Customization
Update CSS files to change:
- Color scheme
- Layout structure
- Component styling

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Install production dependencies
3. Start with `npm start`

### Frontend Deployment
1. Build with `npm run build`
2. Serve static files from `build/` directory
3. Configure API URL for production

**API Connection Errors**
- Verify backend server is running on port 5000
- Check CORS configuration
- Confirm API URL in frontend environment

**Missing Dependencies**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm run install-all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

- Built for SDE 3 assessment
- Implements advanced room optimization algorithms
- Demonstrates full-stack development skills
- Showcases modern React and Node.js practices