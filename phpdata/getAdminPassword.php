<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../phpdata/connection.php';

try {
    // Query to get the password for role 0 (admin)
    $stmt = $pdo->prepare("SELECT password FROM users WHERE role = 0 LIMIT 1");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        echo json_encode(['password' => $admin['password']]);
    } else {
        echo json_encode(['error' => 'Admin not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}