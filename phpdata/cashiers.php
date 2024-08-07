<?php
// Include the database connection file
require_once '../phpdata/connection.php'; // Adjust the path as necessary

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins. For security, specify your allowed domains
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Allow specific methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow specific headers

// Check if the connection was successful
if (!$pdo) {
    echo json_encode(['error' => 'Database connection error.']);
    exit;
}

try {
    // Example query logic: Fetch all cashiers
    $stmt = $pdo->query('SELECT * FROM cashiers');
    $cashiers = $stmt->fetchAll();

    // Output the cashiers data as JSON
    echo json_encode($cashiers);

} catch (PDOException $e) {
    // Handle query error
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    exit;
}

// Close the connection (optional, PDO automatically closes at script end)
$pdo = null;
?>