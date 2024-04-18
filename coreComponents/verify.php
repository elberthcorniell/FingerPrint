<?php
/**
 * -=-<[ Bismillahirrahmanirrahim ]>-=-
 * Verify fingerprint
 * @authors Dahir Muhammad Dahir (dahirmuhammad3@gmail.com)
 * @date    2022-04-10 15:48:48
 * @version 1.0.0
 */

require_once("../coreComponents/basicRequirements.php");

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
if(!empty($data)) {
    $pre_enrolled_finger_data = $data["pre_enrolled_finger_data"];

    $enrolled_finger_data = $data["enrolled_finger_data"];

    $verified_finger = verify_fingerprint($pre_enrolled_finger_data, $enrolled_finger_data);

    if ($verified_finger !== "verification failed" && $verified_finger){
        echo json_encode("match");
    }
    else {
        echo json_encode("no_match");
    }

}
else {
    echo json_encode("error! no data provided in post request");
}