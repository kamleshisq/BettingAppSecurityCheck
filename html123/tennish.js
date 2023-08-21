let dataScore = tennisSeries[i].marketList.score[0].data;
let timeMatch = dataScore.match(/class="tennis-time">([^<]*)/);
let time = timeMatch ? timeMatch[1].trim() : '';
let scoreMatches = dataScore.match(/class="set current">([^<]*)/g);
                            
let scores = scoreMatches ? scoreMatches.map(score => score.replace(/class="set current">/g, '').trim()) : [];
let setScores = scores.map(score => {
let [team1Score, team2Score] = score.split('-').map(item => item.trim());
return { team1Score, team2Score };
});

                            
console.log('Time:', time);
console.log('Set Scores:', scoreMatches);