export const postExamples = {
bash: `# Bash | Curl

curl -X POST https://urlix.me/api/create \\
    -H "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1" \\
    -H "Content-Type: application/json" \\
    -d '{
    "redirectUrl": "https://google.fr/search?q=something",
    "personalizedUrl": "google-request",
    "urlName": "Google",
    "expirationDate": "2050-01-01 00:00:00",
    "password": "sercure@123"
    }'`,

python: `# Python | Requests

import requests
import json

headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
}

data = {
    "redirectUrl": "https://google.fr/search?q=something",
    "personalizedUrl": "google-request",
    "urlName": "Google",
    "expirationDate": "2050-01-01 00:00:00",
    "password": "sercure@123"
}

response = requests.post("https://urlix.me/api/create", headers=headers, json=data)`,

javascript: `// Javascript | Axios

const axios = require('axios');

const headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
};

const data = {
    redirectUrl: "https://google.fr/search?q=something",
    personalizedUrl: "google-request",
    urlName: "Google",
    expirationDate: "2050-01-01 00:00:00",
    password: "sercure@123"
};

axios.post('https://urlix.me/api/create', data, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));`,

java: `// Java | java.net

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.nio.charset.StandardCharsets;

String jsonData = "{"
    + \"redirectUrl\": \"https://google.fr/search?q=something\",
    + \"personalizedUrl\": \"google-request\",
    + \"urlName\": \"Google\",
    + \"expirationDate\": \"2050-01-01 00:00:00\",
    + \"password\": \"sercure@123\"
    + "}";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://urlix.me/api/create"))
    .header("x-api-key", "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(jsonData))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());`,

php: `// PHP | Curl

<?php
$curl = curl_init();

$data = array(
    "redirectUrl" => "https://google.fr/search?q=something",
    "personalizedUrl" => "google-request",
    "urlName" => "Google",
    "expirationDate" => "2050-01-01 00:00:00",
    "password" => "sercure@123"
);

curl_setopt_array($curl, [
    CURLOPT_URL => "https://urlix.me/api/create",
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
?>`
};