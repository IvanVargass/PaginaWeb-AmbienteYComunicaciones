// Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBKinWxC0cifRXppOz8Mchz7B0bq_0k3RU",
        authDomain: "ambiente-y-comunicaciones.firebaseapp.com",
        projectId: "ambiente-y-comunicaciones",
        storageBucket: "ambiente-y-comunicaciones.appspot.com",
        messagingSenderId: "839284570504",
        appId: "1:839284570504:web:7b9ea4b5d910367007223d"
      };
firebase.initializeApp(firebaseConfig);



var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage");
var progress =  document.querySelector(".progress");
var percentVal;
var fileItem;
var fileName;
var img = document.querySelector(".img");
 function getFile(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
}


function uploadImage(){

    let storageRef = firebase.storage().ref("images/"+fileName);
    let uploadTask = storageRef.put(fileItem);


    uploadTask.on("state_changed",(snapshot)=>{
        console.log(snapshot);
        percentVal = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        console.log(percentVal);
        uploadPercentage.innerHTML = percentVal+"%";
        progress.style.width=percentVal+"%";
    },(error)=>{
        console.log("Error is ", error);
    },()=>{

        uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
            console.log("URL", url);

            if(url != ""){
                img.setAttribute("src",url);
                img.style.display="block";
            }


        })


    })
    
    
}