<?php

require 'vendor/autoload.php';

$app = new \Slim\App;
$pdo = new PDO("mysql:dbname=calc_db;host=127.0.0.1", "root", ""); //don't care about security right now

//======================API Routes========================================//
$app->post('/API/Add/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];
    $answer = $operand1 + $operand2;

    insertEntry($operand1, "+", $operand2, $answer);

    echo $answer;
});

$app->post('/API/Subtract/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];
    $answer = $operand1 - $operand2;

    insertEntry($operand1, "-", $operand2, $answer);

    echo $answer;
});

$app->post('/API/Multiply/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];
    $answer = $operand1 * $operand2;

    insertEntry($operand1, "*", $operand2, $answer);

    echo $answer;
});

$app->post('/API/Divide/', function() use ($app, $pdo) {
    $operand1 = $_POST["operand1"];
    $operand2 = $_POST["operand2"];
    $answer = $operand1 / $operand2;

    insertEntry($operand1, "/", $operand2, $answer);

    echo $answer;
});

$app->get('/API/History/', function() use ($app, $pdo) {
    $results = getHistory();
    return json_encode($results);
});

$app->post('/API/Clear/', function() use ($app, $pdo){
    $results = clearHistory();
    return json_encode($results);
});

$app->run();

//=====================Private Functions========================//
function insertEntry($operand1, $operator, $operand2, $answer){
    global $pdo;

    $statement = $pdo->prepare(
        "INSERT INTO historytable (id, modulo, operand1, operator, operand2, answer)
            SELECT
              (coalesce(max(id), -1) + 1),
              (coalesce(max(id), -1) + 1) mod 5,
              :operand1,
              :operator,
              :operand2,
              :answer
            FROM historytable ON duplicate KEY UPDATE
              id = VALUES(id),
              operand1 = VALUES(operand1),
              operator = VALUES(operator),
              operand2 = VALUES(operand2),
              answer = VALUES(answer);"
    );

    $statement->execute(array(":operand1" => $operand1, ":operator" => $operator, ":operand2" => $operand2, ":answer" => $answer));

    return $statement;
}

function getHistory(){
    global $pdo;
    $statement = $pdo->prepare('SELECT * FROM historytable ORDER BY id');
    $statement->execute();
    $results = $statement -> fetchAll(PDO::FETCH_ASSOC);

    return $results;
}

function clearHistory(){
    global $pdo;
    $statement = $pdo->prepare('TRUNCATE TABLE historytable');
    $statement->execute();

    return $statement;
}