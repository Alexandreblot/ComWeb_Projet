<?php

header('Content-Type: application/json');
require_once 'db.php';

$db = dbConnect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ───────────────────────────── GET ─────────────────────────────
    case 'GET':
        $category = $_GET['category'] ?? null;

        $sql = "
        SELECT 
            p.*, 
            ROUND(AVG(r.rating), 2) AS average_rating
        FROM products p
        LEFT JOIN reviews r ON p.id = r.productId
        ";

        if ($category) {
            $sql .= " WHERE p.category = :category";
        }

        $sql .= " GROUP BY p.id";

        $stmt = $db->prepare($sql);

        if ($category) {
            $stmt->bindParam(':category', $category);
        }

        $stmt->execute();
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
            INSERT INTO products (name, description, price, category, stock)
            VALUES (:name, :description, :price, :category, :stock)
        ");

        $stmt->execute([
            ':name' => strip_tags($data['name']),
            ':description' => strip_tags($data['description']),
            ':price' => $data['price'],
            ':category' => $data['category'],
            ':stock' => $data['stock']
        ]);

        http_response_code(201);
        echo json_encode(["success" => true]);
        break;

    // ───────────────────────────── PUT ─────────────────────────────
    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing id"]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $db->prepare("
            UPDATE products
            SET name = :name,
                description = :description,
                price = :price,
                category = :category,
                stock = :stock
            WHERE id = :id
        ");

        $stmt->execute([
            ':name' => strip_tags($data['name']),
            ':description' => strip_tags($data['description']),
            ':price' => $data['price'],
            ':category' => $data['category'],
            ':stock' => $data['stock'],
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

        $stmt = $db->prepare("DELETE FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

?>