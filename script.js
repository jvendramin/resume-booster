// store user inputs to pass to loading page
function storage(event) {

    const posting = document.getElementById("posting").value;
    const resume = document.getElementById("resume").files[0];
    const filename = resume.name.replaceAll(' ','_');

    sessionStorage.setItem('posting', posting);
    sessionStorage.setItem('resume', resume);
    sessionStorage.setItem('filename', filename);
    
    window.location = "./loading.html";

    event.preventDefault();
}

// trigger when user clicks submit button
const form = document.getElementById("submission");
form.addEventListener("submit", storage);