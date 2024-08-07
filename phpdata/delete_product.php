<?php
include '../phpdata/headers.php';
require_once '../phpdata/connection.php';

$barcode = $_POST['barcode'] ?? '';

// Log the input to barcode.log
$logData = "Received barcode: " . $barcode . "\n";
file_put_contents('barcode.log', $logData, FILE_APPEND);

if ($barcode == '') {
    echo json_encode(['status' => 'error', 'message' => 'Barcode is required']);
    exit;
}

try {
    $query = "DELETE FROM products WHERE barcode = :barcode";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':barcode', $barcode, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete product']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>