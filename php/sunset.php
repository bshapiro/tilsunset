<?php

$latitude = $_GET['latitude'];
$longitude = $_GET['longitude'];
$gmt_offset = $_GET['gmt_offset'];

$sunrise = date_sunrise(time(), SUNFUNCS_RET_DOUBLE, $latitude, $longitude, date.sunset_zenith, $gmt_offset);
$sunset = date_sunset(time(), SUNFUNCS_RET_DOUBLE, $latitude, $longitude, date.sunset_zenith, $gmt_offset);

echo $sunrise;
echo $sunset;
?>
