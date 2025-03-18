export const getByIdExamples = {
bash: `# Bash | Curl

curl -X GET https://urlix.me/api/get/id/40034 \\
    -H "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1" \\
    -H "Content-Type: application/json"`,

python: `# Python | Requests

import requests

headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
}

url_id = 40034
response = requests.get(f"https://urlix.me/api/get/id/{url_id}", headers=headers)

print(response.json())`,

javascript: `// Javascript | Axios

const axios = require('axios');

const headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
};

const urlId = 40034;

axios.get(\`https://urlix.me/api/get/id/\${urlId}\`, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));`,

java: `// Java | java.net

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

int urlId = 40034;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://urlix.me/api/get/id/" + urlId))
    .header("x-api-key", "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1")
    .header("Content-Type", "application/json")
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

php: `// PHP | Curl

<?php
$urlId = 40034;
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://urlix.me/api/get/id/" . $urlId,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>`
};
