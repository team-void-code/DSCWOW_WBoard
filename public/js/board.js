feather.replace();
new WOW().init();
document.querySelector("#editItems").style.opacity = "0";
let kickedOutInThisSession = 0;

const options = {
    editMode: false,
    paintColor: "#ff6347",
    thickness: 3,
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
    $("#clearCanvasModal").modal("show");
}

const eraseAllFromBoard = () => {
    mainBoard.ctx.clearRect(0, 0, mainBoard.board.width, mainBoard.board.height);
    dbRef.child("data/" + firebase.auth().currentUser.uid).update({
        img: mainBoard.board.toDataURL(),
        author: firebase.auth().currentUser.displayName,
        // uid : firebase.auth().currentUser.uid
    });
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
        document.querySelector("#editItems").style.opacity = "1";
        document.querySelector("#user-image").innerHTML = `<img src = '${user.photoURL}' style = 'width : 40px;height : 40px;border-radius : 50%;'/>`;

        dbRef.once("value", snap => {
            const val = snap.val();
            authorId = val["createdBy"];
        
            dbRef.on("value", (snapshot) => {
                const value = snapshot.val()["data"];
                if (value[firebase.auth().currentUser.uid]["kicked"]) {
                    document.querySelector("#editItems").style.opacity = "0";
                    if (kickedOutInThisSession == 0) {
                        $("#userKickedModal").modal("show");
                        options.editMode = false;
                        kickedOutInThisSession++;
                    }
                } else {
                    document.querySelector("#editItems").style.opacity = "1";
                    kickedOutInThisSession = 0;
                }
                if (typeof value == "object") {
                    // console.log(value);
                    document.querySelector("#participantCards").innerHTML = "";
                    for (let i in value) {
                        // console.log(value[i]);
                        let cardText;
                        if (value[i]["kicked"]) {
                            cardText = `<p class="card-text">${authorId == firebase.auth().currentUser.uid && i != firebase.auth().currentUser.uid ? `<button class = "btn btn-success" onclick = "addUser('${i}','${value[i]["author"]}')">Add Back</button>` : ''}</p>`;
                        } else {
                            cardText = `<p class="card-text"><button class = "btn btn-info" onclick = "copyToMyCanvas('${value[i]['img']}')">Copy</button> ${authorId == firebase.auth().currentUser.uid && i != firebase.auth().currentUser.uid ? `<button class = "btn btn-warning" onclick = "kickOut('${i}','${value[i]["author"]}')">Kick</button>` : ''}</p>`;
                        }
                        const image = `<div class="view view-cascade overlay zoom">
                        <img class="card-img-top"
                            src="${value[i]['img'] != undefined ? value[i]['img'] : 'http://localhost:4100/images/loading.gif'}"
                            alt="Card image cap">
                        <a>
                            <div class="mask rgba-white-slight"></div>
                        </a>
                    </div>`;
                        const participantTemplate = `<!-- Card Wider -->
                        <div class="card card-cascade wider mb-4" data-whiteboard-id = ${i}>
                        
                            <!-- Card image -->
                            ${value[i]["kicked"] ? '' : image}
                            
                        
                            <!--Card content -->
                            <div class="card-body card-body-cascade text-center">
        
                                <!-- Title -->
                                <h4 class="card-title"><strong style="font-weight: 300;">${value[i]["author"]}</strong></h4>
                                <!-- Subtitle -->
                                <h5 class="pb-2 hostText"><strong>${authorId == i ? 'Host' : 'Attendee'}</strong></h5>
                                <!-- Text -->
                                ${cardText}
                                <!-- Linkedin -->
                                <!--                            <a class="px-2 fa-lg li-ic"><i class="fab fa-linkedin-in"></i></a>-->
                                <!--                            &lt;!&ndash; Twitter &ndash;&gt;-->
                                <!--                            <a class="px-2 fa-lg tw-ic"><i class="fab fa-twitter"></i></a>-->
                                <!--                            &lt;!&ndash; Dribbble &ndash;&gt;-->
                                <!--                            <a class="px-2 fa-lg fb-ic"><i class="fab fa-facebook-f"></i></a>-->
        
                            </div>
                        
                        </div >
                        <!-- Card Wider--> `;
                        if (authorId == firebase.auth().currentUser.uid && value[i]["kicked"]) {
                            document.querySelector("#participantCards").innerHTML += participantTemplate;
                        }
                        else if (!value[i]["kicked"]) {
                            document.querySelector("#participantCards").innerHTML += participantTemplate;
                        }
                    }
                }
            });
            dbRef.on("child_removed", (snapshot) => {
                console.log(snapshot.val());
            });
        });
    }
});

const leaveMeeting = () => {
    $("#leaveMeetingModal").modal("show");
}
const exit = () => {
    dbRef.child("data/" + firebase.auth().currentUser.uid).set({}).then(() => {
        location.replace("/home");
    });
}
let reader = null;
document.querySelector("input[type=file]").addEventListener("change", (e) => {
    let file = e.target.files[0];
    reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function (ev) {
            var canvas = document.querySelector('canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            dbRef.child("data/" + firebase.auth().currentUser.uid).update({
                img: mainBoard.board.toDataURL(),
                author: firebase.auth().currentUser.displayName,
                // uid : firebase.auth().currentUser.uid
            });
        }
    }
});
const startImage = () => {
    // $("#fileInputModal").modal("show");
    document.querySelector("input[type=file]").click();
}

const kickOut = (uid, username) => {
    document.querySelector("#kickOutModal").innerHTML = `<div class="modal-dialog" role = "document" >
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Sure to Kick ${username} out of meeting</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-info" data-dismiss="modal">Cancel</button>
                            <button class="btn btn-error" data-dismiss="modal" onclick="removeUser('${uid}')">Kick</button>
                        </div>
                    </div>
</div > `;
    $("#kickOutModal").modal("show");
}
const addUser = (uid, username) => {
    document.querySelector("#kickOutModal").innerHTML = `<div class="modal-dialog" role = "document" >
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Sure to Add ${username} back to meeting</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button class="btn" data-dismiss="modal">Cancel</button>
                            <button class="btn btn-success" data-dismiss="modal" onclick="addBackUser('${uid}')">Add Back</button>
                        </div>
                    </div>
</div > `;
    $("#kickOutModal").modal("show");
}

const removeUser = uid => {
    dbRef.child("data/" + uid).update({
        kicked: true,
        // uid : firebase.auth().currentUser.uid
    });
}
const addBackUser = uid => {
    dbRef.child("data/" + uid).update({
        kicked: null,
        // uid : firebase.auth().currentUser.uid
    });
}

const copyToMyCanvas = dataURI => {
    var myCanvas = document.querySelector('canvas');
    var ctx = myCanvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = dataURI;
}