# Real-Time Collaborative Learning Platform

A high-performance, real-time collaborative learning platform with whiteboard sharing capabilities, built with React, Node.js, and Socket.IO.

![Collaborative Whiteboard](https://via.placeholder.com/800x400?text=Collaborative+Learning+Platform)

## 🚀 Features

- **Real-time Collaborative Whiteboard**: Draw, annotate, and collaborate in real-time
- **Multiple Drawing Tools**: Pen, rectangle, highlight, and more
- **Room-based Sessions**: Create or join sessions with unique IDs
- **Real-time Chat**: Communicate with other participants while collaborating
- **Dark/Light Mode**: User-friendly interface with theme options
- **Responsive Design**: Works on desktop and mobile devices

## ⚡ Performance Metrics

Our platform has been rigorously tested for performance and scalability:

| Metric                   | Value                         |
| ------------------------ | ----------------------------- |
| Maximum Concurrent Users | 200+                          |
| Average Latency          | 137-228ms                     |
| Connection Success Rate  | 100%                          |
| Average Connection Time  | 426-549ms                     |
| Data Transfer Capacity   | 77,939 elements in 60 seconds |

> **Note**: Tests conducted on a minimal server configuration (0.15 vCPU, 512MB RAM) hosted on Render.com.

## 🛠️ Tech Stack

### Frontend

- React 18.3
- React Router 7.1
- Socket.IO Client 4.8
- RoughJS 4.6 (for natural drawing)
- TailwindCSS 3.4

### Backend

- Node.js
- Express
- Socket.IO
- EJS (for views)

## 📋 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/learning-platform.git
   cd learning-platform
   ```

2. Install backend dependencies

   ```bash
   cd backEnd
   npm install
   ```

3. Start the backend server
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

### Frontend Setup

1. Install frontend dependencies

   ```bash
   cd ../frontEnd
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

### Configuration

- To connect to a different backend server, modify the server URL in `frontEnd/src/main.jsx`

## 🧪 Performance Testing

The project includes comprehensive performance testing tools:

1. Navigate to the test directory

   ```bash
   cd test
   npm install
   ```

2. Run connection tests

   ```bash
   node connection_test.js
   ```

3. Generate a visual report

   ```bash
   node visualize_results.js
   ```

4. View the report by opening `report.html` in your browser

### Test Configuration

You can modify test parameters in `connection_test.js`:

- `NUM_CLIENTS`: Number of simulated clients
- `TEST_DURATION`: Duration of the test in milliseconds
- `ELEMENT_SEND_INTERVAL`: How often to send test elements

## 🌐 Deployment

The platform is currently deployed at:

- Backend: https://learning-platform-backend-tqmf.onrender.com
- Frontend: [Your frontend URL]

## 📊 Usage Scenarios

1. **Virtual Classrooms**: Teachers can create rooms and invite students to join
2. **Remote Tutoring**: One-on-one tutoring sessions with real-time drawing and explanation
3. **Team Brainstorming**: Collaborative ideation and diagramming
4. **Design Reviews**: Share and annotate designs in real-time

## 🔮 Future Enhancements

- User authentication and persistent accounts
- Session recording and playback
- File sharing capabilities
- Advanced drawing tools and templates
- Analytics dashboard for instructors

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Socket.IO team for the excellent real-time communication library
- RoughJS for the natural drawing capabilities
- React team for the powerful frontend framework
