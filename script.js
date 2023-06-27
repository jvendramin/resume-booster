const button = document.getElementById('post-btn');

const openAIKey = 'Bearer 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';
const openAIHeaders = {
    'Authorization':openAIKey,
    'Content-Type':'application/json'
};

const payload = {
    "model": "text-davinci-003",
    "prompt": "Step 1: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from this job posting: https://www.linkedin.com/jobs/view/3638865516/?refId=44043183-1975-4e4f-aa09-9cb143b34ade&trackingId=8Mk7jN0hTsWCusWaKHcnOg%3D%3D. Step 2: Use this resume: https://drive.google.com/file/d/1nPj0mWpE7e5xZEE8IMNmDbNYfLpjaknd/view?usp=sharing to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section to be relevant to the included job posting. Step 3: Return both lists in HTML format. Step 4: Use '<h3>' tags for the list titles. Step 5: Trim the '/n/n' at the beginning of your response, the very first item in your response should be '<h3>', exlcude new lines at the beginning of your response.",
    "max_tokens": 3800,
    "temperature": 0.7
};

const getOpenAI = async () => {

    const openAIRes = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: openAIHeaders
        });
    let openAIJSON = await openAIRes.json();

    return openAIJSON;
};

window.onload = async function() {
    openAIJSONResp = await getOpenAI();

    htmlResp = openAIJSONResp.choices[0].text;
    document.getElementById("resp").innerHTML = htmlResp;
    console.log(openAIJSONResp)
};

console.log(onload.getOpenAI)