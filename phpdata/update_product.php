<?php
include '../phpdata/headers.php';
require_once '../phpdata/connection.php';

$barcode = $_POST['barcode'] ?? '';
$prod_name = $_POST['prod_name'] ?? '';
$prod_price = $_POST['prod_price'] ?? '';

if ($barcode == '' || $prod_name == '' || $prod_price == '') {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

$query = "UPDATE products SET prod_name = ?, prod_price = ? WHERE barcode = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sds", $prod_name, $prod_price, $barcode);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update product']);
}

$stmt->close();
$conn->close();

?>