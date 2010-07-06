<?php
class bb_help {

  const bb_usage_string = "bb [--version] [--help] COMMAND [ARGS]";
  const bb_info_string = <<<'EOT'
The most commonly used bb commands are:
   think    Add thought to current flow
   forget   Mark a thought from a flow as finished
   plan     Add thought to future flow
   init     Create an empty bb repository or reinitialize an existing one
   status   Show the reality status
EOT;
  const bb_more_info_string = 
    "See 'bb help COMMAND' for more information on a specific command.";

  function run($argv) {
    if (!isset($argv[2])) {
      printf("usage: %s\n\n", self::bb_usage_string);
      printf("%s\n", self::bb_info_string);
      printf("\n%s\n", self::bb_more_info_string);
      return 0;
    }
    
    $cmd = $argv[2];
    switch ($cmd) {
      case "help":
      case "version":
      case "init":
      case "think":
        $cmd = "-".$cmd;
      default:
        $cmd = "bb".$cmd;
    }
    passthru(sprintf("man %s", $cmd), $return);
    return $return;
  }
}
?>
