// openai creds
const openAIHeaders = {'Authorization':config.openAIKey,'Content-Type':'application/json'};

// function to update storage
function setStorage(resp,url) {
    sessionStorage.setItem('data', resp)
    sessionStorage.setItem('url', url)
}

// pass response from open ai to results page and redirect
function advance(response,url) {

    document.getElementById("hidden").addEventListener("change", setStorage(response,url));
    window.location.href = "./resultsPage.html";
};

// update the hidden text field with open ai response and call advance function
function updateHidden(response,url) {

    document.getElementById("hidden").innerHTML = response;
    document.getElementById("hidden").addEventListener("change", advance(response,url));

};

// function to send prompt to Open AI and call updateHidden function
async function postOAI(post,resumeurl,temp) {

    const prompt = `Step 1: Analyze this job posting: ${post}. Step 2: Return the job title from the provided job posting at the top inside <h2> tags. Step 3: Return the company name from the provided job posting below the job title inside <h3> tags. Step 4: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from the job posting. Step 5: Use this resume: ${resumeurl} to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section in the provided resume to be more relevant to the provided job posting in Step 1. Step 6: Return both lists in HTML format using <ul>. Step 7: Make the two list titles bold.`;
    const prompt2 = `Your final output from this prompt will be in HTML format. Let's take this step by step. Step 1: Analyze this job posting: ${post}. Step 2: Return the job title from the provided job posting at the top inside <h2> tags. Step 3: Return the company name from the provided job posting right below the job title inside <h3> tags. Step 4: You are going to return 2 lists using <ul> and <li> tags, each list should have a title above it in bolded text using either <strong> or <b> tags. Step 5: The first list should be titled 'Important Job Posting Buzzwords' and should contain minimum 5 and maximum 7 crucial buzzwords from the job posting that would catch the eye of the hiring manager for this position. Step 5: The second list should be titled 'Resume Ideas'. Step 6: Analyze this resume: ${resumeurl} Step 7: The second list will be a list of suggestions. There should be a 1 sentence long suggestion for each job experience listed in the resume based on the job title of each listed job experience. Each suggestion you make should be a sentence that the user can use in their own resume to describe each of their job experiences based on the content of the job posting from step 1. The goal with each suggestion you provide is to catch the eye of the hiring manager for the provided job posting in step 1. Step 8: Review your response to ensure there is nothing else included in your response outside of what is outlined here in this prompt.`

    const payload = {
        "model": "text-davinci-003",
        "prompt": prompt2,
        "max_tokens": 2200,
        "temperature": temp
    };

    const res = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: openAIHeaders
    })

    const oaiJSON = await res.json();
    const text = oaiJSON.choices[0].text.replaceAll(/\n/g,'');

    updateHidden(text,resumeurl)

    return text;
};

// function to upload resume to s3 and call open ai function
async function putS3(event) {

    const posting = sessionStorage.getItem('posting');
    const resume = sessionStorage.getItem('resume');
    const filename = sessionStorage.getItem('filename');
    const output = sessionStorage.getItem('output');

    const requestOptions = {
        method: 'PUT',
        body: resume
      };

    const fetchURL = config.s3URL + filename;

    fetch(fetchURL, requestOptions)
    .then(res => res.text())
    .then(result => result)
    .catch(error => console.log('error', error));

    // define file url from S3
    const s3URL = 'https://cv-booster-resume-uploads-v2.s3.us-east-2.amazonaws.com/' + filename;

    // call function
    postOAI(posting,s3URL,parseFloat(output.innerHTML));

    event.preventDefault();
};

// call first function when page loads
document.addEventListener('DOMContentLoaded', putS3);