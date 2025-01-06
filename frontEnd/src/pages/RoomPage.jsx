import { useEffect , useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import rough from "roughjs" ;
const roughGenerator = rough.generator() ;

import WhiteBoard from "../components/Whiteboard/index" ;
import UserPage from "../components/UserBar/index" ;

const RoomPage = ({io}) => {
    const canvasRef = useRef(null) ;
    const ctxRex = useRef(null) ;

    const location = useLocation();
    const [roomData , setRoomData] = useState(null) ;

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


    // if(!roomData){
    //    alert('first create sessionID') ;
    // }
    // console.log('Received data:', roomData);


    const [tool , setTool] = useState("pen") ;
    const [color , setColor] = useState("#000000") ;
    const [elements , setElements] = useState([{}]) ;
    const [history , setHistory] = useState([]);
    const [clean , setClean] = useState(false) ;

    return (
        <>
                <div className="bg-gray-700 w-screen h-screen">
                    <UserPage
                    color={color} setColor={setColor}
                    tool={tool} setTool={setTool}
                    elements={elements} setElements={setElements}
                    history={history} setHistory={setHistory}
                    clean={clean} setClean = {setClean}
                />
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

export default RoomPage ;