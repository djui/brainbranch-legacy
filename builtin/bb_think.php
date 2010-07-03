<?php
class bb_think {
  const builtin_think_usage = "bb think [options] [--] <thoughts>...";
  private static $builtin_think_options = array(
    array("n",  "", "dry-run", "dry run"),
    array("v",  "", "verbose", "be verbose"),
    array(),
    array("i",  "", "interactive", "interactive picking"),
    array("p",  "", "patch", "interactive patching"),
    array("e",  "", "edit", "edit current diff and apply"),
    array("f",  "", "force","allow adding otherwise ignored files"),
    array("u",  "", "update", "update tracked files"),
    array("N",  "", "intent-to-add", "record only the fact that the path will be added later"),
    array("A",  "", "all", "add all, noticing removal of tracked files"),
    array(null, "", "refresh", "don't add, only refresh the index"),
    array(null, "", "ignore-errors", "just skip files which cannot be added because of errors")
  );
  
  function run($argv) {
    $params = parse_options($argv, 2, self::$builtin_think_options, self::builtin_think_usage);
    
    if (!count($params["extra"])) {
      printf("Nothing specified. Nothing done.\n");
      return 0;
    }

    $thoughts = $params["extra"];    
    $path = bb_init::get_repository_path()."/stack";
    
    if (!is_writable($path)) {
      printf("%s: Permission denied\n", $path);
      return 1;
    }
    
    if (!$handle = fopen($path, "a")) {
      printf("%s: Cannot open file\n", $path);
      return 1;
    }
    
    foreach ($thoughts as $thought)
      if (fwrite($handle, $thought."\n") === FALSE) {
        printf("%s: Cannot write file\n", $path);
        fclose($handle);
        return 1;
      }
    
    fclose($handle);
    return 0;
  }
}
?>
