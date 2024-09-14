const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const hiddenFileInput = document.getElementById('hidden-file-input');
const uploadForm = document.getElementById('upload-form');
const progressBar = document.getElementById('progress-bar');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragging');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragging');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragging');
    const files = Array.from(event.dataTransfer.files);

    // Check if the dropped items are files
    if (files.length > 0 && files.every(file => file.type)) {
        fileElem.files = files;
        hiddenFileInput.value = files[0].name;
    } else {
        alert('Please drop a valid file.');
    }
});

fileElem.addEventListener('change', () => {
    const file = fileElem.files[0];
    if (file) {
        hiddenFileInput.value = file.name;
    } else {
        hiddenFileInput.value = '';
    }
});

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = fileElem.files[0];
    
    if (file) {
        const formData = new FormData(uploadForm);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadForm.action, true);
        
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = `${percentComplete}%`;
            }
        });
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                alert('File uploaded successfully!');
            } else {
                alert('Error uploading file.');
            }
        };
        
        xhr.send(formData);
    } else {
        alert('Please select a file.');
    }
});
