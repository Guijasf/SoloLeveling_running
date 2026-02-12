const canvas = document.getElementById("radarChart");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#00d4ff";
ctx.beginPath();
ctx.moveTo(150,20);
ctx.lineTo(280,120);
ctx.lineTo(230,260);
ctx.lineTo(70,260);
ctx.lineTo(20,120);
ctx.closePath();
ctx.stroke();
