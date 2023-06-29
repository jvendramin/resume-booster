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
async function postOAI(post,resumeurl) {

    const prompt = `Step 1: Analyze this job posting: ${post}. Step 2: Return the job title from the provided job posting at the top inside <h2> tags. Step 3: Return the company name from the provided job posting below the job title inside <h3> tags. Step 4: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from the job posting. Step 5: Use this resume: ${resumeurl} to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section in the provided resume to be more relevant to the provided job posting in Step 1. Step 6: Return both lists in HTML format using <ul>. Step 7: Make the two list titles bold.`;

    const payload = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 2400,
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

    const posting = sessionStorage.getItem('posting');
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
    postOAI(posting,s3URL);

    event.preventDefault();
};

// call first function when page loads
document.addEventListener('DOMContentLoaded', putS3);