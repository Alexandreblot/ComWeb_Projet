<?php

header('Content-Type: application/json');
require_once 'db.php';

$db = dbConnect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ───────────────────────────── GET ─────────────────────────────
    case 'GET':
        $productId = $_GET['id'] ?? null;

        if (!$productId) {
            http_response_code(400);
            echo json_encode(["error" => "Missing productId"]);
            exit();
        }

        $stmt = $db->prepare("
            SELECT userLogin, rating, comment, created_at
            FROM reviews
            WHERE productId = :id
            ORDER BY created_at DESC
        ");

        $stmt->execute([':id' => $productId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    // ───────────────────────────── POST ─────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $stmt = $db->prepare("
            INSERT INTO reviews (productId, userLogin, rating, comment)
            VALUES (:productId, :userLogin, :rating, :comment)
        ");

        $stmt->execute([
            ':productId' => $data['productId'],
            ':userLogin' => 'client1', // temporaire
            ':rating' => $data['rating'],
            ':comment' => strip_tags($data['comment'])
        ]);

        http_response_code(201);
        echo json_encode(["success" => true]);
        break;

    // ───────────────────────────── PUT ─────────────────────────────
    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$id || !$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request"]);
            exit();
        }

        $stmt = $db->prepare("
            UPDATE reviews
            SET rating = :rating,
                comment = :comment
            WHERE id = :id
        ");

        $stmt->execute([
            ':rating' => $data['rating'],
            ':comment' => strip_tags($data['comment']),
            ':id' => $id
        ]);

        echo json_encode(["success" => true]);
        break;

    // ───────────────────────────── DELETE ─────────────────────────────
    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing id"]);
            exit();
        }

        $stmt = $db->prepare("DELETE FROM reviews WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

?>