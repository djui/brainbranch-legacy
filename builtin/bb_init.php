<?php
class bb_init {
  const builtin_init_usage = "bb init [-q | --quiet] [--bare] [--template=<template-directory>] [--shared[=<permissions>]] [directory]";
  private static $builtin_init_options = array(
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
    $params = parse_options($argv, 2, bb_init::$builtin_init_options, bb_init::builtin_init_usage);
    
    $path = bb_init::make_repository_path();
    
    if (is_dir($path)) {
      printf("Reinitialized existing bb repository in %s/\n", $path);
      return 0;
    }
    if (!is_writable(".")) {
      printf("%s: Permission denied\n", $path);
      return 1;
    }
    if (!mkdir($path)) {
      printf("%s: Failed\n", $path);
      return 1;
    }
    if (!touch($path."/stack")) {
      printf("%s: Failed\n", $path."/stack");
      return 1;
    }
    
    $path = realpath($path); # //.git -> /.git
    printf("Initialized empty bb repository in %s/\n", $path);
    return 0;
  }
  
  static function make_repository_path() {
    return realpath(".")."/.bb";
  }

  static function get_repository_path() {
    return realpath(realpath(".")."/.bb");
  }
  
  static function is_bb_directory($suspect) {
    if (!is_file($suspect."/stack")) return false;
    
    return true;
  }
  
  static function is_inside_work_tree() {
    return bb_init::get_repository_path() and 
      bb_init::is_bb_directory(bb_init::make_repository_path());
  }
}
?>
