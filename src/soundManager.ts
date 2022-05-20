import davidFisliyanMusic1 from './assets/sounds/David_Fesliyan_Music1.mp3';
import davidFisliyanMusic2 from './assets/sounds/David_Fesliyan_Music2.mp3';
import jump from './assets/sounds/jump.mp3';

/**
 * SoundManager should be a singleton, fetch its instance with SoundManager.Instance
 * @constructor Private
 * @method setVolume Set the main sound volume
 * @method increaseVolume Increase the main volume by .05
 * @method decreaseVolume Decrease the main volume by .05
 * @method toggleMute Toggle the muting of all sounds
 * @method nextSong Play the next music track
 * @method playSound Play a sound effect
 */
export class SoundManager {
    private static _instance: SoundManager;

    private _currentMusicTrackIndex: number;
    private _musicTracks: HTMLAudioElement[];
    private _sounds: Map<Sounds, {
        audio: HTMLAudioElement,
        volumeOffset: number
    }>;
    private _muted: boolean;
    private _mainVolume: number;
    private _loopCurrentTrack: boolean;

    private constructor(){

        this._muted = true;
        this._musicTracks = [
            new Audio(davidFisliyanMusic1),
            new Audio(davidFisliyanMusic2)
        ];
        this._sounds = new Map();
        this._sounds.set(Sounds.Jump, {audio: new Audio(jump), volumeOffset: -.2});

        this._musicTracks.forEach(track => track.addEventListener('ended', () => this.nextSong()))
        this._currentMusicTrackIndex = 1;
        this._loopCurrentTrack = false;
        this._mainVolume = .25
        this.nextSong();

        console.debug(`
            Temporary sound controls:
                Volume down: '-'
                Volume up: '+'
                Toggle mute: '0'
                Next song: '9'
                Jump sound: '8'
        `);
    }

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }

    /**
     * Set the main volume
     * @param value A number from 0 to 1
     */
    public setVolume(value: number): void {
        if(value < 0 || value > 1 || value % 0.05 !== 0)
            throw "Volume must be between 0 and 1 and an increment of 0.05"
        this._musicTracks[this._currentMusicTrackIndex].volume = +value;
    }

    /**
     * Increases the main volume by .05
     * @returns void
     */
    public increaseVolume(): void {
        if(this._mainVolume < 1)
            this._mainVolume = +(this._musicTracks[this._currentMusicTrackIndex].volume + 0.05).toPrecision(2);
        this._musicTracks[this._currentMusicTrackIndex].volume = this._mainVolume;
    }

    /**
     * Decrease the main volume by .05
     * @returns void
     */
    public decreaseVolume(): void {
        if(this._mainVolume > 0)
            this._mainVolume = +(this._musicTracks[this._currentMusicTrackIndex].volume - 0.05).toPrecision(2);
        this._musicTracks[this._currentMusicTrackIndex].volume = this._mainVolume;
    }

    /**
     * Toggle muting of all sounds
     * @returns void
     */
    public toggleMute(): void {
        if(this._muted){
            this._musicTracks[this._currentMusicTrackIndex].play();
            this._muted = false;
            return
        }
        this._musicTracks[this._currentMusicTrackIndex].pause();
        this._muted = true;
    }

    /**
     * Continue to the next music track
     * @returns void
     */
    public nextSong(): void {
        if(this._muted)
            return
        if(!this._musicTracks[this._currentMusicTrackIndex].paused || this._musicTracks[this._currentMusicTrackIndex].currentTime){
            this._musicTracks[this._currentMusicTrackIndex].currentTime = 0;
            this._musicTracks[this._currentMusicTrackIndex].pause();
        }
        this._currentMusicTrackIndex += 1;
        if(this._currentMusicTrackIndex >= this._musicTracks.length){
            this._currentMusicTrackIndex = 0;
        }

        this._musicTracks[this._currentMusicTrackIndex].volume = this._mainVolume;
        const resp = this._musicTracks[this._currentMusicTrackIndex].play();

        if (resp!== undefined) {
            resp.then(_ => {
                // autoplay starts!
            }).catch(error => {
               console.debug("Looks like audio was unable to auto play. Interact with the web page")
               setTimeout(() => this.nextSong(), 1000);
            });
        }
    }

    /**
     * Play a sound effect
     * @param soundName 
     * @returns void
     */
    public playSound(soundName: Sounds): void {
        if(this._muted)
            return
        const sound = this._sounds.get(soundName);
        const adjustedVolume = this._mainVolume + sound.volumeOffset;
        sound.audio.volume = Math.max(0, Math.min(1, adjustedVolume));
        sound.audio.play();
    }
}

export enum Sounds{
    Jump
}