<?php

require_once 'constants.php';


function dbConnect() {
    try {
        $db = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8',
            DB_USER,
            DB_PASS
        );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        http_response_code(503);
        echo json_encode(["error" => "Database unavailable"]);
        exit();
    }
}

?>