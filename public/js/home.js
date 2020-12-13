feather.replace();
new WOW().init();
const db = firebase.database();

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
    $("#createMeetingModal").modal("show");
    const meetingId = db.ref("/meetings").push().key;
    db.ref(`/meetings/${meetingId}`).update({
        createdBy : firebase.auth().currentUser.uid,
        data : {}
    }).then(()=>{
        location.href = `/waiting/${meetingId}`;
    });
}

const joinMeeting = () => {
    const id = document.querySelector("#form1").value;
    $("#joiningMeetingModal").modal("show");
    if(id.length > 0){
        db.ref(`/meetings/${id}`).once("value",(snapshot)=>{
            if(snapshot.val() != null){
                location.href = `/board/${id}`;
            }else{
                $("#joiningMeetingModal").modal("hide");
                $("#wrongMeetingCodeModal").modal("show");
            }
        });
    }
}