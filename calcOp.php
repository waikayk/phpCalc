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

    //check history and see if the table is bigger than x. Let's say, x = 5.
    $history = getHistory();

    $statement = $pdo->prepare('INSERT INTO historytable (operand1, operator, operand2, answer) VALUES (?, ?, ?, ?)');

    //Limit the table to 5 entries
    if(count($history) >= 5) {
        clearHistory();
        for($i = 1; $i < 5; $i++) {
            $statement->execute(array(
                $history[$i]["operand1"],
                $history[$i]["operator"],
                $history[$i]["operand2"],
                $history[$i]["answer"]
            ));
        }
        /*
        for($i = 1; $i < 4; $i++) {
            $newID = $i + 1; //Note: MySql table id start from 1, arrays start from 0
            $newOperand1 = $history[$newID]['operand1'];
            $newOperator = $history[$newID]['operator'];
            $newOperand2 = $history[$newID]['operand2'];
            $newAnswer = $history[$newID]['answer'];

            $statement = $pdo->prepare("UPDATE historytable SET"
                . "operand1 = '$newOperand1', operator = '$newOperator', operand2 = '$newOperand2', answer = '$newAnswer'"
                . "WHERE id = '$newID';"
            );
            $statement->execute();
        }
        $statement = $pdo->prepare("UPDATE historytable SET"
            . "operand1 = '$operand1', operator = '$operator', operand2 = '$operand2', answer = '$answer'"
            . "WHERE id = 1;"
        );
        $statement->execute();
        */
    }

    //Insert new entry
    $statement->execute(array($operand1, $operator, $operand2, $answer));

    return $statement;
}

function getHistory(){
    global $pdo;
    $statement = $pdo->prepare('SELECT * FROM historytable');
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