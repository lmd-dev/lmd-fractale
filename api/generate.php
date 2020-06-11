<?php
/**
 * API used to generate a fractal
 */
session_start();

//Is the website located on linux system ?
$LINUX = false;

//If API is called with POST method...
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $outputsDirectory = __DIR__.'/../outputs';
    $generatorDirectory = __DIR__.'/fractal-generator';
    $imageName = session_id();

    //Build the system command line to execute to generate the fractal
    if($LINUX)
        $command = "{$generatorDirectory}/fractal ";
    else
        $command = "{$generatorDirectory}/Fractale.exe ";

    //If parameters have been sended, adds them to the command line
    if(isset($_POST['parameters']))
    {
        foreach($_POST['parameters'] as $parameter)
        {
            if($parameter['name'] != 'array' ||  $parameter['name'] == 'array' && $parameter['value'] != '1')
                $command .= "-{$parameter['name']} {$parameter['value']} ";
        }
    }

    /**
     * Add a paramter to name the generated picture with the session_id of the user. Many people can generate a fractal
     * at the same time without conflict.
     */
    $command .= "-f \"{$outputsDirectory}/{$imageName}\" ";

    //Execute the command on the system
    exec($command);

    if($LINUX)
    {
        //If on linux, compress bitmap picture to jpeg format
        exec("mogrify -format jpg -quality 80 \"{$outputsDirectory}/{$imageName}-001.bmp\"");
    }

    //Sends the picture name to the client
    echo json_encode(array("pictureName" => $imageName));
}
else
{
    header("{$_SERVER['SERVER_PROTOCOL']} 400 BAD REQUEST METHOD");
}