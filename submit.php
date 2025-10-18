<?php

$serverName = "ULLI_"; 
$connectionOptions = array(
    "Database" => "WADPROJECT", 
    "Uid" => "ULLI_",
    "PWD" => "ulli2023" 
);


$conn = sqlsrv_connect($serverName, $connectionOptions);


if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';

  
    if (!empty($name) && !empty($email)) {
      
        $sql = "INSERT INTO Users (Name, Email) VALUES (?, ?)";
        $params = array($name, $email);

    
        $stmt = sqlsrv_query($conn, $sql, $params);
        
        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        } else {
            echo "New record created successfully";
        }

       
        sqlsrv_free_stmt($stmt);
    } else {
        echo "Name and email are required.";
    }
}


sqlsrv_close($conn);
?>