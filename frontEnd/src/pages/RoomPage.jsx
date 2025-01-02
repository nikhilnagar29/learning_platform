import { useEffect , useRef, useState } from "react";

import rough from "roughjs" ;
const roughGenerator = rough.generator() ;

import WhiteBoard from "../components/Whiteboard/index" ;
import UserPage from "../components/UserBar/index" ;

const RoomPage = () => {
    const canvasRef = useRef(null) ;
    const ctxRex = useRef(null) ;

    const [tool , setTool] = useState("pen") ;
    const [color , setColor] = useState("#000000") ;
    const [elements , setElements] = useState([{}]) ;
    const [history , setHistory] = useState([]);
    const [clean , setClean] = useState(false) ;

    return (
        <>
            <div>
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