import React from 'react';
import { useState } from 'react';

const IndexBar = ({ tool , setTool }) => {
    
        const  [pencil,setPencil] = useState(true) ;
        const  [line,setLine] = useState(false) ;
        const  [rectangle,setRectangle] = useState(false) ;
        const  [circle,setCircle] = useState(false) ;
    
    return (
        <div className="mt-5 index-bar flex bg-gray-200 fixed justify-center rounded-full px-3 py-1 gap-4 h-12 w-[380px]"  
            style={{
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000, // Ensures it's above all elements
            }}>

    
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 18.89H6.41421L15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89ZM21 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L9.24264 18.89H21V20.89ZM15.7279 6.74785L17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785Z"/></svg>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.9498 2.39017L21.6066 8.04702C21.9972 8.43755 21.9972 9.07071 21.6066 9.46124L13.8285 17.2394L11.7071 17.9465L10.2929 19.3607C9.90241 19.7513 9.26925 19.7513 8.87872 19.3607L4.63608 15.1181C4.24556 14.7276 4.24556 14.0944 4.63608 13.7039L6.0503 12.2897L6.7574 10.1683L14.5356 2.39017C14.9261 1.99964 15.5593 1.99964 15.9498 2.39017ZM16.6569 5.9257L10.2929 12.2897L11.7071 13.7039L18.0711 7.33992L16.6569 5.9257ZM4.28253 16.8859L7.11096 19.7143L5.69674 21.1285L1.4541 19.7143L4.28253 16.8859Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21C21.5523 4 22 4.44772 22 5V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4ZM4 6V18H20V6H4Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"/></svg>
            <h5 className='text-4xl mt-[-5px]'>/</h5>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM7 8H17V11H15V10H13V14H14.5V16H9.5V14H11V10H9V11H7V8Z"/></svg>
        
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.82843 6.99955L8.36396 9.53509L6.94975 10.9493L2 5.99955L6.94975 1.0498L8.36396 2.46402L5.82843 4.99955H13C17.4183 4.99955 21 8.58127 21 12.9996C21 17.4178 17.4183 20.9996 13 20.9996H4V18.9996H13C16.3137 18.9996 19 16.3133 19 12.9996C19 9.68584 16.3137 6.99955 13 6.99955H5.82843Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.1716 6.99955H11C7.68629 6.99955 5 9.68584 5 12.9996C5 16.3133 7.68629 18.9996 11 18.9996H20V20.9996H11C6.58172 20.9996 3 17.4178 3 12.9996C3 8.58127 6.58172 4.99955 11 4.99955H18.1716L15.636 2.46402L17.0503 1.0498L22 5.99955L17.0503 10.9493L15.636 9.53509L18.1716 6.99955Z"/></svg>
        
        </div>
    );
};

export default IndexBar;