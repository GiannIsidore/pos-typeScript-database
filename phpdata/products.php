<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include the database connection
require_once '../phpdata/connection.php';

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the barcode from the GET request parameters
    $barcode = $_GET['barcodes'] ?? '';

    if (empty($barcode)) {
        echo json_encode(['error' => 'No barcode provided']);
        exit;
    }

    try {
        // Prepare the SQL statement to fetch the product by barcode
        $stmt = $pdo->prepare("SELECT barcode, prod_name, prod_price FROM products WHERE barcode = :barcode");
        $stmt->bindParam(':barcode', $barcode);
        $stmt->execute();

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            // Return product data as JSON
            echo json_encode($product);
        } else {
            // Return an empty array if no product is found
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        // Handle database query errors
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
} else {
    // Return an error if the request method is not GET
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}