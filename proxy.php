<?php
/* =========================
   SIMPLE PHP PROXY ENGINE
========================= */
function http_get($url){
  $ch = curl_init($url);
  curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_FOLLOWLOCATION=>true,
    CURLOPT_USERAGENT=>"ORCA-WebScan",
    CURLOPT_TIMEOUT=>15,
    CURLOPT_SSL_VERIFYPEER=>false
  ]);
  $body = curl_exec($ch);
  $info = curl_getinfo($ch);
  curl_close($ch);
  return [$body,$info];
}

if(isset($_GET['fetch'])){
  [$b,$i]=http_get($_GET['fetch']);
  http_response_code($i['http_code']??200);
  header("Content-Type:text/plain");
  echo $b;
  exit;
}
?>
