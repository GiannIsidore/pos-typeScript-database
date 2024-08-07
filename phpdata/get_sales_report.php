<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../phpdata/connection.php';

// Start the session if necessary
session_start();



// Function to log data to a file with structured formatting
function logToFile($message) {
    global $logFilePath;
    $currentDateTime = date('Y-m-d H:i:s');
    $logMessage = "[$currentDateTime] $message\n";
    file_put_contents($logFilePath, $logMessage, FILE_APPEND);
}
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];
} else {
    // If userId is not found, return an error and log the event
  
    echo json_encode(['error' => 'User ID not provided']);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Prepare SQL to fetch sales data for the specific user
        $stmt = $pdo->prepare("
            SELECT sales.*, users.fName, users.lName, users.username 
            FROM sales
            INNER JOIN users ON sales.sales_userId = users.userId
            WHERE sales.sales_userId = :userId
            ORDER BY sales.sales_date DESC
        ");
        $stmt->execute(['userId' => $userId]);

        $salesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetching sales items
        foreach ($salesData as &$sale) {
            $saleId = $sale['sales_id'];
            $stmtItems = $pdo->prepare("
                SELECT sales_item.*, products.prod_name 
                FROM sales_item
                INNER JOIN products ON sales_item.sales_item_prodId = products.barcode
                WHERE sales_item.sales_item_salesId = :saleId
            ");
            $stmtItems->execute(['saleId' => $saleId]);
            $sale['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode(['status' => 'success', 'sales' => $salesData]);
    } catch (PDOException $e) {
        logToFile("Database query failed: " . $e->getMessage());
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
} else {
    logToFile("Invalid request method");
    echo json_encode(['error' => 'Invalid request method']);
}