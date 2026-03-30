<?php

header('Content-Type: application/json');
require_once 'db.php';

$db = dbConnect();

$productId = $_GET['id'] ?? null;

if (!$productId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing productId"]);
    exit();
}

$sql = "
SELECT userLogin, rating, comment, created_at
FROM reviews
WHERE productId = :id
ORDER BY created_at DESC
";

$stmt = $db->prepare($sql);
$stmt->bindParam(':id', $productId);
$stmt->execute();

$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reviews);


?>