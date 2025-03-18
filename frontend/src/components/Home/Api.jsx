import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../../styles/Home/Api.css';
import { postExamples } from './Api/postExamples';
import { getAllExamples } from './Api/getAllExamples';
import { getByIdExamples } from './Api/getByIdExamples';
import { getByValueExamples } from './Api/getByValueExample';
import { putExamples } from './Api/putExamples';
import { deleteExamples } from './Api/deleteExamples';

function Api() {
    const [selectedPostLanguage, setSelectedPostLanguage] = useState('bash');
    const [selectedGetAllLanguage, setSelectedGetAllLanguage] = useState('bash');
    const [selectedGetByIdLanguage, setSelectedGetByIdLanguage] = useState('bash');
    const [selectedGetByValueLanguage, setSelectedGetByValueLanguage] = useState('bash');
    const [selectedPutLanguage, setSelectedPutLanguage] = useState('bash');
    const [selectedDeleteLanguage, setSelectedDeleteLanguage] = useState('bash');
    const languageOptions = [
        { value: 'bash', label: 'Bash' },
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'java', label: 'Java' },
        { value: 'php', label: 'PHP' }
    ];
    document.title = 'URLIX | API Documentation';

    return (
        <div className="container-api">
            <div className="container-api-content">

                <div className="api-title">API Documentation</div>

                <div className="introduction">
                    This website provides a <strong>free RESTful API</strong> for everyone. The protocol used is <strong>HTTPS </strong>and responses format is <strong>JSON</strong>. After creating an account and generating an <strong>API key</strong>, you will be able to <strong>create, view, modify, or delete </strong>URLs that belong to you. Below, sorted by type, you will find the <strong>rules</strong> for using the API, the <strong>responses</strong> you will receive, and <strong>code examples </strong>to help you use them.
                </div>

                <div className="api-nav">
                    <div className="api-nav-title">API Endpoints</div>
                    <ul className="api-nav-list">
                        <li><a href="#auth">Authorization with API key</a></li>
                        <li><a href="#post">Create URLs | POST</a></li>
                        <li><a href="#get-all">Get data about all URLs | GET</a></li>
                        <li><a href="#get-by-id">Get data about single URL with its ID | GET</a></li>
                        <li><a href="#get-by-value">Get data about single URL with its value | GET</a></li>
                        <li><a href="#put">Update your URLs | PUT</a></li>
                        <li><a href="#delete">Delete your URLs | DELETE</a></li>
                    </ul>
                </div>

                <div className="container-endpoints" id="auth">

                    <div className="endpoints-title">Authorization with API key</div>
                    <div className="endpoints-descriptor">To use the API, you'll need to send your API key in a custom header named "x-api-key" in your request. The first example below illustrates authorization-related errors, while the following examples demonstrate how to include the API key in different programming languages</div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Authorization responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success : You can use API

// ❌ Error : If you didn't include an API key in the headers | Return code 400
{
    "status": false,
    "message": "API Key missing"
}

// ❌ Error : If you have a invalid API key | Return code 401
{
    "status": false,
    "message": "Invalid API Key"
}`}
                        </SyntaxHighlighter>
                    </div>

                </div>

                <div className="container-endpoints" id="post">

                    <div className="endpoints-title">Create URLs | POST</div>
                    <div className="endpoints-descriptor">This route is used to create an URL. With a valid API key in headers, you can call this endpoint with multiple options in the body. When your url is created, the API will answer to you with the link of your new URL</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/create`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-rules">
                        <div className="endpoints-subtitle">Endpoint rules :</div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`# Options to provide in the body

redirectUrl: "https://google.fr/search?q=something" # * This option is required, others are optional
personalizedUrl: "google-request"
urlName: "Google"
expirationDate: "2050-01-01 00:00:00"
password: "sercure@123"
`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 201
{
    "status": true,
    "data": {
        "url": "https://urlix.me/sStF2n",
        "urlName": "Best game of all time", // Returns the value if set, otherwise null
        "expirationDate": null, // Returns the value if set, otherwise null
        "creationDate": "2050-01-01T00:00:00.000Z"
    }
}

// ❌ Error : If url redirection is missing or does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid redirect URL"
}

// ❌ Error : If the name of the URL is set and does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL name"
}

