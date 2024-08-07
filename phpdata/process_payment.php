<?php
require_once '../phpdata/connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Function to log data to a file with structured formatting
function logToFile($message, $type = 'INFO') {
    $logFile = 'logs.log';
    $currentDateTime = date('Y-m-d H:i:s');
    $logMessage = "[$currentDateTime] [$type] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit early for preflight requests
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Read input JSON
        $data = json_decode(file_get_contents('php://input'), true);

        // Log the received data
        // logToFile("Received data: " . json_encode($data), 'INFO');

        // Extracting data
        $cashier = $data['cashier'];
        $items = $data['items'];
        $total = $data['total'];
        $cashTendered = $data['cashTendered'];
        $change = $data['change'];
        $date = $data['date'];
        $shiftNumber = $data['shiftNumber'];

        $pdo->beginTransaction();

        // Insert into sales table
        $stmt = $pdo->prepare("INSERT INTO sales (sales_userId, sales_cashTendered, sales_change, sales_totalAmount, sales_date) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$shiftNumber, $cashTendered, $change, $total, $date]);
        $salesId = $pdo->lastInsertId();

        // Log the SQL operation
        // logToFile("Inserted sales record with ID: $salesId", 'INFO');

        // Insert each item into sales_item table
        $stmt = $pdo->prepare("INSERT INTO sales_item (sales_item_salesId, sales_item_prodId, sales_item_qty, sales_item_prc) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $stmt->execute([
                $salesId,
                $item['barcode'],
                $item['quantity'],
                $item['prod_price'] // Use 'prod_price' instead of 'price'
            ]);

            // logToFile("Inserted sales_item: " . json_encode($item), 'INFO');
        }

        $pdo->commit();

        // Log the successful transaction
        // logToFile("Transaction committed successfully for sales ID: $salesId", 'INFO');

        echo json_encode(['status' => 'success', 'message' => 'Payment processed successfully.']);
    } catch (Exception $e) {
        $pdo->rollBack();
        // logToFile("Error processing payment: " . $e->getMessage(), 'ERROR');
        echo json_encode(['status' => 'error', 'message' => 'Error processing payment: ' . $e->getMessage()]);
    }
} else {
    // logToFile("Invalid request method: " . $_SERVER['REQUEST_METHOD'], 'ERROR');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}