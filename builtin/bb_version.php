<?php
class bb_version {
  const bb_version_string = "1.0.0.0";

  function run($argv) {
    printf("bb version %s\n", self::bb_version_string);
    return 0;
  }
}
?>
