import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'ut-audio-img',
  templateUrl: './audio-img.component.html',
  styleUrls: ['./audio-img.component.less']
})
export class AudioImgComponent implements OnInit {

  @Input()
  public image: string;

  @Input()
  public audio: string;

  @ViewChild('player')
  private player: any;

  @ViewChild('infoPopover')
  private infoPopover: any;

  /**
   * Whether audio is playing or not.
   */
  public isPlaying: boolean = false;

  /**
   * Progress of audio playback.
   */
  public progress: number = 0;

  /**
   * Whether to show controls overlay or not.
   */
  public showOverlay: boolean = true;

  /**
   * Level of audio volumne from 0-3.
   */
  public volumeLevel: number = 1;

  constructor() { }

  ngOnInit() {

  }

  public onClickPlayPause(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  public play(): void {
    this.isPlaying = true;
    this.closeOverlay();
    this.setVolume();
    this.player.nativeElement.play();
  }

  public pause(): void {
   this.isPlaying = false;
   this.showOverlay = true;
   this.player.nativeElement.pause();
  }

  public stop(): void {
    this.isPlaying = false;
    this.openOverlay();
    this.player.nativeElement.pause();
    this.player.nativeElement.currentTime = 0;
  }

  public openOverlay(): void {
    if (!this.showOverlay) {
      this.showOverlay = true;
    }
  }

  public closeOverlay(): void {
    this.showOverlay = false;
  }

  public toggleVolume(): void {
    this.volumeLevel++;
    if (this.volumeLevel > 3) {
      this.volumeLevel = 0;
    }
    this.setVolume();
  }

  public setVolume(): void {
    this.player.nativeElement.volume = this.volumeLevel * 0.333;
  }

  public onAudioTimeUpdate(): void {
    this.progress = this.player.nativeElement.currentTime / this.player.nativeElement.duration * 100;
  }

}
