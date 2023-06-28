// openai creds
const openAIHeaders = {'Authorization':config.openAIKey,'Content-Type':'application/json'};

// pass response from open ai to results page and redirect
function advance(response) {

    document.getElementById("hidden").addEventListener("change", sessionStorage.setItem('data', response));
    window.location.href = "./resultsPage.html";
};

// update the hidden text field with open ai response and call advance function
function updateHidden(response) {

    document.getElementById("hidden").innerHTML = response;
    document.getElementById("hidden").addEventListener("change", advance(response));

};

// function to send prompt to Open AI and call updateHidden function
async function postOAI(url,resumeurl) {

    const payload = {
        "model": "text-davinci-003",
        "prompt": `Step 1: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from this job posting: ${url}. Step 2: Use this resume: ${resumeurl} to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section to be relevant to the included job posting. Step 3: Return both lists in HTML format using <ul>. Step 4: Use <h3> tags for the list titles.`,
        "max_tokens": 3700,
        "temperature": 0.7
    };

    const res = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: openAIHeaders
    })

    const oaiJSON = await res.json();
    const text = oaiJSON.choices[0].text.replaceAll(/\n/g,'');

    updateHidden(text)

    return text;
};

// function to upload resume to s3 and call open ai function
async function putS3(event) {

    const url = sessionStorage.getItem('url');
    const resume = sessionStorage.getItem('resume');
    const filename = sessionStorage.getItem('filename');

    const requestOptions = {
        method: 'PUT',
        body: resume
      };

    const fetchURL = config.s3URL + filename;

    fetch(fetchURL, requestOptions)
    .then(res => res.text())
    .then(result => result)
    .catch(error => console.log('error', error));

    const s3URL = 'https://cv-booster-resume-uploads-v2.s3.us-east-2.amazonaws.com/' + filename;
    postOAI(url,s3URL);

    event.preventDefault();
};

// call first function when page loads
document.addEventListener('DOMContentLoaded', putS3);