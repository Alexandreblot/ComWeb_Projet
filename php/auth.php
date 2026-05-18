<?php

header('Content-Type: application/json');
require_once 'db.php';


function getBearerToken() {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        return null;
    }

    if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        return $matches[1];
    }

    return null;
}


function checkToken($requiredRole = null) {
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Missing token"]);
        exit();
    }

    $db = dbConnect();

    $stmt = $db->prepare("
        SELECT login, role
        FROM users
        WHERE token = :token
    ");
    $stmt->execute([
        ':token' => $token
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token"]);
        exit();
    }

    if ($requiredRole && $user['role'] !== $requiredRole) {
        http_response_code(401);
        echo json_encode(["error" => "Insufficient role"]);
        exit();
    }

    return $user;
}

?>