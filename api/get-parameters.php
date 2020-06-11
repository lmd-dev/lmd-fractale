<?php
/**
 * API used to get available parameters for the fractal generation
 * 
 *Available parameters are stored in the /config/parameters.json file
 * formated wih JSON format
 *
 * This script tries to access parameter.json file and sends its content
 * to the client
 */
$file = __DIR__.'/../config/parameters.json';

if (file_exists($file)) {

    header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
    header("Cache-Control: public");
    header("Content-Type: text/json");
    header("Content-Length:".filesize($file));
    readfile($file);
} else {
    echo json_encode(array("parameters" => array()));
} 