feather.replace();

const mainBoard = new WhiteBoard((canvas) => {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = window.innerWidth * 0.4;
    document.querySelector("#canvasContainer").appendChild(canvas);
});