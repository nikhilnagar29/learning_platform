import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from 'roughjs';

const roughGenerator = rough.generator() ;

const WhiteBoard = ({ tool, canvasRef , ctxRef , elements , setElements }) => {

    const [isDrawing , setIsDrawing] = useState(false) ;
    const [screenW , setScreenW] = useState(window.innerWidth) ;
    
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

            setScreenW(screenWidth) ;

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

        if (elements.length > 0) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
            ctx.fillStyle = "gray"; // Set the fill style to gray
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Fill the entire canvas with gray
        }

        elements.forEach(element => {
            const ctx = canvasRef.current.getContext("2d") ;
            if(element.type === "pencil"){
                roughtCanvas.linearPath(element.path) ;
            }
            else if(element.type === "circle"){
                ctx.save(); // Save context state
                const {offsetX , offsetY , diameter , storke} = element ;
                ctx.beginPath() ;
                ctx.arc(offsetX , offsetY , diameter/2 , 0 , 2*Math.PI) ;
                ctx.strokeStyle = storke ;
                ctx.lineWidth = 2; // Reset lineWidth for circle
                ctx.stroke() ;
                ctx.restore(); // Restore context state
                // roughtCanvas.circle(offsetX , offsetY , diameter , { stroke: storke }) ;
            }
            else if(element.type === "line"){
                ctx.save(); // Save context state
                const {moveTo , lineTo , storke} = element ;
                ctx.beginPath() ;
                ctx.moveTo(moveTo[0] , moveTo[1]) ;
                ctx.lineTo(lineTo[0] , lineTo[1]) ;
                ctx.strokeStyle = storke ;
                ctx.stroke() ;
                ctx.restore(); // Restore context state
                // roughtCanvas.line(moveTo[0] , moveTo[1] , lineTo[0] , lineTo[1] , { stroke: storke }) ;
            }
            else if(element.type === "rectangle"){
                const {offsetX , offsetY , width , height , storke} = element ;
                ctx.save(); // Save context state
                ctx.beginPath() ;
                ctx.rect(offsetX , offsetY , width , height) ;
                ctx.strokeStyle = storke ;
                ctx.stroke() ;
                ctx.restore();
                // roughtCanvas.rectangle(offsetX , offsetY , width , height , { stroke: storke }) ;
            }
            else if(element.type === "highlight"){
                
                ctx.save(); // Save context state
                ctx.globalCompositeOperation = "multiply";
                ctx.strokeStyle = "yellow"; // Highlight color
                ctx.lineWidth = 15; // Thickness of the highlight
                ctx.lineJoin = "round"; // Smooth corners
                ctx.lineCap = "round"; // Smooth line ends
                ctx.shadowColor = "yellow"; // Glow color
                ctx.shadowBlur = 15; // Intensity of the glow

                ctx.beginPath();
                element.path.forEach((path, index) => {
                    if (index === 0) {
                        ctx.moveTo(path[0], path[1]); // Start at the first point
                    } else {
                        ctx.lineTo(path[0], path[1]); // Draw a line to the next point
                    }
                });
                ctx.stroke();
                ctx.restore(); // Restore context state
            }
            else if(element.type === "text"){
                const {offsetX , offsetY , text , storke} = element ;
                ctx.save(); // Save context state
                ctx.font = "20px comic sans ms"; // Set font size and family
                ctx.fillStyle = storke; // Set text color
                ctx.fillText(text, offsetX, offsetY); // Draw the text
                ctx.restore(); // Restore context state
            }

        });

    } , [elements , screenW] )


    const handleMouseDown = (e) => {

        const {offsetX , offsetY} = e.nativeEvent ;
        setIsDrawing(true) ;

        if(tool === "pencil"){     
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
        else if(tool === "circle"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "circle" , 
                    offsetX ,
                    offsetY ,
                    diameter: 0 ,
                    storke: "black" , 
                }
            ])
            
        }
        else if(tool === "line"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "line" , 
                    moveTo: [offsetX , offsetY] ,
                    lineTo: [offsetX , offsetY] ,
                    storke: "black" ,
                }
            ])
        }
        else if(tool === "rectangle"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "rectangle" , 
                    offsetX ,
                    offsetY ,
                    width: 0 ,
                    height: 0 ,
                    storke: "black" ,
                }
            ])
        }
        else if(tool === "highlight"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "highlight" , 
                    path: [[offsetX,offsetY]],
                    storke: "yellow" ,
                }
            ])
        }
        else if(tool === "text"){
            const text = prompt("Enter your text") ;

            text && setElements((prev) => [
                ...prev ,
                {
                    type: "text" , 
                    offsetX ,
                    offsetY ,
                    text ,
                    storke: "black" ,
                }
            ])
            setIsDrawing(false) ;
        }

    }

    const handleMouseMove = (e) => {

        const {offsetX , offsetY} = e.nativeEvent ;
        if(isDrawing){
            

                if(tool === "pencil"){
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
                else if(tool === "circle"){
                    const {offsetX: startX , offsetY: startY} = elements[elements.length -1] ;
                    const diameter = 2*Math.sqrt((startX - offsetX)**2 + (startY - offsetY)**2) ;

                    setElements((prev)=>
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele , 
                                    diameter
                                };
                            }else{
                                return ele ;
                            }
                        })
                    )

                }
                else if(tool === "line"){
                    const {lineTo} = elements[elements.length -1] ;

                    setElements((prev)=> 
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele , 
                                    lineTo: [offsetX , offsetY]
                                }
                            }else{
                                return ele ;
                            }
                        })
                    )
                }
                else if(tool == "rectangle"){
                    const {offsetX: startX , offsetY: startY} = elements[elements.length -1] ;
                    const width = offsetX - startX ;
                    const height = offsetY - startY ;

                    setElements((prev)=>
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele , 
                                    width , height
                                };
                            }else{
                                return ele ;
                            }
                        })
                    )
                }
                else if(tool === "highlight"){
                    const {path} = elements[elements.length -1] ;
                    const newPath = [...path , [offsetX , offsetY]] ;

                    setElements((prev)=>
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele ,
                                    path: newPath ,
                                };
                            }
                            return ele ; //returning all other elements as it is
                        })
                    );
                }


        }

        
    }

    const handelMouseUp = (e) => {

            const {offsetX , offsetY} = e.nativeEvent ;
            setIsDrawing(false) ;
        
    }

    return (
        <>
            <div className="">
                <canvas ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handelMouseUp}
                className=""/>
            </div>
        </>
);
}

export default WhiteBoard;
