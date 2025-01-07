import { useEffect , useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WhiteBoard from "../components/Whiteboard/index" ;

const ViewerLook = ({socket}) => {
    const canvasRef = useRef(null) ;
    const ctxRex = useRef(null) ;

    const location = useLocation();
    const [roomData , setRoomData] = useState(null) ;

    //save sessionID to local
    useEffect(() => {
        if(location.state){
            const sessionData = {
                sessionID: location.state.sessionID,
                name: location.state.name,
            };
    
            // Save room data to localStorage for persistence
            localStorage.setItem('roomData', JSON.stringify(sessionData));
            setRoomData(sessionData);
        }else{

            const localData = localStorage.getItem('roomData') ;
            if (localData) {
                setRoomData(JSON.parse(localData));
            }
            else{
                alert('Session not found. Please create or join a room.') ;
            }
        }

    } , [location.state]) ;

    //socket logic for get elements
    useEffect(() => {
        socket.on('element-added' , (data) => {
            // console.log("Received data:", typeof data, data); // Debug log 

            // Validate if `data.elements` is an array
            if (Array.isArray(data.element)) {
                setElements(data.element); // Set elements if valid
            } else {
                console.error("Error: `data.elements` is not an array", data.elements);
            }
        })

        return () => {
            socket.off('element-added' );
        };
    },[socket])

    //socket logic for rejoin session 
    useEffect(()=>{
        if(roomData){
            const {sessionID , name} = roomData;

            socket.emit('join-room',{sessionID , name}) ;

            socket.on('room-joined' , (data) => {
                console.log(`Rejoined room successfully: ${data.sessionID}`);
            })

            socket.on('error' , (err) => {
                console.error('Error rejoining room:', err.message);
            })

            return () => {
                socket.off('room-joined');
                socket.off('error');
            };
        }
    } , [roomData])

    // if(!roomData){
    //    alert('first create sessionID') ;
    // }
    // console.log('Received data:', roomData);


    const [tool , setTool] = useState("null") ;
    const [color , setColor] = useState("#000000") ;
    const [elements , setElements] = useState([{}]) ;
    

    return (
        <>
                <div className="bg-gray-700 w-screen h-screen">

                    <WhiteBoard 
                        tool={tool} setTool={setTool}
                        canvasRef={canvasRef} 
                        ctxRex={ctxRex} elements={elements}
                        setElements={setElements}
                        color={color}
                        
                    />
            </div>
        </>
    )
}

export default ViewerLook ;