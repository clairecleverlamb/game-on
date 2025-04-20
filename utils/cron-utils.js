const Game = require('../models/game');
const Tournament = require('../models/tournament');

async function updateCompletedGamesAndTournaments() {
  try {
    const now = new Date();

    const games = await Game.find({ completed: false });
    for (const game of games) {
      if (game.time < now) {
        game.completed = true;
        game.status = 'Completed';
        await game.save();
      }
    }

    const tournaments = await Tournament.find({ completed: false });
    for (const tournament of tournaments) {
      if (tournament.endDate < now) {
        tournament.completed = true;
        tournament.status = 'Completed';
        await tournament.save();
      }
    }

    console.log(`[Cron] Updated games and tournaments that have ended`);
  } catch (err) {
    console.error('[Cron] Error during game/tournament update:', err);
  }
}

module.exports = {
  updateCompletedGamesAndTournaments,
};
