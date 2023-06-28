document.addEventListener('DOMContentLoaded', function(){
    const contentDiv = document.getElementById('resp');
    const data = sessionStorage.getItem('data');
    if(data){
        contentDiv.innerHTML = data;
    }
 });