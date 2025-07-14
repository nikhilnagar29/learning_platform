import { useEffect , useRef , useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import rough from "roughjs" ;
const roughGenerator = rough.generator() ;

import WhiteBoard from "../components/Whiteboard/index" ;
import UserPage from "../components/UserBar/index" ;
import ChatRoom from "../components/chatRoom";

const RoomPage = ({socket}) => {
    const canvasRef = useRef(null) ;
    const ctxRex = useRef(null) ;

    const location = useLocation();
    const [roomData , setRoomData] = useState(null) ;

    //to save sessionID and name
    useEffect(() => {
        if(location.state){

            localStorage.setItem('roomData' , JSON.stringify({
                sessionID: location.state.sessionID , 
                name: location.state.name
            })) ; 
            setRoomData({
                sessionID: location.state.sessionID , 
                name: location.state.name
            }) ;
        }else{

            const localData = localStorage.getItem('roomData') ;
            if (localData) {
                setRoomData(JSON.parse(localData));
            }
            else{
                alert('first create sessionID') ;
            }
        }

    } , [location.state]) ;

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


    const [tool , setTool] = useState("pen") ;
    const [color , setColor] = useState("#000000") ;
    const [elements , setElements] = useState([{}]) ;
    const [history , setHistory] = useState([]);
    const [clean , setClean] = useState(false) ;

    //to send element with use of socketIO
    useEffect(() => {
        if(roomData){
            // console.log("hello bhai", typeof elements, elements); // Debug log

            if(Array.isArray(elements)){
                console.log("elements", elements);
                socket.emit('add-element' , { sessionID: roomData.sessionID, element: elements } ) ;
            }else{
                console.error("Error: `elements` is not an array", elements);
            }

            
        }
            
    } , [elements]) ;

    

    return (
        <>
                <div className="bg-gray-700 w-screen h-screen">
                    <UserPage
                    color={color} setColor={setColor}
                    tool={tool} setTool={setTool}
                    elements={elements} setElements={setElements}
                    history={history} setHistory={setHistory}
                    clean={clean} setClean = {setClean}
                    roomData={roomData}
                />
                <WhiteBoard 
                    tool={tool} setTool={setTool}
                    canvasRef={canvasRef} 
                    ctxRex={ctxRex} elements={elements}
                    setElements={setElements}
                    color={color}
                
                />
                <ChatRoom
                    socket={socket}
                    roomData={roomData}
                    role={"HOST"}
                />
            </div>
        </>
    )
}

export default RoomPage ;