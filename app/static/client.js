var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";

    var items = ['upload-label', 'image-picked', 'result-label'];

    items.forEach((elId) => {
      el(elId).style.display = 'inline-block';
    });

    analyze();
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  el("result-label").innerHTML = '';
  el("result-label").className = '';
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  // el("analyze-button").innerHTML = "Analyzing...";
  // el("analyze-button").disabled = true;
  el("choose-file-button").innerHTML = "Analysing...";
  el("choose-file-button").disabled = true;
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    console.log(xhr.responseText);
    alert('An error occured, please try later');
  };
  xhr.onload = function(e) {
    // el("analyze-button").disabled = false;
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);

      var desc = 'Result: ' + response["result"];
      var newClass = 'label';

      el("result-label").innerHTML = desc;
      el("result-label").className = newClass;
    }
    // el("analyze-button").innerHTML = "Analyze";
    el("choose-file-button").innerHTML = "Select Image";
    el("choose-file-button").disabled = false;
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}
