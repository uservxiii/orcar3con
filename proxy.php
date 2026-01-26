<?php
if(!isset($_GET['u'])) exit;

$url = $_GET['u'];
$ch = curl_init($url);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_USERAGENT => "ORCA-WebScan",
  CURLOPT_TIMEOUT => 15
]);

$body = curl_exec($ch);
$info = curl_getinfo($ch);
$err  = curl_error($ch);
curl_close($ch);

if($body===false){
  http_response_code(502);
  exit;
}

http_response_code($info['http_code']);
header("Content-Type: text/plain");
echo $body;
