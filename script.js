const openAIHeaders = {'Authorization':config.openAIKey,'Content-Type':'application/json'};

function advance(response) {

    alert(response)

    document.getElementById("hidden").innerHTML = response;
    document.getElementById("hidden").addEventListener("change", sessionStorage.setItem('data', response));
    window.location.href = "./resultsPage.html";
};

// function to send prompt to Open AI
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

    advance(text)

    return text;
};

// function to upload resume to s3
async function putS3(event) {

    const url = document.getElementById("jobURL").value;
    const resume = document.getElementById("resume").files[0];
    const filename = resume.name.replaceAll(' ','_');

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


const form = document.getElementById("submission");
form.addEventListener("submit", putS3);










/*
async function logSubmit(event) {
    const url = document.getElementById("jobURL").value;
    const resume = document.getElementById("resume").files[0];
    const filename = resume.name.replaceAll(' ','_');


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

    const payload = {
        "model": "text-davinci-003",
        "prompt": `Step 1: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from this job posting: ${url}. Step 2: Use this resume: ${s3URL} to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section to be relevant to the included job posting. Step 3: Return both lists in HTML format using <ul>. Step 4: Use <h3> tags for the list titles.`,
        "max_tokens": 3700,
        "temperature": 0.7
    };

    fetch('https://api.openai.com/v1/completions', {method: 'POST',body: JSON.stringify(payload),headers: openAIHeaders})
    .then(response => console.log(response.json()))
    .then(result => result)
    .catch(error => console.log('error', error));

    //const htmlResp = openaiJSON.choices[0].text.replace(/\n/g,'');

    //document.getElementById("hidden").innerHTML = htmlResp;

    event.preventDefault();
};
  
const form = document.getElementById("submission");
form.addEventListener("submit", logSubmit);


<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script type="text/javascript">
        //Bucket Configurations
        var bucketName = 'cv-booster-resume-uploads';
        var bucketRegion = 'us-east-2';
        var IdentityPoolId = 'us-east-2:c827316c-7d41-486f-ad35-2d37f986520d';

        AWS.config.update({
                        region: bucketRegion,
                        credentials: new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: IdentityPoolId
                        })
                    });

                    var s3 = new AWS.S3({
                        apiVersion: '2006-03-01',
                        params: {Bucket: bucketName}
                });
    </script>

        <script type="text/javascript">
        function s3upload() {
            var files = document.getElementById("resume").files;
            if (files) {
                var file = files[0];
                var fileName = file.name;
                var filePath = 'path/' + fileName.replace(' ','_');
                var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/bucket/' +  filePath;
                s3.upload({
                    Key: filePath,
                    Body: file,
                    ACL: 'public-read'
                    }, 
                    function(err, data) {
                        if(err) {
                            reject('error');
                        }
                    //alert('Successfully Uploaded!');
                    alert(fileUrl);
                    }).on('httpUploadProgress', function (progress) {
                    var uploaded = parseInt((progress.loaded * 100) / progress.total);
                    $("progress").attr('value', uploaded);
                });
            }
        };
    </script>

//Bucket Configurations
 var bucketName = 'cv-booster-resume-uploads';
 var bucketRegion = 'us-east-2';
 var IdentityPoolId = 'us-east-2:c827316c-7d41-486f-ad35-2d37f986520d';

 AWS.config.update({
                 region: bucketRegion,
                 credentials: new AWS.CognitoIdentityCredentials({
                     IdentityPoolId: IdentityPoolId
                 })
             });

             var s3 = new AWS.S3({
                 apiVersion: '2006-03-01',
                 params: {Bucket: bucketName}
         });

function s3upload() {
    var files = document.getElementById("resume").files;
    if (files) 
    {
      var file = files[0];
      var fileName = file.name;
      var filePath = 'path/' + fileName.replace(' ','_');
      var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/bucket/' +  filePath;
      alert(fileUrl)
      s3.upload({
        Key: filePath,
         Body: file,
         ACL: 'public-read'
         }, function(err, data) {
         if(err) {
         reject('error');
         }
         //alert('Successfully Uploaded!');
         alert(fileUrl);
         }).on('httpUploadProgress', function (progress) {
         var uploaded = parseInt((progress.loaded * 100) / progress.total);
         $("progress").attr('value', uploaded);
       });
    }
 };

const fileioHeaders = {
    'accept': 'application/json',
    'Authorization': 'Bearer 7FXSG7C.50PTY95-RWE478D-GG1T6C0-3GNDZE2'
}

function logSubmit(event) {
    const url = document.getElementById("jobURL").value;
    const resume = document.getElementById("resume").files[0];

    const formData = new FormData();
    formData.append('user-file',resume);

    console.log(formData)

    fetch('https://www.filestackapi.com/api/store/S3?key=Awtmke8j2SW2y2FshGYiCz', {

        method: 'POST',
        body: JSON.stringify(formData)

    })
    .then(res => console.log(res.json()))
    .then(data => console.log(data))
    .then(err => console.log(err))

    event.preventDefault();
  }
  
const form = document.getElementById("submission");
//form.addEventListener("submit", logSubmit);




"use strict";
document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector('inputForm').addEventListener("submit", test);
}

function test() {
    console.log(document.getElementById("resume").files[0]);
}

"use strict";
document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("inputForm").addEventListener("submit", test);
}

function test() {
    const url = document.getElementById("jobURL").value;
    const resume = document.getElementById("resume").files[0];

    console.log(url)
    console.log(resume)
    
    const formData = new FormData();
    formData.append('user-file',resume);
    formData.append('url',url);

    console.log(formData)

    const payload = {
        "model": "text-davinci-003",
        "prompt": "Step 1: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from this job posting: https://www.linkedin.com/jobs/view/3638865516/?refId=44043183-1975-4e4f-aa09-9cb143b34ade&trackingId=8Mk7jN0hTsWCusWaKHcnOg%3D%3D. Step 2: Use this resume: https://drive.google.com/file/d/1nPj0mWpE7e5xZEE8IMNmDbNYfLpjaknd/view?usp=sharing to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section to be relevant to the included job posting. Step 3: Return both lists in HTML format using <ul>. Step 4: Use <h3> tags for the list titles.",
        "max_tokens": 3800,
        "temperature": 0.7
    };

    fetch('https://api.openai.com/v1/completions', {

        method: 'POST',
        body: formData,
        headers: openAIHeaders

    })
    .then(res => console.log(res.json()))
    .then(data => console.log(data))
    .then(err => console.log(err))
}

/*document.getElementById('inputForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const url = document.getElementById('jobURL').value;
    const resume = document.getElementById('resume').files[0];

    console.log(resume)
    
    const formData = new FormData();
    formData.append('user-file',resume);
    formData.append('url',url);

    console.log(formData)

    const payload = {
        "model": "text-davinci-003",
        "prompt": "Step 1: Return a list titled 'Important Job Posting Buzzwords' of 7 crucial buzzwords from this job posting: https://www.linkedin.com/jobs/view/3638865516/?refId=44043183-1975-4e4f-aa09-9cb143b34ade&trackingId=8Mk7jN0hTsWCusWaKHcnOg%3D%3D. Step 2: Use this resume: https://drive.google.com/file/d/1nPj0mWpE7e5xZEE8IMNmDbNYfLpjaknd/view?usp=sharing to create a second list titled: 'Job Experience Section Suggestions' of 4-7 suggestions of how to word the job experience section to be relevant to the included job posting. Step 3: Return both lists in HTML format using <ul>. Step 4: Use <h3> tags for the list titles.",
        "max_tokens": 3800,
        "temperature": 0.7
    };

    fetch('https://api.openai.com/v1/completions', {

        method: 'POST',
        body: formData,
        headers: openAIHeaders

    })
    .then(res => res.json())
    .then(data => console.log(data))
    .then(err => console.log(err))
})*/

/*const getOpenAI = async () => {

    const openAIRes = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: openAIHeaders
        });
    let openAIJSON = await openAIRes.json();
    console.log(openAIJSON)

    return openAIJSON;
};

window.onload = async function() {

    

    openAIJSONResp = await getOpenAI();

    htmlResp = openAIJSONResp.choices[0].text.replace(/\n/g,'');;

    console.log(htmlResp)
    document.getElementById("resp").innerHTML = htmlResp;
};*/