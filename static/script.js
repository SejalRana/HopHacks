const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const hiddenFileInput = document.getElementById('hidden-file-input');
const uploadForm = document.getElementById('upload-form');
const progressBar = document.getElementById('progress-bar');
const fileNameDisplay = document.getElementById('file-name');
const deselectButton = document.getElementById('deselect-button');
const uploadMessage = document.getElementById('upload-message');

// Drag and drop event listeners
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
        fileNameDisplay.textContent = files[0].name;
        deselectButton.style.display = 'block'; // Show the deselect button
    } else {
        alert('Please drop a valid file.');
    }
});

// File input change event listener
fileElem.addEventListener('change', () => {
    const file = fileElem.files[0];
    if (file) {
        hiddenFileInput.value = file.name;
        fileNameDisplay.textContent = file.name;
        deselectButton.style.display = 'block'; // Show the deselect button
    } else {
        hiddenFileInput.value = '';
        fileNameDisplay.textContent = 'Choose File (Formats: .csv, .xls, .xlsx)';
        deselectButton.style.display = 'none'; // Hide the deselect button
    }
});

// Deselect button event listener
deselectButton.addEventListener('click', () => {
    fileElem.value = ''; // Clear the file input
    hiddenFileInput.value = '';
    fileNameDisplay.textContent = 'Choose File (Formats: .csv, .xls, .xlsx)';
    deselectButton.style.display = 'none'; // Hide the deselect button
});

// Form submit event listener
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = fileElem.files[0];
    
    if (file) {
        const formData = new FormData(uploadForm);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadForm.action, true);
        
        
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                uploadMessage.style.display = 'block'; // Show success message
            } else {
                alert('Error uploading file.');
            }
        };
        
        xhr.send(formData);
    } else {
        alert('Please select a file.');
    }
});
