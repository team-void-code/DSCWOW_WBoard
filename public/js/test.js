feather.replace();

const options = {
    editMode: false,
    paintColor: "tomato",
};

const mainBoard = new WhiteBoard((canvas) => {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = window.innerWidth * 0.4;
    document.querySelector("#canvasContainer").appendChild(canvas);
}, null, function onPaintEnd() {
    document.querySelectorAll("img").forEach((e) => {
        e.src = mainBoard.board.toDataURL();
    });
}, options);

const setDrawOption = (option, uiItem) => {
    if(!uiItem.classList.contains("selected")){
        document.querySelectorAll("svg[data-whiteboard-option]").forEach(elem => {
            elem.classList.remove("selected");
        });
        uiItem.style.animation = "none";
        setTimeout(() => {
            uiItem.classList.add("selected");
            uiItem.style.animation = "";
        });
    }
    switch (option) {
        case "mouse":
            options.editMode = false;
            break;
        case "edit":
            options.editMode = true;
            break;
        default:
            break;
    }
}



// window.onload = () => {
    document.querySelectorAll("img").forEach(elem => {
        elem.src = "/images/loading.gif";
    });
// }