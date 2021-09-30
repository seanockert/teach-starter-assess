<?php 
// Check if a token is set and return it
session_start();

$response = new stdClass();
$response->message = $_SESSION['api-token'] ? 'token exists' : 'token not set';
$response->token = $_SESSION['api-token'];

echo json_encode($response);

