const { v4: uuidv4 } = require("uuid");

const sessions = {}; // To store session data {sessionID: [sockets]}

const hostController = (req,res) => {
    const sessionID = uuidv4();
    sessions[sessionID] = { host: null, viewers: [] };  // Initialize session with host and viewers
    console.log("hosting session", sessionID);
    res.render('change' , {sessionID :sessionID});
}

const joinController = (req,res) => {
    try{
        const { sessionID } = req.body; 

        if (sessions[sessionID]) {
            return res.render('viewer' , {sessionID : sessionID});
        }else{
            return res.json({ error: 'Session not found' });
        }
    }catch(err){
        return res.json({error: 'problem to found section' , err})
    }
}

const messageController = (req,res) => {
    res.render('change');
}

const socketFn = (io) => {
    io.on("connection", (socket) => {
        

        // Handle host joining
        socket.on("host-session", (sessionID) => {
            if (sessions[sessionID]) {
                sessions[sessionID].host = socket.id; // Set the host
                socket.join(sessionID);
                console.log("Host joined session", sessionID, "ID:", socket.id , typeof(sessionID));
            } else {
                socket.emit("session-error", { message: "Session not found" });
            }
        });

        // Handle viewer joining
        socket.on("join-session", (sessionID) => {
            console.log("join req" , sessionID , typeof(sessionID)) ;
            if (sessions[sessionID]) {
                if (!sessions[sessionID].host) {
                    socket.emit("session-error", { message: "Host has not joined yet" });
                    return;
                }
                console.log("a veiw connected" , socket.id);
                sessions[sessionID].viewers.push(socket.id);
                socket.join(sessionID);
                console.log("Viewer joined session", sessionID, "ID:", socket.id);
                io.to(sessionID).emit("user-joined", { userId: socket.id });
            } else {
                socket.emit("session-error", { message: "Session not found" });
            }
        });

        // Handle host sending updates
        socket.on("host-update", ({ sessionID, update }) => {
            if (sessions[sessionID]?.host === socket.id) {
                io.to(sessionID).emit("session-update", { update });
                console.log("Host update sent", update);
            } else {
                socket.emit("permission-error", { message: "Only the host can send updates" });
            }
        });

        // Handle messages from viewers
        socket.on("send-message", ({ sessionID, message }) => {
            console.log("Message from viewer:", message , "id" , sessionID , sessions[sessionID]);
            if (sessions[sessionID]) {
                console.log(sessions[sessionID]) ;
                io.to(sessionID).emit("new-message", { message });
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);

            for (const sessionID in sessions) {
                if (sessions[sessionID].host === socket.id) {
                    console.log("Host disconnected from session", sessionID);
                    io.to(sessionID).emit("session-ended", { message: "Host has left the session" });
                    delete sessions[sessionID]; // End session
                } else {
                    const index = sessions[sessionID].viewers.indexOf(socket.id);
                    if (index !== -1) {
                        sessions[sessionID].viewers.splice(index, 1);
                        io.to(sessionID).emit("user-left", { userId: socket.id });
                        console.log("Viewer left session", sessionID, "ID:", socket.id);
                    }
                }
            }
        });

    });
};

module.exports = { hostController, joinController , messageController , socketFn };