import { PlayerNames } from "../classes/player-switch";
import { FbStatsLib } from "./fb-stats";

export class FbDataLib {

    public static unlockedCharacters: Array<PlayerNames> = [];

    public static async loadUnlockedCharacters(): Promise<Array<PlayerNames>> {
        try {
            let data = await FBInstant.player.getDataAsync(['unlockedCharacters']);

            if (data.unlockedCharacters != null) {
                this.unlockedCharacters = data.unlockedCharacters;
    
                return this.unlockedCharacters;
            }
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    public static async buyCharacter(playerName: PlayerNames, cost: number): Promise<number> {
        try {
            await this.loadUnlockedCharacters();

            let newWormsCount = await FbStatsLib.decreaseWormsCatched(cost);
    
            this.unlockedCharacters.push(playerName);
            await FBInstant.player.setDataAsync({
                unlockedCharacters: this.unlockedCharacters
            });
    
            return newWormsCount;
        } catch (error) {
            console.error(error);
        }

        return null;
    }

    public static async lockAllCharacters() {
        try {
            await FBInstant.player.setDataAsync({unlockedCharacters: []});
        } catch (error) {
            console.error(error);
        }
    }

    public static getUnlockedCharacters() {
        return this.unlockedCharacters;
    }
}