import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from 'roughjs';

const roughGenerator = rough.generator() ;

const WhiteBoard = ({ canvasRef , ctxRef , elements , setElements }) => {

    const [isDrawing , setIsDrawing] = useState(false) ;
    
    canvasRef = useRef(null);
    ctxRef = useRef(null);
    //resize logic of white board
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const resizeCanvas = () => {
            const aspectRatio = 16 / 8.55  ; // Fixed aspect ratio

            // Get screen dimensions
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Calculate canvas dimensions based on aspect ratio
            let canvasWidth = screenWidth;
            let canvasHeight = screenWidth / aspectRatio;

            if (canvasHeight > screenHeight) {
                canvasHeight = screenHeight;
                canvasWidth = screenHeight * aspectRatio;
            }

            // Set canvas dimensions
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Center the canvas (optional)
            canvas.style.position = "absolute";
            canvas.style.top = `${(screenHeight - canvasHeight) / 2}px`;
            canvas.style.left = `${(screenWidth - canvasWidth) / 2}px`;

            // Clear the canvas and redraw (optional)
            context.fillStyle = "gray";
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        // Initial resize
        resizeCanvas();

        // Update on window resize
        window.addEventListener("resize", resizeCanvas);

        // Cleanup event listener
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(()=>{
        const canvas = canvasRef.current ;
        const ctx = canvas.getContext("2d") ;

        ctxRef.current = ctx ;
    })
    
    useLayoutEffect(()=>{
        const roughtCanvas = rough.canvas(canvasRef.current) ;

        elements.forEach(element => {
            roughtCanvas.linearPath(element.path) ;
        });

    } , [elements])

    const handleMouseDown = (e) => {
        const {offsetX , offsetY} = e.nativeEvent ;
        setIsDrawing(true) ;
        setElements((prev) => [
            ...prev ,
            {
               type: "pencil" , 
               offsetX ,
               offsetY ,
               path: [[offsetX,offsetY]],
               storke: "black" , 
            }

        ])
    }

    const handleMouseMove = (e) => {
        const {offsetX , offsetY} = e.nativeEvent ;
        if(isDrawing){

            //pencile By default as static 
            const {path} = elements[elements.length -1] ;
            const newPath = [...path , [offsetX , offsetY]] ;

            setElements((prev)=>
                prev.map((ele,index)=>{
                    if(index === elements.length -1){
                        return{
                            ...ele , 
                            path: newPath ,
                        };
                    }else{
                        return ele ;
                    }
                })
            )
        }
        
    }

    const handelMouseUp = (e) => {
        const {offsetX , offsetY} = e.nativeEvent ;
        setIsDrawing(false) ; 
    }

    return (
        <>
            <canvas ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handelMouseUp}
            className=""/>
        </>
);
}

export default WhiteBoard;
