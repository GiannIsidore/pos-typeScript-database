<?php
include '../phpdata/headers.php';
require_once '../phpdata/connection.php';

try {
    // Get the input data
    $input = json_decode(file_get_contents('php://input'), true);
    $barcode = $input['barcode'] ?? '';
    $prod_name = $input['prod_name'] ?? '';
    $prod_price = $input['prod_price'] ?? '';

    if (empty($barcode) || empty($prod_name) || empty($prod_price)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    // Check if product with the same barcode already exists
    $stmt = $pdo->prepare("SELECT * FROM products WHERE barcode = :barcode");
    $stmt->execute([':barcode' => $barcode]);
    $existingProduct = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingProduct) {
        echo json_encode(['status' => 'error', 'message' => 'Product with this barcode already exists.']);
    } else {
        // Prepare and execute SQL query to insert new product
        $stmt = $pdo->prepare("INSERT INTO products (barcode, prod_name, prod_price) VALUES (:barcode, :prod_name, :prod_price)");
        $stmt->execute([
            ':barcode' => $barcode,
            ':prod_name' => $prod_name,
            ':prod_price' => $prod_price,
        ]);

        // Return success message
        echo json_encode(['status' => 'success', 'message' => 'Product added successfully.']);
    }
} catch (PDOException $e) {
    // Return error message as JSON if query fails
    echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $e->getMessage()]);
}
?>