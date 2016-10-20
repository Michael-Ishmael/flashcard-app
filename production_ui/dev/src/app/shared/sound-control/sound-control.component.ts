import {Component, OnInit, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-sound-control',
  templateUrl: 'sound-control.component.html',
  styleUrls: ['sound-control.component.css'] 
})
export class SoundControlComponent implements OnInit {

  @Input() src:string;
  @Input() isSpeech:boolean;
  audio:HTMLAudioElement;
  playing: boolean;

  constructor() { }

  togglePlaySound(){
    if(!this.audio){
      this.audio = new Audio();
      this.audio.src =  this.src;
      var that = this;
      this.audio.addEventListener("ended", function(){
        that.audio.currentTime = 0;
        that.playing = false;
      });
      this.audio.load();
    }
    if(this.playing){
      this.playing =false;
      this.audio.pause();
      this.audio.currentTime = 0;
    } else {
      this.playing = true;
      this.audio.play();
    }
  }

  ngOnInit() {
  }

}
