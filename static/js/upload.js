// darg and drop handle
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const statusMessage = document.getElementById('status-message');
const uploadBtn = document.getElementById('upload-btn');
const inpLable = document.getElementById('input-lable');

var selectedFile;
var isSelected;

function goBack() {
    if (document.referrer && new URL(document.referrer).origin === location.origin) {
      // Came from same site, go back
      window.history.back();
    } else {
      // Came directly or from another site, go to home
      window.location.href = "/";
    }
  }


function addStatus(text, type) {
    statusMessage.textContent = text;

    let colorClass;
    if (type === "success") {
        colorClass = "text-success";
    } else if (type === "error") {
        colorClass = "text-danger";
    }else if (type == "warning") {
        colorClass = "text-warning";
    }else if (type == "info"){
        colorClass = " text-primary";
    }
    statusMessage.className = `mt-3 ${colorClass}`
}

// Handle file selection through input
fileInput.addEventListener('change', function() {handleFiles(this.files);});

function fileVal(file) {
    if (!file) {
        addStatus("Please select a file", "error");
        return { valid: false, error: "Please select a file" };
    }

    if (file.type !== "application/pdf") {
        addStatus('Please select a PDF file', "error");
        return { valid: false, error: "Please select a PDF file" };
    }

    return { valid: true, error: null };
}

function uploadFile(file){
    if(!isSelected){
        addStatus('Please select a file', "error");
        return;
    }
    addStatus('Uploading...', "info");
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/upload', {
            method: 'POST',
            body: formData
    }).then(response => {
        if (response.ok) {
            addStatus('File uploaded successfully!', "success");
        } else {
            addStatus('File upload failed.', "error");
        }
    }).catch(error => {
            console.error('Upload error:', error);
            addStatus('An error occurred during file upload.', "error");
    });
}
function selectedFileShow(name) {
    //name = name.replace(/\.[^/.]+$/, ""); //remove extension

    if (name.length > 25) {
        name = name.substring(0, 22) + '...';
    }

    inpLable.textContent = name;
}

function handleFiles(files) {
    if (files.length > 0){
        addStatus('File Selected', "info");
        const file = files[0];
        const validation = fileVal(file);
        if (!validation.valid) {
            return;
        }
        isSelected = true;
        selectedFile = file;
        selectedFileShow(file.name)
    }else{
        addStatus('Please select a file', "error");
    }
}

function handleDragOver(evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
    dropArea.style.backgroundColor = 'lightblue';
}

function handleDragLeave(evt) {
    evt.preventDefault();
    dropArea.style.backgroundColor = "";
}

function handleDrop(evt) {
    evt.preventDefault();
    dropArea.style.backgroundColor = '';
    const files = evt.dataTransfer.files;
    handleFiles(files);
}

uploadBtn.addEventListener('click',(e)=>{e.preventDefault();uploadFile(selectedFile);})

dropArea.addEventListener('dragover', handleDragOver, false);
dropArea.addEventListener('dragleave', handleDragLeave, false);
dropArea.addEventListener('drop', handleDrop, false);

