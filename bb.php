<?php
require_once("builtin.h.php");
require_once("parse_options.php");

# Brain Branch: Activity flows in reality.
main($_SERVER["argv"]);

function needs_work_tree() {
  if (!bb_init::is_inside_work_tree()) {
    printf("fatal: Not a bb repository: %s\n", ".bb");
    exit(1);
  }
}

function run_command($argv) {
  $cmd = $argv[1];
  
  switch ($cmd) {
    case "help":
      $bb = new bb_help();
      return $bb->run($argv);
    case "version":
      $bb = new bb_version();
      return $bb->run($argv);
    case "init":
      $bb = new bb_init();
      return $bb->run($argv);
    case "think":
      needs_work_tree();
      $bb = new bb_think();
      return $bb->run($argv);
    case "show":
      needs_work_tree();
      $bb = new bb_show();
      return $bb->run($argv);
    default:
      printf("bb: %s is not a bb-command. See 'bb help'.\n", $argv[1]);
      return 1;
  }  
}

function handle_command($argv) {
  # Turn "bb cmd --help" into "bb help cmd"
  if (isset($argv[2]) and $argv[2] == "--help") {
    $argv[2] = $argv[1];
    $argv[1] = "help";
  }
  
  run_command($argv);
}

function main($argv) {
  # No command specified
  if (!isset($argv[1])) {
    $argv[] = "help";
    handle_command($argv);
    exit(1);
  }
  
  # Legacy
  else if ($argv[1] == "--help")
    $argv[1] = "help";
  else if ($argv[1] == "--version")
    $argv[1] = "version";

  exit(handle_command($argv));
}
?>
