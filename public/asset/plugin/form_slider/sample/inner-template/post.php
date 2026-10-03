<?php

// echo "---".$_POST["mode"];

echo json_encode($_POST , JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);