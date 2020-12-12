feather.replace();
new WOW().init();

const options = {
    editMode: false,
    paintColor: "#ff6347",
    thickness: 2,
    erasing: false
};

const mainBoard = new WhiteBoard((canvas) => {
    canvas.width = window.innerWidth * 0.4;
    canvas.height = window.innerWidth * 0.4;
    document.querySelector("#canvasContainer").appendChild(canvas);
}, function onPaintEnd() {
    document.querySelectorAll("img").forEach((e) => {
        e.src = mainBoard.board.toDataURL();
    });
}, null, options);

const setDrawOption = (option, uiItem) => {
    if (!uiItem.classList.contains("selected")) {
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
            options.erasing = false;
            break;
        case "erase":
            options.erasing = true;
            break;
        case "color":
            $("#colorPaletteModal").modal("show");
            setTimeout(() => {
                document.querySelector("input").click();
            }, 500);
            break;
        case "thick":
            $("#markerThicknessModal").modal("show");
            break;
        default:
            break;
    }
}

const changeMarkerThickness = (thickness) => {
    document.querySelector("#markerThickness").innerHTML = thickness;
    options.thickness = Number(thickness);
}

const changePaintColor = (color) => {
    options.paintColor = color;
}

const clearBoard = () => {
    const m = confirm("Wanted to clear board?");
    if (m) {
        mainBoard.ctx.clearRect(0, 0, mainBoard.board.width, mainBoard.board.height);
        document.querySelectorAll("img").forEach((e) => {
            e.src = mainBoard.board.toDataURL();
        });
    }
}
// window.onload = () => {

// }

const participantTemplate = `<!-- Card Wider -->
<div class="card card-cascade wider mb-4">

    <!-- Card image -->
    <div class="view view-cascade overlay zoom">
        <img class="card-img-top"
            src="https://expertphotography.com/wp-content/uploads/2020/08/social-media-profile-photos-3.jpg"
            alt="Card image cap">
        <a href="#!">
            <div class="mask rgba-white-slight"></div>
        </a>
    </div>

    <!-- Card content -->
    <div class="card-body card-body-cascade text-center">

        <!-- Title -->
        <h4 class="card-title"><strong style="font-weight: 300;">Ashhar Ali</strong></h4>
        <!-- Subtitle -->
        <h5 class="pb-2 hostText"><strong>Host</strong></h5>
        <!-- Text -->
        <p class="card-text"></p>

        <!-- Linkedin -->
        <!--                            <a class="px-2 fa-lg li-ic"><i class="fab fa-linkedin-in"></i></a>-->
        <!--                            &lt;!&ndash; Twitter &ndash;&gt;-->
        <!--                            <a class="px-2 fa-lg tw-ic"><i class="fab fa-twitter"></i></a>-->
        <!--                            &lt;!&ndash; Dribbble &ndash;&gt;-->
        <!--                            <a class="px-2 fa-lg fb-ic"><i class="fab fa-facebook-f"></i></a>-->

    </div>

</div>
<!-- Card Wider -->`;

for (let i in [...Array(5)]) {
    document.querySelector("#participantCards").innerHTML += participantTemplate;
}


document.querySelectorAll("img").forEach(elem => {
    elem.src = "/images/loading.gif";
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.querySelector("#user-image").innerHTML = `<img src = '${user.photoURL}' style = 'width : 40px;height : 40px;border-radius : 50%;'/>`;
    } else {

    }
});