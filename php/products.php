<?php

header('Content-Type: application/json');
require_once 'db.php';

$db = dbConnect();

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
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);



?>