import { useEffect, useLayoutEffect, useCallback, useMemo, useRef, useState } from "react";
import { Pencil, Circle, Square, Type, Highlighter, Eraser, Undo, Redo, Trash2, Download, Users, MessageCircle } from "lucide-react";

import rough from 'roughjs';

const roughGenerator = rough.generator() ;

const WhiteBoard = ({ tool, canvasRef , ctxRef , elements , setElements , color }) => {

    const [isDrawing , setIsDrawing] = useState(false) ;
    const [screenW , setScreenW] = useState(window.innerWidth) ;
    const [screenH , setScreenH] = useState(window.innerHeight) ;
    
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

            setScreenW(screenWidth) ;
            setScreenH(screenHeight) ;

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
    },)

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
                ctx.save(); // Save context state
                roughtCanvas.linearPath(element.path , { stroke: element.storke }) ;
                ctx.restore(); // Restore context state
                
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
                const {offsetX , offsetY , width , height , storke , fillStyle} = element ;
                ctx.save(); // Save context state
                ctx.beginPath() ;
                ctx.rect(offsetX , offsetY , width , height) ;
                ctx.fillStyle = fillStyle || "transparent"; 
                ctx.fill();
                ctx.strokeStyle = storke || "transparent";
                ctx.stroke() ;
                ctx.restore();
                // roughtCanvas.rectangle(offsetX , offsetY , width , height , { stroke: storke }) ;
            }
            else if(element.type === "highlight"){
                
                ctx.save(); // Save context state
                ctx.globalCompositeOperation = "multiply";
                ctx.strokeStyle = element.storke || "yellow"; // Highlight color
                ctx.lineWidth = 15; // Thickness of the highlight
                ctx.lineJoin = "round"; // Smooth corners
                ctx.lineCap = "round"; // Smooth line ends
                ctx.shadowColor = element.storke || "yellow"; // Glow color
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
            else if(element.type === "pen"){
                const {path , storke} = element ;
                ctx.save(); // Save context state
                ctx.beginPath();
                path.forEach((path, index) => {
                    if (index === 0) {
                        ctx.moveTo(path[0], path[1]); // Start at the first point
                    } else {
                        ctx.lineTo(path[0], path[1]); // Draw a line to the next point
                    }
                });
                ctx.strokeStyle = storke; // Set stroke color
                ctx.lineWidth = 2; // Set line width
                ctx.lineJoin = "round"; // Smooth corners
                ctx.lineCap = "round"; // Smooth line ends
                ctx.stroke(); // Draw the path
                ctx.restore(); // Restore context state
            }
            else if(element.type === "eraser"){
                const {path , storke} = element ;
                ctx.save(); // Save context state
                // Erase instead of draw
                ctx.beginPath();
                path.forEach((path, index) => {
                    if (index === 0) {
                        ctx.moveTo(path[0], path[1]); // Start at the first point
                    } else {
                        ctx.lineTo(path[0], path[1]); // Draw a line to the next point
                    }
                });
                ctx.strokeStyle = "gray"; // Set stroke color to white
                ctx.lineWidth = 40; // Set line width
                ctx.lineJoin = "round"; // Smooth corners
                ctx.lineCap = "round"; // Smooth line ends
                ctx.stroke(); // Draw the path
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
                storke: color, 
                WhenScreenW: screenW , 
                WhenScreenH: screenH
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
                    storke: color , 
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
                    storke: color ,
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
                    storke: color ,
                }
            ])
        }
        else if(tool === "highlight"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "highlight" , 
                    path: [[offsetX,offsetY]],
                    storke: color ,
                    shadowColor: color ,
                    strokeStyle: color ,
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
                    storke: color ,
                }
            ])
            setIsDrawing(false) ;
        }
        else if(tool === "pen"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "pen" , 
                    offsetX ,
                    offsetY ,
                    path: [[offsetX,offsetY]],
                    storke: color ,
                }
            ])
        }
        else if(tool === "eraser"){
            setElements((prev) => [
                ...prev ,
                {
                    type: "eraser" , 
                    offsetX ,
                    offsetY ,
                    path: [[offsetX,offsetY]],
                    storke: "gray" ,
                }
            ])
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
                else if(tool === "pen"){
                    const {path} = elements[elements.length -1] ;
                    const newPath = [...path , [offsetX , offsetY]] ;

                    setElements((prev)=>
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele ,
                                    path: newPath,
                                };
                            }
                            return ele ; //returning all other elements as it is
                        })
                    );
                }
                else if(tool === "eraser"){
                    const {path} = elements[elements.length -1] ;
                    const newPath = [...path , [offsetX , offsetY]] ;

                    setElements((prev)=>
                        prev.map((ele,index)=>{
                            if(index === elements.length -1){
                                return{
                                    ...ele ,
                                    path: newPath,
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
            <div className= "">
                <canvas ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handelMouseUp}
                className=""
                style={{cursor: "crosshair"}}/>
            </div>
        </>
);
}

// Optimized Whiteboard Component
const OptimizedWhiteboard = ({ 
    tool, 
    elements, 
    setElements, 
    color, 
    onAddElement,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex 
  }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentElement, setCurrentElement] = useState(null);
    
    // Optimized canvas setup with proper scaling
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      
      // Set actual size in memory (scaled up for retina displays)
      const scale = window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      
      // Scale the context back down
      ctx.scale(scale, scale);
      
      // Set CSS size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Initial background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);
    
    // Optimized rendering with offscreen canvas for better performance
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Draw all elements
      elements.forEach(element => {
        if (!element.type) return;
        
        switch (element.type) {
          case 'pencil':
          case 'pen':
            DrawingUtils.drawPencil(ctx, element);
            break;
          case 'circle':
            DrawingUtils.drawCircle(ctx, element);
            break;
          case 'rectangle':
            DrawingUtils.drawRectangle(ctx, element);
            break;
          case 'highlight':
            DrawingUtils.drawHighlight(ctx, element);
            break;
          case 'text':
            DrawingUtils.drawText(ctx, element);
            break;
          case 'eraser':
            DrawingUtils.drawEraser(ctx, element);
            break;
        }
      });
    }, [elements]);
    
    // Optimized event handlers
    const handleMouseDown = useCallback((e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDrawing(true);
      
      let newElement = {
        id: Date.now() + Math.random(),
        type: tool,
        stroke: color,
        lineWidth: tool === 'highlighter' ? 15 : tool === 'eraser' ? 20 : 2,
        timestamp: Date.now()
      };
      
      switch (tool) {
        case 'pencil':
        case 'pen':
        case 'highlighter':
        case 'eraser':
          newElement.path = [[x, y]];
          break;
        case 'circle':
          newElement.offsetX = x;
          newElement.offsetY = y;
          newElement.radius = 0;
          break;
        case 'rectangle':
          newElement.offsetX = x;
          newElement.offsetY = y;
          newElement.width = 0;
          newElement.height = 0;
          break;
        case 'text':
          const text = prompt('Enter text:');
          if (text) {
            newElement.offsetX = x;
            newElement.offsetY = y;
            newElement.text = text;
            newElement.fontSize = 16;
            newElement.fontFamily = 'Arial';
          } else {
            setIsDrawing(false);
            return;
          }
          break;
      }
      
      setCurrentElement(newElement);
      
      if (tool === 'text') {
        setElements(prev => [...prev, newElement]);
        onAddElement?.(newElement);
        setIsDrawing(false);
      }
    }, [tool, color, setElements, onAddElement]);
    
    const handleMouseMove = useCallback((e) => {
      if (!isDrawing || !currentElement) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      let updatedElement = { ...currentElement };
      
      switch (tool) {
        case 'pencil':
        case 'pen':
        case 'highlighter':
        case 'eraser':
          updatedElement.path = [...currentElement.path, [x, y]];
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(x - currentElement.offsetX, 2) + 
            Math.pow(y - currentElement.offsetY, 2)
          );
          updatedElement.radius = radius;
          break;
        case 'rectangle':
          updatedElement.width = x - currentElement.offsetX;
          updatedElement.height = y - currentElement.offsetY;
          break;
      }
      
      setCurrentElement(updatedElement);
      
      // Update the last element in the array
      setElements(prev => {
        const newElements = [...prev];
        if (newElements.length > 0 && newElements[newElements.length - 1].id === currentElement.id) {
          newElements[newElements.length - 1] = updatedElement;
        } else {
          newElements.push(updatedElement);
        }
        return newElements;
      });
    }, [isDrawing, currentElement, tool, setElements]);
    
    const handleMouseUp = useCallback(() => {
      if (isDrawing && currentElement) {
        onAddElement?.(currentElement);
        
        // Add to history for undo/redo
        setHistory(prev => [...prev.slice(0, historyIndex + 1), [...elements, currentElement]]);
        setHistoryIndex(prev => prev + 1);
      }
      
      setIsDrawing(false);
      setCurrentElement(null);
    }, [isDrawing, currentElement, onAddElement, elements, setHistory, historyIndex, setHistoryIndex]);
    
    return (
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair border border-gray-300 bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    );
  };

  export default WhiteBoard ;
