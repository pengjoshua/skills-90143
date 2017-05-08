<?php
  header('Access-Control-Allow-Origin: *');

  $method = $_SERVER['REQUEST_METHOD'];

  if ($method === 'POST') {

    $data = $_POST['input'];
    $lines = explode("\n", $data);

    $actualLines = array_filter($lines, function($val) {
      return strlen($val) > 0;
    });

    $games = array_map(function($val) {
      return explode(', ', $val);
    }, $actualLines);

    $scores = array_map(function($game) {
      if (sizeof($game) > 0) {
        $score = array(
          'team1' => trim(substr($game[0], 0, strlen($game[0]) - 2)),
          'goals1' => intval(explode(' ', $game[0])[sizeof(explode(' ', $game[0])) - 1]),
          'team2' => trim(substr($game[1], 0, strlen($game[1]) - 2)),
          'goals2' => intval(explode(' ', $game[1])[sizeof(explode(' ', $game[1])) - 1]),
        );
        return $score;
      }
    }, $games);

    $points = array();
    foreach($scores as $key => $val) {
      $game = $scores[$key];
      $team1 = $game['team1'];
      $team2 = $game['team2'];
      if (array_key_exists($team1, $points) !== TRUE) {
        $points[$team1] = 0;
      }
      if (array_key_exists($team2, $points) !== TRUE) {
        $points[$team2] = 0;
      }
      if ($game['goals1'] === $game['goals2']) {
        $points[$team1] += 1;
        $points[$team2] += 1;
      } elseif ($game['goals1'] > $game['goals2']) {
        $points[$team1] += 3;
      } else {
        $points[$team2] += 3;
      }
    }

    function cmp($a, $b) {
      return $a[1] - $b[1];
    }

    $ranking = array();
    foreach($points as $team => $val) {
      array_push($ranking, array($team, $points[$team]));
    }

    uasort($ranking, 'cmp');
    $sortedRanking = array_reverse($ranking);

    $tableRanking = array_map(function($team, $i) use ($sortedRanking) {
      if ($i > 0 && $sortedRanking[$i][1] === $sortedRanking[$i - 1][1]) {
        return ['rank' => $i . '.', 'team' => $team[0], 'points' => ($team[1] === 1) ? $team[1] . ' pt' : $team[1] . ' pts'];
      } else {
        return ['rank' => ($i + 1) . '.', 'team' => $team[0], 'points' => ($team[1] === 1) ? $team[1] . ' pt' : $team[1] . ' pts'];
      }
    }, $sortedRanking, array_keys($sortedRanking));

    $result = ['scores' => $scores, 'ranking' => $tableRanking];
    echo json_encode($result);
  }
?>
