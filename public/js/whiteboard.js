class WhiteBoard {
    /**
     * 
     * @param {Function} onCreate
     */
    constructor(onCreate) {
        const canvas = document.createElement("canvas");
        let painting = false;
        let prevX = 0,
            currX = 0,
            prevY = 0,
            currY = 0,
            dot_flag = false;
        let x = "tomato",
            y = 2;
        if (onCreate) onCreate(canvas);
        const ctx = canvas.getContext("2d");

        function paint() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }

        function findxy(res, e) {
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;

                painting = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }
            if (res == 'up' || res == "out") {
                painting = false;
            }
            if (res == 'move') {
                if (painting) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.offsetLeft;
                    currY = e.clientY - canvas.offsetTop;
                    paint();
                }
            }
        }

        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
        this.board = canvas;
    }

}

// export default WhiteBoard;