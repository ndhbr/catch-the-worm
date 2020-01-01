import { Score } from "../classes/score";

const GLOBAL_LEADERBOARD = 'global-score';
const CONTEXT_LEADERBOARD = 'friends';

export class ScoreLib {

    public static globalLeaderboard: FBInstant.Leaderboard;

    public static contextLeaderboard: FBInstant.Leaderboard;

    public static async loadLeaderboards() {
        if (ScoreLib.globalLeaderboard == null) {
            try {
                ScoreLib.globalLeaderboard = await FBInstant.getLeaderboardAsync(GLOBAL_LEADERBOARD);
            } catch (error) {
                console.error(error);
            }
        }

        if (ScoreLib.contextLeaderboard == null &&
            FBInstant.context.getID() != null) {
                try {
                    ScoreLib.contextLeaderboard = await FBInstant.getLeaderboardAsync(`${CONTEXT_LEADERBOARD}.${FBInstant.context.getID()}`);
                } catch (error) {
                    console.error(error);
                }
        }
    }

    public static async setScore(score: number): Promise<FBInstant.LeaderboardEntry> {
        console.log('SCORE', 'Setting score...');

        if (ScoreLib.globalLeaderboard != null) {
			let result: FBInstant.LeaderboardEntry;

			result = await this.globalLeaderboard.setScoreAsync(score);

			if (ScoreLib.contextLeaderboard != null) {
				result = await this.contextLeaderboard.setScoreAsync(score);

                try {
                    await FBInstant.updateAsync({
                        action: 'LEADERBOARD',
                        name: `${CONTEXT_LEADERBOARD}.${FBInstant.context.getID()}`
                    });
                } catch (error) {
                    console.error(error);
                }
                
                console.log('SCORE', 'Set score was successful, updated context.');
			} else {
                console.log('SCORE', 'Set score was successful, without context.');
            }

			return result;
		} else {
            console.log('SCORE', 'Failed to set, Leaderboard not ready.');
        }

		return null;
    }

    public static async getHighestContextScore(): Promise<FBInstant.LeaderboardEntry> {
        if  (ScoreLib.contextLeaderboard != null) {
            try {
                const entries = await ScoreLib.contextLeaderboard.getEntriesAsync(1, 0);
                const entry = entries.shift();
    
                return entry;
            } catch (error) {
                console.error(error);
            }
        }

        return null;
    }

    public static async getGlobalScore(): Promise<number> {
        if (ScoreLib.globalLeaderboard != null) {
            try {
                let playerEntry = await ScoreLib.globalLeaderboard.getPlayerEntryAsync();

                if (playerEntry == null)
                    return 0;

                return playerEntry.getScore();
            } catch (error) {
                console.error(error);
            }
        }

        return 0;
    }
}