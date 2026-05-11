<?php

header('Content-Type: application/json');
require_once 'db.php';
require_once 'auth.php';

$db = dbConnect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ───────────────────────────── GET ─────────────────────────────
    case 'GET':
        $productId = $_GET['id'] ?? null;
        if (!$productId || !is_numeric($productId)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid productId"]);
            exit();
        }
        $productId = intval($productId);

        $stmt = $db->prepare("
            SELECT userLogin, rating, comment, created_at
            FROM reviews
            WHERE productId = :id
            ORDER BY created_at DESC
        ");
        $stmt->execute([
            ':id' => $productId
        ]);

        http_response_code(200);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    // ───────────────────────────── POST ─────────────────────────────
    case 'POST':
        $user = checkToken();

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $stmt = $db->prepare("
            INSERT INTO reviews
            (productId, userLogin, rating, comment)
            VALUES
            (:productId, :userLogin, :rating, :comment)
        ");

        $stmt->execute([
            ':productId' => $data['productId'],
            ':userLogin' => $user['login'],
            ':rating' => $data['rating'],
            ':comment' => strip_tags($data['comment'])
        ]);

        http_response_code(201);
        echo json_encode(["success" => true]);
        break;

    // ───────────────────────────── PUT ─────────────────────────────
    case 'PUT':
        $user = checkToken();
        parse_str($_SERVER['QUERY_STRING'], $params);

        $id = $params['id'] ?? null;
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$id || !is_numeric($id) || !$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request"]);
            exit();
        }
        $id = intval($id);

        $stmt = $db->prepare("
            SELECT userLogin
            FROM reviews
            WHERE id = :id
        ");
        $stmt->execute([
            ':id' => $id
        ]);

        $review = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$review || $review['userLogin'] !== $user['login']) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
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

        http_response_code(200);
        echo json_encode(["success" => true]);
        break;

    // ───────────────────────────── DELETE ─────────────────────────────
    case 'DELETE':
        $user = checkToken();
        parse_str($_SERVER['QUERY_STRING'], $params);

        $id = $params['id'] ?? null;
        if (!$id || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid id"]);
            exit();
        }
        $id = intval($id);

        $stmt = $db->prepare("
            SELECT userLogin
            FROM reviews
            WHERE id = :id
        ");
        $stmt->execute([
            ':id' => $id
        ]);

        $review = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$review || $review['userLogin'] !== $user['login']) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        $stmt = $db->prepare("
            DELETE FROM reviews
            WHERE id = :id
        ");
        $stmt->execute([
            ':id' => $id
        ]);

        http_response_code(200);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

?>