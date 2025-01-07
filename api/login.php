<?php
header('Content-Type: application/json');
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "checurkt_cca_user_data"; 

try {
    // Create connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the submitted username and password
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->username) || empty($data->password)) {
        throw new Exception("Missing required fields");
    }

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $data->username);
    $stmt->execute();

    // Check if user exists
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data->password, $user['password'])) {
        // Store user data in session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['name'] = $user['name'];

        // Send success response
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "name" => $user['name']
            ]
        ]);
    } else {
        throw new Exception("Invalid username or password");
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>