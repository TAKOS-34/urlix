export const deleteExamples = {
bash: `# Bash | Curl

curl -X DELETE https://urlix.me/api/delete/40034 \\
    -H "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1"`,

python: `# Python | Requests

import requests

headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1"
}

response = requests.delete("https://urlix.me/api/delete/40034", headers=headers)
print(response.json())`,

javascript: `// JavaScript | Axios

const axios = require('axios');

const headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1"
};

axios.delete('https://urlix.me/api/delete/40034', { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));`,

java: `// Java | java.net

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://urlix.me/api/delete/40034"))
    .header("x-api-key", "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1")
    .DELETE()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

php: `// PHP | Curl

<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://urlix.me/api/delete/40034",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "DELETE",
    CURLOPT_HTTPHEADER => [
        "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1"
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;
?>`
};