var etatLegend = 1;
var etatEditor = 0;

function menu() {
    if (etatLegend==0) {
      // We want to display the legend
      document.getElementById("OurLegend").style.visibility="visible";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(0,100,100)";
      document.getElementById("OurInteraction").style.top = '31em';
      console.log('Display menu')
      etatLegend = 1;

    } else {
      // We want to hide the legend
      document.getElementById("OurLegend").style.visibility="collapse";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(100,0,0)";
      document.getElementById("OurInteraction").style.top = '10.5em';
      console.log('Hide menu')
      etatLegend = 0;
    }
}

function edit() {
    if (etatEditor==0) {
      // We want to display the editor options
      document.getElementById("EditorOption").style.visibility="visible";
      document.getElementById("OurButtonEdit").style.backgroundColor="rgb(0,100,100)";
      console.log('Display editor')
      etatEditor = 1;

    } else {
      // We want to hide the editor options
      document.getElementById("EditorOption").style.visibility="collapse";
      document.getElementById("OurButtonEdit").style.backgroundColor="rgb(100,0,0)";
      console.log('Hide editor')
      etatEditor = 0;
    }
}
//Bonjour Benoît tu peux déplacer tout cecicela dans mapengine.js
function onFileSelected(event){
  var selectedFile = event.target.files[0];
  var reader = new FileReadElementById("imgElement");
  imgtag.title= selectedFile.name;
  reader.onload = function(event){
    imgtag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
}
function saveform(callback){
  var files = document.getElementById("fileinput").files;
  var request = window.superagent;
  request
    .post('/file')
    .attach('fileToUpload',file,file.name)
    .end(function(err, res){
      if (res.status !== 200){
        return callback(null, res.text);
      }
      else {
        savedata(callback);
      }
    }
}