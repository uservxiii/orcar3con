<?php
if(!isset($_GET['url'])) die("no url");
$url=$_GET['url'];

if(!preg_match('#^https?://#',$url)) die("invalid");

$ch=curl_init($url);
curl_setopt_array($ch,[
  CURLOPT_RETURNTRANSFER=>true,
  CURLOPT_FOLLOWLOCATION=>true,
  CURLOPT_TIMEOUT=>12,
  CURLOPT_USERAGENT=>"ORCA-WebScan"
]);

$data=curl_exec($ch);
$code=curl_getinfo($ch,CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($code);
header("Content-Type: application/json");
echo $data;
