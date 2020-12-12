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
}, null, function onPaintEnd() {
    dbRef.child("data/" + firebase.auth().currentUser.uid).update({
        img: mainBoard.board.toDataURL(),
        author: firebase.auth().currentUser.displayName,
    });
    // document.querySelectorAll("img").forEach((e) => {
    //     e.src = mainBoard.board.toDataURL();
    // });
}, options);

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
        dbRef.child("data/" + firebase.auth().currentUser.uid).update({
            img: mainBoard.board.toDataURL(),
            author: firebase.auth().currentUser.displayName,
            // uid : firebase.auth().currentUser.uid
        });
    }
}
// window.onload = () => {

// }



// for (let i in [...Array(5)]) {
//     document.querySelector("#participantCards").innerHTML += participantTemplate;
// }


document.querySelectorAll("img").forEach(elem => {
    elem.src = "/images/loading.gif";
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.querySelector("#user-image").innerHTML = `<img src = '${user.photoURL}' style = 'width : 40px;height : 40px;border-radius : 50%;'/>`;
    } else {

    }
});
dbRef.once("value", snap => {
    const val = snap.val();
    authorId = val["createdBy"];

    dbRef.on("value", (snapshot) => {
        const value = snapshot.val()["data"];
        if (typeof value == "object") {
            console.log(value);
            document.querySelector("#participantCards").innerHTML = "";
            for (let i in value) {
                // console.log(value[i]);
                const participantTemplate = `<!-- Card Wider -->
                <div class="card card-cascade wider mb-4" data-whiteboard-id = ${i}>
                
                    <!-- Card image -->
                    <div class="view view-cascade overlay zoom">
                        <img class="card-img-top"
                            src="${value[i]['img'] != undefined ? value[i]['img'] : 'http://localhost:4100/images/loading.gif'}"
                            alt="Card image cap">
                        <a href="#!">
                            <div class="mask rgba-white-slight"></div>
                        </a>
                    </div>
                
                    <!-- Card content -->
                    <div class="card-body card-body-cascade text-center">
                
                        <!-- Title -->
                        <h4 class="card-title"><strong style="font-weight: 300;">${value[i]["author"]}</strong></h4>
                        <!-- Subtitle -->
                        <h5 class="pb-2 hostText"><strong>${authorId == i ? 'Host' : 'Attendee'}</strong></h5>
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
                document.querySelector("#participantCards").innerHTML += participantTemplate;
            }
        }
    });
    dbRef.on("child_removed", (snapshot) => {
        console.log(snapshot.val());
    });
});

const leaveMeeting = () => {
    const m = confirm("Are your sure to leave meeting ?");
    if (m) {
        dbRef.child("data/" + firebase.auth().currentUser.uid).set({}).then(() => {
            location.replace("/home");
        });
    }
}