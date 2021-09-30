<?php 
// Set a new session token from Assess
session_set_cookie_params(0, '/', '.teachstarter.com');
session_start();

$response = new stdClass();
$past 	  = time() - 3600;

$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_POST['token'])) {
	if (!empty($_POST['token'])) {
		// Set session so user also logged in on Teach Starter website
		$_SESSION['api-token'] = $_POST['token'];
		
		$response->message = 'session created';
		$response->data = $_SESSION;
	} else {
		// Empty token means logged out, so completely destroy the session

		//remove PHPSESSID from browser
		if (isset($_COOKIE[session_name()])) {
			setcookie(session_name(), '', $past, '/');
		}
		
		// Remove all WordPress related cookies
		foreach ($_COOKIE as $key => $value) {
		    if (substr( $key, 0, 10) === 'wordpress_') {
		        setcookie($key, '', 1, '/', '.teachstarter.com');
		    }
		}
		
		//clear session from globals
		unset($_SESSION['api-token']);
		//clear session from disk
		session_destroy();
		
		$response->message = 'session destroyed';
	}
	
}

echo json_encode($response);

