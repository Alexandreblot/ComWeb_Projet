<?php

header('Content-Type: application/json');
require_once 'db.php';


$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit();
}

$login = $data['login'] ?? '';
$password = sha1($data['password'] ?? '');

$db = dbConnect();

$stmt = $db->prepare("
    SELECT login, role
    FROM users
    WHERE login = :login
    AND password = :password
");

$stmt->execute([
    ':login' => $login,
    ':password' => $password
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit();
}

$token = bin2hex(random_bytes(32));

$update = $db->prepare("
    UPDATE users
    SET token = :token
    WHERE login = :login
");

$update->execute([
    ':token' => $token,
    ':login' => $login
]);

echo json_encode([
    "token" => $token,
    "role" => $user['role']
]);

?>