// ❌ Error : If a personalized URL is set and does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid personalized URL"
}

// ❌ Error : Other types of errors | Return code 500
{
    "status": false,
    "message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedPostLanguage}
                            onChange={(e) => { setSelectedPostLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedPostLanguage} style={dracula} className="code-snippet">
                            {postExamples[selectedPostLanguage]}
                        </SyntaxHighlighter>
                    </div>

                </div>

                <div className="container-endpoints" id="get-all">
                    <div className="endpoints-title">Get data about all URLs | GET</div>
                    <div className="endpoints-descriptor">This route is used to get information about all your URLs. With a valid API key in headers, you can call this endpoint and the API will answer to you with all of your URLs data</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/get/all`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 200
{
    "status": true,
    "data": [{
            "id": 40034,
            "url": "https://urlix.me/google-request",
            "redirectUrl": "https://google.fr/search?q=something",
            "urlName": null, // Returns the value if set, otherwise null
            "expirationDate": null, // Returns the value if set, otherwise null
            "creationDate": "2050-01-01T00:00:00.000Z",
            "redirectionCount": 8230
        },
        {
            "id": 73213,
            "url": "https://urlix.me/sStF2n",
            "redirectUrl": "https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice__GOTY_Edition/",
            "urlName": "Best game of all time",
            "expirationDate": null,
            "creationDate": "2050-01-01T00:00:00.000Z",
            "redirectionCount": 123044
        }
    ]
}

// ❌ Error : Other types of errors | Return code 500
{
    "status": false,
    "message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedGetAllLanguage}
                            onChange={(e) => { setSelectedGetAllLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedGetAllLanguage} style={dracula} className="code-snippet">
                            {getAllExamples[selectedGetAllLanguage]}
                        </SyntaxHighlighter>
                    </div>
                </div>

                <div className="container-endpoints" id="get-by-id">
                    <div className="endpoints-title">Get data about single URL with its ID | GET</div>
                    <div className="endpoints-descriptor">This route is used to get information of one of your URL with its ID. With a valid API key in headers and URL ID in the URL request you can call this endpoint and the API will answer to you with your URL data</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/get/id/{urlId}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-rules">
                        <div className="endpoints-subtitle">Endpoint rules :</div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`# You need to put the ID of your URL in the URL request as shown as below

https://urlix.me/api/get/id/40034 # 40034 is the URL ID here
`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 200
{
    "status": true,
    "data": {
        "id": 40034,
        "url": "https://urlix.me/google-request",
        "redirectUrl": "https://google.fr/search?q=something",
        "urlName": "Google",
        "expirationDate": "2050-01-01T00:00:00.000Z",
        "creationDate": "2050-01-01T00:00:00.000Z",
        "totalRedirections": 326421
    }
}

// ❌ Error : If URL ID is missing | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL ID"
}

// ❌ Error : If the url does not exists or belong to you | Return code 403
{
    "status": false,
    "message": "This URL does not exist or does not belong to you"
}

// ❌ Error : Other types of errors | Return code 500
{
    "status": false,
    "message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedGetByIdLanguage}
                            onChange={(e) => { setSelectedGetByIdLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedGetByIdLanguage} style={dracula} className="code-snippet">
                            {getByIdExamples[selectedGetByIdLanguage]}
                        </SyntaxHighlighter>
                    </div>
                </div>

                <div className="container-endpoints" id="get-by-value">
                    <div className="endpoints-title">Get data about single URL with its value | GET</div>
                    <div className="endpoints-descriptor">This route is used to get information of one of your URL with its value. With a valid API key in headers and URL value in the URL request you can call this endpoint and the API will answer to you with your URL data</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/get/url?value={urlValue}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-rules">
                        <div className="endpoints-subtitle">Endpoint rules :</div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`# You need to put the value of your URL in the URL request as shown as below

https://urlix.me/api/get/url?value=https://urlix.me/google-request # "https://urlix.me/google-request" is the value here
`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 200
{
    "status": true,
    "data": {
        "id": 40034,
        "url": "https://urlix.me/google-request",
        "redirectUrl": "https://google.fr/search?q=something",
        "urlName": "Google",
        "expirationDate": "2050-01-01T00:00:00.000Z",
        "creationDate": "2050-01-01T00:00:00.000Z",
        "totalRedirections": 326421
    }
}

// ❌ Error : If URL value is missing or does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL value"
}

// ❌ Error : If the URL does not exists or belong to you | Return code 403
{
    "status": false,
    "message": "This URL does not exist or does not belong to you"
}

// ❌ Error : Other types of errors | Return code 500
{
    "status": false,
    "message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedGetByValueLanguage}
                            onChange={(e) => { setSelectedGetByValueLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedGetByValueLanguage} style={dracula} className="code-snippet">
                            {getByValueExamples[selectedGetByValueLanguage]}
                        </SyntaxHighlighter>
                    </div>
                </div>

                <div className="container-endpoints" id="put">
                    <div className="endpoints-title">Update your URLs | PUT</div>
                    <div className="endpoints-descriptor">This route is used to update information one of your URL with its ID. With a valid API key in headers and URL ID in the URL request you can call this endpoint and the API will answer you with a 201 status code if changes were made</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/update/{urlId}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-rules">
                        <div className="endpoints-subtitle">Endpoint rules :</div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`# You need to put the ID of your URL in the URL request as shown as below

https://urlix.me/api/update/40034 # 40034 is the URL ID here

# Options to provide in the body

redirectUrl: "https://google.fr/search?q=something"
personalizedUrl: "google-request"
urlName: "Google"
expirationDate: "2050-01-01 00:00:00"
password: "sercure@123"
`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 201
{
    "status": true
}

// ❌ Error : If URL ID is missing | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL ID"
}

// ❌ Error : If url redirection is missing or does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid redirect URL"
}

// ❌ Error : If the name of the URL is set and does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL name"
}

// ❌ Error : If a personalized URL is set and does not match pattern | Return code 400
{
    "status": false,
    "message": "Please provide a valid personalized URL"
}

// ❌ Error : If the body is empty | Return code 400
{
    "status": false,
    "message": "No data provided to update"
}

// ❌ Error : If no URL was updated | Return code 400
{
    "status": false,
    "message": "No changes were made"
}

// ❌ Error : Other types of errors | Return code 500
{
    "status": false,
    "message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedPutLanguage}
                            onChange={(e) => { setSelectedPutLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedPutLanguage} style={dracula} className="code-snippet">
                            {putExamples[selectedPutLanguage]}
                        </SyntaxHighlighter>
                    </div>
                </div>

                <div className="container-endpoints" id="delete">
                    <div className="endpoints-title">Delete your URLs | DELETE</div>
                    <div className="endpoints-descriptor">This route is used to delete one of your URL with its ID. With a valid API key in headers and URL ID in the URL request you can call this endpoint and the API will answer you with a 200 status code if the URL has been deleted</div>

                    <div className="endpoints-url">
                        <div className="endpoints-subtitle">Endpoint URL : </div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`https://urlix.me/api/delete/{urlId}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-rules">
                        <div className="endpoints-subtitle">Endpoint rules :</div>
                        <SyntaxHighlighter language="bash" style={dracula} className="code-snippet">
                            {`# You need to put the ID of your URL in the URL request as shown as below

https://urlix.me/api/delete/40034 # 40034 is the URL ID here
`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-responses">
                        <div className="endpoints-subtitle">Endpoint responses :</div>
                        <SyntaxHighlighter language="json" style={dracula} className="code-snippet">
                            {`// ✅ Success | Return code 200
{
    "status": true
}

// ❌ Error : If URL ID is missing | Return code 400
{
    "status": false,
    "message": "Please provide a valid URL ID"
}

// ❌ Error : If no URL was deleted | Return code 400
{
    "status": false,
    "message": "No changes were made"
}

// ❌ Error : Other types of errors | Return code 500
{
"status": false,
"message": "Internal server error"
}`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="endpoints-examples">
                        <div className="endpoints-subtitle">Endpoints code examples : </div>
                        <label htmlFor="language-selector" className="label-language-selector">
                            Select Language:
                        </label>
                        <select
                            id="language-selector"
                            className="langage-selector"
                            value={selectedDeleteLanguage}
                            onChange={(e) => { setSelectedDeleteLanguage(e.target.value); }}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <SyntaxHighlighter language={selectedDeleteLanguage} style={dracula} className="code-snippet">
                            {deleteExamples[selectedDeleteLanguage]}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Api;