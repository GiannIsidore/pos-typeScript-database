<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include the database connection
require_once '../phpdata/connection.php';

try {
    // Query to get total sales for each cashier for the current day
    $stmt = $pdo->prepare("
        SELECT 
            CONCAT(users.fName, ' ', users.lName) AS cashier_name, 
            SUM(sales.sales_totalAmount) AS total_sales,
            DATE(sales.sales_date) AS sales_date
        FROM sales
        INNER JOIN users ON sales.sales_userId = users.userId
        WHERE DATE(sales.sales_date) = CURDATE()
        GROUP BY sales.sales_userId, DATE(sales.sales_date)
    ");
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}
?>