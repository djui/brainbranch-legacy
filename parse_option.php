<?php
require_once("vendor/getopt.php");

function parse_options($args, $shift, $options, $usage) {
  for ($i = 1; $i <= $shift; $i++)
    array_shift($args);
  
  $shortopts = "";
  $longopts = array();
  
  foreach ($options as $option) {
    if (!empty($option)) {
      if ($option != null)
        $shortopts .= $option[0].$option[1];
      $longsopts[] = $option[2].$option[1];
    }
  }
  
  $cg = new Console_Getopt();
  $params = $cg->getopt2($args, $shortopts, $longopts);

  if (!is_array($params)) {
    printf("%s\n", $params->getMessage());
    printf("usage: %s\n\n", $usage);
    foreach ($options as $option) {
      if (empty($option))
        printf("\n");
      else if ($option[0] == null)
        printf("    --%19s %s\n", $option[0], $option[2], $option[4]);
      else
        printf("    -%s, --%15s %s\n", $option[0], $option[2], $option[4]);
    }
    printf("\n");
    exit(1);
  }
  
  return $params;
}
?>