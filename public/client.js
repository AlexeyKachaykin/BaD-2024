document.getElementById('uploadButton').addEventListener('click', function (event) {
    console.log('Button clicked');
    event.preventDefault();
    uploadFile();
});

async function uploadFile() {
    console.log('uploadFile function called');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log('Data received:', data);

            // Display message on the webpage
            document.getElementById('result').innerText = 'File upload and processing completed. Check the server logs for details.';

        } catch (error) {
            console.error('Error:', error.message);
            document.getElementById('result').innerText = 'Error during file upload and processing.';
        }
    } else {
        console.log('No file selected');
        document.getElementById('result').innerText = 'Please choose a file to upload.';
    }
}
