<?php

require 'vendor/autoload.php';

$app = new \Slim\App;
$pdo = new PDO("mysql:dbname=calc_db;host=127.0.0.1", "root", ""); //don't care about security right now

//======================Operations API========================================//

$app->post('/API/Add/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];

    insertEntry($operand1, "+", $operand2);

    echo $operand1 + $operand2;
});

$app->post('/API/Subtract/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];

    insertEntry($operand1, "-", $operand2);

    echo $operand1 - $operand2;
});

$app->post('/API/Multiply/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];

    insertEntry($operand1, "*", $operand2);

    echo $operand1 * $operand2;
});

$app->post('/API/Divide/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];

    insertEntry($operand1, "/", $operand2);

    echo $operand1 / $operand2;
});

//======================Other Utilities=========================================//

$app->post('/insert/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operator = $_POST["operator"];
    $operand2 = $_POST["operand2"];

    $statement = insertEntry($operand1, $operator, $operand2);

    return json_encode($statement);
});

$app->get('/API/History/', function() use ($app, $pdo) {
    $statement = $pdo->prepare('SELECT * FROM historytable');
    $statement->execute();
    $results = $statement -> fetchAll(PDO::FETCH_ASSOC);

    return json_encode($results);
});

$app->post('/API/Clear/', function() use ($app, $pdo){
    $statement = $pdo->prepare('TRUNCATE TABLE historytable');
    $statement->execute();

    return json_encode($statement);
});

$app->run();

//Inserts this entry into calc_db:historytable
function insertEntry($operand1, $operator, $operand2){
    global $pdo;
    $statement = $pdo->prepare('INSERT INTO historytable (operand1, operator, operand2) VALUES (?, ?, ?)');
    $statement->execute(array($operand1, $operator, $operand2));

    return $statement;
}
