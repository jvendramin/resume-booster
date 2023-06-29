var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

// store user inputs to pass to loading page
function storage(event) {

    const posting = document.getElementById("posting").value;
    const resume = document.getElementById("resume").files[0];
    const filename = resume.name.replaceAll(' ','_');

    sessionStorage.setItem('posting', posting);
    sessionStorage.setItem('resume', resume);
    sessionStorage.setItem('filename', filename);
    sessionStorage.setItem('output', output.innerHTML);
    
    window.location = "./loading.html";

    event.preventDefault();
}

// trigger when user clicks submit button
const form = document.getElementById("submission");
form.addEventListener("submit", storage);