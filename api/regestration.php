<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "checurkt_cca_user_data";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (
        empty($data->user_name) ||
        empty($data->location) ||
        empty($data->phone) ||
        empty($data->grade)
    ) {
        throw new Exception("Missing required fields");
    }

    // Generate host token and iframe user ID
    $hostToken = 'https://checheafrica.com/iframe/host_users/account/?u=' . base64_encode('RVNLLTIt' . time());
    $iframeUserId = 'iframe_' . bin2hex(random_bytes(8)) . time();

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO host_users (user_name, location, phone, grade, host_token, iframe_user_id) 
    VALUES (:user_name, :location, :phone, :grade, :host_token, :iframe_user_id)");

    // Bind parameters
    $stmt->bindParam(":user_name", $data->user_name);
    $stmt->bindParam(":location", $data->location);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":grade", $data->grade);
    $stmt->bindParam(":host_token", $hostToken);
    $stmt->bindParam(":iframe_user_id", $iframeUserId);

    // Execute query
    $stmt->execute();

    // Send success response
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully",
        "data" => [
            "userID" => $conn->lastInsertId(),
            "host_token" => $hostToken,
            "iframe_user_id" => $iframeUserId
        ]
    ]);
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