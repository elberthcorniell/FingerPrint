<?php
/**
 * this file uses the enrollment class to
 * enroll users
 * @authors Dahir Muhammad Dahir (dahirmuhammad3@gmail.com)
 * @date    2020-04-18 14:28:39
 */

require_once("../coreComponents/basicRequirements.php");

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
if (!empty($data)) {

    $finger_string_array = $data["finger"];

    $enrolled_finger = enroll_fingerprint($finger_string_array);

    if ($enrolled_finger !== "enrollment failed" && $enrolled_middle_finger !== "enrollment failed"){
        # todo: return the enrolled fmds instead
        $output = ["enrolled_finger"=>$enrolled_finger];
        echo json_encode($output);
    }
    else {
        echo json_encode("enrollment failed!");
    }
} else {
    echo json_encode("error! no data provided in post request");
}

