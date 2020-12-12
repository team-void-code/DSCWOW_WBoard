feather.replace();
new WOW().init();

const typeWrite = (txt,elem) => {
    var speed = 100;

    function typeWriter() {
        if (i < txt.length) {
            elem.innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

const createMeeting = () => {
    location.href = "/waiting";
}