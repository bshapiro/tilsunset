<?php

$message = $_POST['message'];
$ip = $_POST['ip'];
$time = $_POST['time'];
$myFile = "comments.txt";
$fh = fopen($myFile, 'a');
fwrite($fh, $ip);
fwrite($fh, "\t");
fwrite($fh, $time);
fwrite($fh, "\t");
fwrite($fh, $message);
fwrite($fh, "\n");
fclose($fh);

?>
