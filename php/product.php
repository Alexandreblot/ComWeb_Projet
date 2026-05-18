<?php

header('Content-Type: application/json');
require_once 'db.php';


$db = dbConnect();
$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing id"]);
    exit();
}
if (!is_numeric($id)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid id"]);
    exit();
}
$id = intval($id);

$sql = "
SELECT 
    p.*, 
    ROUND(AVG(r.rating), 2) AS average_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.productId
WHERE p.id = :id
GROUP BY p.id
";

$stmt = $db->prepare($sql);
$stmt->bindParam(':id', $id);
$stmt->execute();

$product = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$product) {
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit();
}

http_response_code(200);
echo json_encode($product);

?>