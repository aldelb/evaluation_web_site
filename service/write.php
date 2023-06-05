<?php
/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

ob_start();

function sanitize($string = '', $is_filename = FALSE)
{
 // Replace all weird characters with dashes
 $string = preg_replace('/[^\w\-'. ($is_filename ? '~_\.' : ''). ']+/u', '-', $string);
 // Only allow one dash separator at a time (and make string lowercase)
 return strtolower(preg_replace('/--+/u', '-', $string));
}


$sessionParam = null;

//get_magic_quotes_gpc() was removed in PHP 8
if(version_compare(PHP_VERSION, '8.0.0', '<') and get_magic_quotes_gpc()){
	$sessionParam = stripslashes($_POST['sessionJSON']);
}else{
	$sessionParam = $_POST['sessionJSON'];
}


$session = json_decode($sessionParam);


$filepathPrefix = "../results/".sanitize($string = $session->testId, $is_filename =FALSE)."/";
$filepathPostfix = ".csv";

if (!is_dir($filepathPrefix)) {
    mkdir($filepathPrefix);
}
$length = count($session->participant->name);
// mushra
$write_mushra = false;
$mushraCsvData = array();


$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input, "date", "session_uuid", "trial_id", "rating_stimulus", "rating_score", "rating_time", "rating_comment");
array_push($mushraCsvData, $input);

 
 foreach ($session->trials as $trial) {
  if ($trial->type == "mushra" || $trial->type == "video_synchronized" || $trial->type == "video_believable" || $trial->type == "test_page") {
  $write_mushra = true;

    foreach ($trial->responses as $response) {


    $results = array($session->testId);
    for($i =0; $i < $length; $i++){
      array_push($results, $session->participant->response[$i]);
    }
    array_push($results, date("Y.m.d"), $session->uuid, $trial->id, $response->stimulus, $response->score, $response->time, $response->comment);

      array_push($mushraCsvData, $results);


    }
  }
}
		
if ($write_mushra) {
	$filename = $filepathPrefix."result_subjective_evaluation_".$session->uuid.$filepathPostfix;
	//print_r($filename);
	$isFile = is_file($filename);
	$fp = fopen($filename, 'a');
	print_r($isFile);
	foreach ($mushraCsvData as $row) {
		//print_r($row);
		if ($isFile) {	    	
			$isFile = false;
		} else {
		   fputcsv($fp, $row);
		}
	}
	fclose($fp);
}

// paired comparison

$write_pc = false;
$pcCsvData = array();
// array_push($pcCsvData, array("session_test_id", "participant_email", "participant_age", "participant_gender", "trial_id", "choice_reference", "choice_non_reference", "choice_answer", "choice_time", "choice_comment"));

$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input, "trial_id", "choice_reference", "choice_non_reference", "choice_answer", "choice_time", "choice_comment");
array_push($pcCsvData, $input);



foreach ($session->trials as $trial) {
  if ($trial->type == "paired_comparison") {
	  foreach ($trial->responses as $response) {	  	
	  	$write_pc = true;
		  
		 
		$results = array($session->testId);
		for($i =0; $i < $length; $i++){
			array_push($results, $session->participant->response[$i]);
		}  
		array_push($results, $trial->id, $response->reference, $response->nonReference, $response->answer, $response->time, $response->comment);
	  
	  	array_push($pcCsvData, $results); 
		  
		  
	    // array_push($pcCsvData, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, $response->reference, $response->nonReference, $response->answer, $response->time, $response->comment));    
	  }
  }
}

if ($write_pc) {
	$filename = $filepathPrefix."paired_comparison".$filepathPostfix;
	$isFile = is_file($filename);
	$fp = fopen($filename, 'a');
	foreach ($pcCsvData as $row) {
		if ($isFile) {	    	
			$isFile = false;
		} else {
		   fputcsv($fp, $row);
		}
	}
	fclose($fp);
}
?>
