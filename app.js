function handleFileSelect(evt) {
  const files = evt.target.files; // Filelist object

  // Loop through the Filelist
  for (let i = 0, f; f = files[i]; i++) {

    // Create a new FileReader instance
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (file => {
      return e => {

        /* Select and uncomment only 1 of the 4 following server and endpoint combinations */

        /* 1. PHP server POST endpoint - select a text file to upload to the server */
        // $.post('http://localhost:3001', { input: e.target.result }, (response, status) => {
        //   data = JSON.parse(response);

        /* 2. PHP server GET endpoint - the server directly reads in data-input.txt file */
        // $.get('http://localhost:3001', (response) => {
        //   data = JSON.parse(response);

        /* 3. Node/Express server POST endpoint - select a text file to upload to the server */
        $.post('http://localhost:3000/soccer', { input: e.target.result }, (response, status) => {
          data = response;

        /* 4. Node/Express server GET endpoint - the server directly reads in data-input.txt file */
        // $.get('http://localhost:3000/soccer', (response) => {
        //   data = response;

            const div1 = document.createElement('div');
            const div2 = document.createElement('div');

            // Add table content to divs
            div1.innerHTML = `
              <div class="row col-md-4">
                <table class="table table-hover">
                  <tr><h4>Soccer League Scores</h4></tr>
                  <tr>
                    <th>Home Team</th>
                    <th>Goals</th>
                    <th>Away Team</th>
                    <th>Goals</th>
                  </tr>
                  ${data.scores.map(score => `<tr><td>${score.team1}</td><td>${score.goals1}</td><td>${score.team2}</td><td>${score.goals2}</td></tr>`).join('')}
                </table>
              </div>
            `;

            div2.innerHTML = `
              <div class="row col-md-3">
                <table class="table table-hover">
                  <tr><h4>Soccer League Ranking</h4></tr>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Points</th>
                  </tr>
                  ${data.ranking.map(team => `<tr><td>${team.rank}</td><td>${team.team}</td><td>${team.points}</td></tr>`).join('')}
                </table>
              </div>
            `;

            document.getElementById('scores').insertBefore(div1, null);
            document.getElementById('ranking').insertBefore(div2, null);

        });
      };

    })(f);

    // Read in the file
    reader.readAsText(f);
  }
}
// Add Event Listener to the DOM
document.getElementById('files').addEventListener('change', handleFileSelect, false);
