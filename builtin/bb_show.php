<?php
class bb_show {
  const builtin_show_usage = "bb show [options] [--] <object>";
  private static $builtin_show_options = array(
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
    $params = parse_options($argv, 2, self::$builtin_show_options, self::builtin_show_usage);
    
    if (!count($params["extra"]))
      $object = "stack";
    else
      $object = $params["extra"][0];
    
    if (!in_array($object, []) {
      printf("\n",);
      return 1;
    }
    
    $path = bb_init::get_repository_path()."/stack";
    
    if (!is_readable($path)) {
      printf("%s: Permission denied\n", $path);
      return 1;
    }
    
    if (($stack = file($path)) === FALSE) {
      printf("%s: Cannot write file\n", $path);
      return 1;
    }
    
    $stack = array_reverse($stack);
    
    foreach ($stack as $item) {
      printf("%s", $item);
    }
    
    return 0;
  }
}
?>
