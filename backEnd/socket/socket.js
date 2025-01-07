// socket.js
// const redis = require('redis');

// // Check environment variables or use default values
// const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
// const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const redisClient = redis.createClient({
//     host: REDIS_HOST,
//     port: REDIS_PORT,
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));



// In-memory object to store session data
const sessionDataStore = {};

// Utility function to set session data with optional expiration
const setSessionData = (sessionID, data, expirationTimeInSeconds) => {
    sessionDataStore[sessionID] = { ...data, createdAt: Date.now() };
    
    if (expirationTimeInSeconds) {
        setTimeout(() => {
            delete sessionDataStore[sessionID];
            console.log(`Session ${sessionID} expired and removed.`);
        }, expirationTimeInSeconds * 1000);
    }
};

// Utility function to get session data
const getSessionData = (sessionID) => {
    return sessionDataStore[sessionID] || null;
};

// Utility function to delete session data
const deleteSessionData = (sessionID) => {
    delete sessionDataStore[sessionID];
};



// Connect to Redis
// (async () => {
//     try {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     } catch (err) {
//         console.error('Error connecting to Redis:', err);
//     }
// })();

module.exports = (io) => {
    io.on('connection' , (socket) =>{
        console.log(`new user connected ${socket.id}`) ;

        socket.on("create-room", async ({ sessionID, name = 'HOST' }) => {
            try {
                // Ensure sessionID is a string
                console.log("sessionId" , sessionID , "Name:" , name) ;
                
                if (typeof sessionID !== 'string') {
                    throw new TypeError('sessionID must be a string');
                }

                // Save room data in Redis with an expiration time of 1 hour
                // await redisClient.setEx(sessionID, 3600, JSON.stringify({ role: 'host', name }));
                setSessionData(sessionID, { role: 'host', name }, 3600);

                console.log(`Room created with sessionID: ${sessionID} by host ${name} (${socket.id})`);
        
                // Join the created room
                socket.join(sessionID);
        
                // Emit success response to the client
                socket.emit('room-created', { message: 'Room created successfully.', sessionID, name });
            } catch (err) {
                console.error('Error creating room:', err);
        
                // Emit error response to the client
                socket.emit('error', { message: 'Failed to create room.' });
            }
        });
        

        socket.on("join-room" , async ({sessionID , name = "viewer"}) => {
            try{
                
                console.log("sessionId: " , sessionID , "Name:" , name) ;

                if (typeof sessionID !== 'string') {
                    throw new TypeError('sessionID must be a string');
                }

                // const sessionData = await redisClient.get(sessionID);
                const sessionData = getSessionData(sessionID);

                if (!sessionData) {
                    socket.emit('error', { message: 'Invalid session ID. Room does not exist.' });
                    return;
                }

                const { role } = sessionData;

                socket.join(sessionID);
                console.log(`User ${name} (${socket.id}) joined room: ${sessionID}`);

                socket.emit('room-joined', { message: 'Joined room successfully.', sessionID, name });
            }
            catch(err){
                console.error('Error joining room:', err);
                socket.emit('error', { message: 'Failed to join room.' });
            }
        })

        socket.on("add-element" , (data) => {
            // console.log('hello' , data);
            const {sessionID , element} = data ;

            if (!sessionID || !element) {
                socket.emit('error', { message: 'Invalid data. Session ID and element are required.' });
                return;
            }

            // console.log(`Element added to sessionID ${sessionID} by ${socket.id}:`, element);

            io.to(sessionID).emit('element-added', { element });

        })

        socket.on("new-message", (data) => {
            const { message, name, role, sessionID } = data;
        
            if (!message || !name || !sessionID) {
                socket.emit('error', { message: 'Invalid data. Message, name, and session ID are required.' });
                return;
            }

            // io.in(sessionID).allSockets().then(sockets => {
            //     console.log(`Sockets in room ${sessionID}:`, [...sockets]);
            // });
            
        
            // console.log(`New message in sessionID ${sessionID} from ${name}: ${message}`, role);
        
            // Broadcast the message to everyone else in the room
            socket.broadcast.to(sessionID).emit('message-received', { message, name, role });
        });
        

        socket.on("disconnect" , () => {
            console.log(`socket ${socket.id} disconnect`) ;
        })
    })
}