<?php

require 'vendor/autoload.php';

$app = new \Slim\App;
$app->get('/hello/', function() use ($app) {
    $response = "Hello World!";

    return $response;
});
$app->run();
