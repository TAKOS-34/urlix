export const getByValueExamples = {
bash: `# Bash | Curl

curl -X GET "https://urlix.me/api/get/url?value=https://urlix.me/EB0jp" \\
    -H "x-api-key: 7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1" \\
    -H "Content-Type: application/json"`,

python: `# Python | Requests

import requests

headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
}

url_value = "https://urlix.me/EB0jp"
response = requests.get(f"https://urlix.me/api/get/url?value={url_value}", headers=headers)

print(response.json())`,

javascript: `// Javascript | Axios

const axios = require('axios');

const headers = {
    "x-api-key": "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1",
    "Content-Type": "application/json"
};

const urlValue = encodeURIComponent("https://urlix.me/EB0jp");

axios.get(\`https://urlix.me/api/get/url?value=\${urlValue}\`, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));`,

java: `// Java | java.net

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

String urlValue = URLEncoder.encode("https://urlix.me/EB0jp", StandardCharsets.UTF_8);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://urlix.me/api/get/url?value=" + urlValue))
    .header("x-api-key", "7mptzh2yf3cSIo7nXH9vtP5Q9Y6Ue3fEzziCPPNwwlSvLQfK7wsvkZ13hFHPOvh1")
    .header("Content-Type", "application/json")
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

php: `// PHP | Curl

<?php
$urlValue = urlencode("https://urlix.me/EB0jp");
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://urlix.me/api/get/url?value=" . $urlValue,
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