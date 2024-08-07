<?php
// Include the database connection
require_once '../phpdata/connection.php'; // Adjust the path to your connection.php file

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Start the session
session_start();

// Define the log file path
$logFilePath = '../phpdata/usersPassedFromFrntEnd.log'; // Adjust the path as necessary

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the POST data
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    // Log the input data
    file_put_contents($logFilePath, json_encode($input) . PHP_EOL, FILE_APPEND);

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Username and password are required.']);
        exit;
    }

    try {
        // Prepare the SQL statement to fetch the user by username
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Check if the provided password matches the one in the database
            if ($password === $user['password']) {
                // Password matches, authentication successful
                // Store user details in session
                $_SESSION['userId'] = $user['userId'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['fullname'] = $user['fName'] . ' ' . $user['lName'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['shift'] = $user['shift'];

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Authentication successful.',
                    'username' => $user['username'],
                    'fullname' => $_SESSION['fullname'],
                    'shift' => $user['shift'],
                    'role' => $user['role'],
                    'id' => $user['userId']
                ]);
            } else {
                // Password does not match
                echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
            }
        } else {
            // No user found
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        }
    } catch (PDOException $e) {
        // Handle query error
        echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $e->getMessage()]);
    }
} else {
    // Invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>