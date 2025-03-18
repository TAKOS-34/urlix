export const putExamples = {
bash: `# Bash | Curl

curl -X POST https://urlix.me/api/update/40034 \\
    -H "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1" \\
    -H "Content-Type: application/json" \\
    -d '{
    "redirectUrl": "https://example.com/new-path",
    "urlName": "Updated Name",
    "expirationDate": "2060-01-01 00:00:00",
    "password": "newSecure@123"
    }'`,

python: `# Python | Requests

import requests

headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
}

data = {
    "redirectUrl": "https://example.com/new-path",
    "urlName": "Updated Name",
    "expirationDate": "2060-01-01 00:00:00",
    "password": "newSecure@123"
}

response = requests.post("https://urlix.me/api/update/40034", headers=headers, json=data)
print(response.json())`,

javascript: `// JavaScript | Axios

const axios = require('axios');

const headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
};

const data = {
    redirectUrl: "https://example.com/new-path",
    urlName: "Updated Name",
    expirationDate: "2060-01-01 00:00:00",
    password: "newSecure@123"
};

axios.post('https://urlix.me/api/update/40034', data, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));`,

java: `// Java | java.net

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

String jsonData = "{"
    + "\\"redirectUrl\\": \\"https://example.com/new-path\\","
    + "\\"urlName\\": \\"Updated Name\\","
    + "\\"expirationDate\\": \\"2060-01-01 00:00:00\\","
    + "\\"password\\": \\"newSecure@123\\""
    + "}";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://urlix.me/api/update/40034"))
    .header("x-api-key", "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(jsonData))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

php: `// PHP | Curl

<?php
$curl = curl_init();

$data = array(
    "redirectUrl" => "https://example.com/new-path",
    "urlName" => "Updated Name",
    "expirationDate" => "2060-01-01 00:00:00",
    "password" => "newSecure@123"
);

curl_setopt_array($curl, [
    CURLOPT_URL => "https://urlix.me/api/update/40034",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($data),
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