<?php
$url = "http://127.0.0.1:5000/predict";

$data = [
    "fitur1" => 100,   
    "fitur2" => 50
];

$options = [
    "http" => [
        "header"  => "Content-Type: application/json\r\n",
        "method"  => "POST",
        "content" => json_encode($data)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    die("Error saat menghubungi server Flask");
}

$result = json_decode($response, true);

if (isset($result['prediksi'])) {
    echo "Prediksi Laba/Rugi: " . $result['prediksi'];
} else {
    echo "Terjadi kesalahan: " . $result['error'];
}
