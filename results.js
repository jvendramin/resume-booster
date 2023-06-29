// update the text box on the result page once received from the API response
document.addEventListener('DOMContentLoaded', function(){
    const contentDiv = document.getElementById('resp');
    const btn = document.getElementById("resumeButton");
    const url = sessionStorage.getItem('data');
    const data = sessionStorage.getItem('data');
    if(data){
        contentDiv.innerHTML = data;
        btn.href = url;
    }
 });

var btn = document.getElementById("resumeButton");
btn.value = 'my value'; // will just add a hidden value
btn.innerHTML = 'my text';

document.getElementById("resumeButton").onclick = function() {
    this.href = "http://design.framesmile.com/?sessionid=guest&ref=" + booktype.value + pagesize.value + "*projectName=" + projtitle.value + " / ";
    console.log(this.href);
  }