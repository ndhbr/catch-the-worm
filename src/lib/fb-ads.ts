const PLACEMENT_INT = '2519737888241507_2526608514221111';
const PLACEMENT_VID = '2519737888241507_2526608020887827';

export class FbAdsLib {

    public static interstitial: FBInstant.AdInstance;

    public static rewardedVideo: FBInstant.AdInstance;

    public static scoreCount: number = 0;

    public static gameCount: number = 0;

    public static async loadInterstitial(): Promise<boolean> {
        if (this.interstitial == null) {
            try {
                this.interstitial = await FBInstant.getInterstitialAdAsync(PLACEMENT_INT);
                await this.interstitial.loadAsync();

                console.log('ADS', 'Preloaded Interstitial.');

                return true;
            } catch (error) {
                console.error(error);

                return false;
            }
        }

        return false;
    }

    public static async loadRewardedVideo(): Promise<boolean> {
        if (this.rewardedVideo == null) {
            try {
                this.rewardedVideo = await FBInstant.getRewardedVideoAsync(PLACEMENT_VID);
                await this.rewardedVideo.loadAsync();
    
                console.log('ADS', 'Preloaded Video.');

                return true;
            } catch (error) {
                console.error(error);

                return false;
            }
        }

        return false;
    }

    public static async showInterstitial(): Promise<boolean> {
        if (this.interstitial != null && (this.gameCount == 1 ||
            (this.scoreCount > 1 && this.scoreCount % 75 == 0 ))) {
            try {
                await this.interstitial.showAsync();
                this.interstitial = null;
            } catch (error) {
                console.error(error);

                return false;
            }

            this.loadInterstitial();

            console.log('ADS', 'Showed Interstitial, preloading it again.');

            return true;
        }

        return false;
    }

    public static async showRewardedVideo(): Promise<boolean> {
        if (this.rewardedVideo != null) {
            try {
                await this.rewardedVideo.showAsync();
                this.rewardedVideo = null;
            } catch (error) {
                console.error(error);

                return false;
            }
            
            this.loadRewardedVideo();

            console.log('ADS', 'Showed Video, preloading it again.');

            return true;
        }
        
        return false;
    }

    public static incrementScoreCount(score: number): number {
        this.scoreCount += score;
        this.gameCount++;

        return this.scoreCount;
    }
}