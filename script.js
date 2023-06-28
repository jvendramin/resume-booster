// store user inputs to pass to loading page
function storage(event) {

    const url = document.getElementById("jobURL").value;
    const resume = document.getElementById("resume").files[0];
    const filename = resume.name.replaceAll(' ','_');

    alert(filename)

    sessionStorage.setItem('url', url);
    sessionStorage.setItem('resume', resume);
    sessionStorage.setItem('filename', filename);

    alert('storage complete')
    
    window.location = "./loading.html";

    event.preventDefault();
}

// trigger when user clicks submit button
const form = document.getElementById("submission");
form.addEventListener("submit", storage);