
// Optimized drawing utilities
const DrawingUtils = {
    drawPencil: (ctx, element) => {
      if (!element.path || element.path.length < 2) return;
      
      ctx.save();
      ctx.strokeStyle = element.stroke || '#000';
      ctx.lineWidth = element.lineWidth || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(element.path[0][0], element.path[0][1]);
      
      for (let i = 1; i < element.path.length; i++) {
        ctx.lineTo(element.path[i][0], element.path[i][1]);
      }
      
      ctx.stroke();
      ctx.restore();
    },
    
    drawCircle: (ctx, element) => {
      ctx.save();
      ctx.strokeStyle = element.stroke || '#000';
      ctx.lineWidth = element.lineWidth || 2;
      ctx.beginPath();
      ctx.arc(element.offsetX, element.offsetY, element.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    },
    
    drawRectangle: (ctx, element) => {
      ctx.save();
      ctx.strokeStyle = element.stroke || '#000';
      ctx.lineWidth = element.lineWidth || 2;
      ctx.strokeRect(element.offsetX, element.offsetY, element.width, element.height);
      ctx.restore();
    },
    
    drawHighlight: (ctx, element) => {
      if (!element.path || element.path.length < 2) return;
      
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = element.stroke || 'rgba(255, 255, 0, 0.3)';
      ctx.lineWidth = element.lineWidth || 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(element.path[0][0], element.path[0][1]);
      
      for (let i = 1; i < element.path.length; i++) {
        ctx.lineTo(element.path[i][0], element.path[i][1]);
      }
      
      ctx.stroke();
      ctx.restore();
    },
    
    drawText: (ctx, element) => {
      ctx.save();
      ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
      ctx.fillStyle = element.stroke || '#000';
      ctx.fillText(element.text, element.offsetX, element.offsetY);
      ctx.restore();
    },
    
    drawEraser: (ctx, element) => {
      if (!element.path || element.path.length < 2) return;
      
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = element.lineWidth || 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(element.path[0][0], element.path[0][1]);
      
      for (let i = 1; i < element.path.length; i++) {
        ctx.lineTo(element.path[i][0], element.path[i][1]);
      }
      
      ctx.stroke();
      ctx.restore();
    }
  };

  export default DrawingUtils ;