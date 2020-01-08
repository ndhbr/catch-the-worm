const WORMS_CATCHED = 'wormsCatched';

export class FbStatsLib {

    public static wormsCatched: number;
    
    public static async incrementWormsCatched(wormCount: number) {
        try {
            let result = await FBInstant.player.incrementStatsAsync({'wormsCatched': wormCount});
        
            if (result != null)
                this.wormsCatched = result.wormsCatched;
        } catch (error) {
            console.error(error);
        }
    }

    public static async decreaseWormsCatched(wormCount: number): Promise<number> {
        try {
            if (this.wormsCatched != null) {
                await FBInstant.player.setStatsAsync({'wormsCatched': (this.wormsCatched - wormCount)});
                this.wormsCatched -= wormCount;

                return this.wormsCatched;
            }
        } catch (error) {
            console.error(error);
        }

        return -1;
    }

    public static async getWormsCatched(): Promise<number> {
        if (this.wormsCatched != null) {
            return this.wormsCatched;
        } else {
            try {
                const result = await FBInstant.player.getStatsAsync(['wormsCatched']);

                if (result != null && result.wormsCatched != null && result.wormsCatched > 0) {
                    this.wormsCatched = result['wormsCatched'];
                    return result['wormsCatched'];
                } else {
                    this.wormsCatched = 0;
                    return 0;
                }
            } catch (error) {
                console.error(error);

                this.wormsCatched = 0;
                return 0;
            }
        }
    }

    public static async resetWormsCatched(): Promise<void> {
        try {
            await FBInstant.player.setStatsAsync({'wormsCatched': 0});
        } catch (error) {
            console.error(error);
        }
    }
}