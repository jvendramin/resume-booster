// update the text box on the result page once received from the API response
document.addEventListener('DOMContentLoaded', function(){
    const contentDiv = document.getElementById('resp');
    const data = sessionStorage.getItem('data');
    if(data){
        contentDiv.innerHTML = data;
    }
 });