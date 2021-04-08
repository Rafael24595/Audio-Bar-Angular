import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-bar',
  templateUrl: './audio-bar.component.html',
  styleUrls: ['./audio-bar.component.css']
})
export class AudioBarComponent implements OnInit {

  audio = new Audio();
  barSize = 400;
  playButtonColor = 'transparent';
  barColor = '#820000';
  barColorPlay = '#FF0000';
  barColorPause = '#820000'
  pointPosition = 0;
  pointStatus = '';
  audioStatus = true;
  speed = 1;
  lastTime = 0; 
  time = '00:00';
  vol = '100%';
  mouseDouwn = false;
  constructor() { }

  ngOnInit(): void { 
    this.audio.src = "../../../assets/test.mp3";
    this.audio.preload="metadata";
    this.audio.load;
    this.audio.onloadedmetadata = ()=>{
      this.audio.onloadeddata = ()=>{
        this.audio.onpause = ()=>{this.barColor = this.barColorPause; this.playButtonColor = 'transparent'}
        this.audio.onplay = ()=>{this.barColor = this.barColorPlay; this.playButtonColor = '#FF3333'}
        this.audio.ontimeupdate = ()=>{this.progressBar()}
        this.audio.play().then((e)=>{});
        console.log(this.audio.duration);
      }
    }
    
  }

  incrementVol(){

    let increment = Math.round((this.audio.volume + 0.1) * 10) / 10;
    increment = (increment < 1) ? increment : 1;

    this.audio.volume = increment;
    this.vol = `${increment * 100}%` 
  }

  decrementVol(){

    let decrement = Math.round((this.audio.volume - 0.1) * 10) / 10;
    decrement = (decrement > 0) ? decrement : 0;
 
    this.audio.volume = decrement;
    this.vol = `${decrement * 100}%` 
  }

  muteVol(){

    this.audio.muted = !this.audio.muted;
    if(this.audio.muted){
      this.vol = `<del>${this.vol}</del>`
    }
    else{
      this.vol = this.vol.replace(/(<([^>]+)>)/gi, "")
    }

  }

  updateSpeed(){

    this.audio.playbackRate = this.speed;

  }

  incrementTime(){

    this.audio.currentTime = this.audio.currentTime + 5;

  }

  decremenTime(){

    this.audio.currentTime = this.audio.currentTime - 5;

  }

  restartTime(){

      this.audio.pause();
      this.audio.currentTime = 0;

  }

  progressBar(){

    let timeActual = this.audio.currentTime;
    let timeTotal = this.audio.duration
    let movement = timeActual * this.barSize / timeTotal;

    this.pointPosition = movement;

    this.incrementSeconds(Math.trunc(timeActual));

  }

  incrementSeconds(seconds:number){
    
    let second:number | string = Math.floor((seconds*1000 % (1000 * 60)) / 1000);
    let minute:number | string = Math.floor((seconds*1000 % (1000 * 60 * 60)) / (1000 * 60))
    second = (second.toString().length > 1) ? second : `0${second}`
    minute = (minute.toString().length > 1) ? minute : `0${minute}`

    this.time = minute + ':' + second;

  }

  mouseDown(){
    this.pointStatus = 'drag-mode';
    this.audioStatus = (this.audio.paused) ? false : true; 
    this.audio.pause();
    this.mouseDouwn = true;
  }

  mouseUp(){
    if(this.mouseDouwn == true){
      this.calculatePosition(this.pointPosition)
      this.pointStatus = '';
      (this.audioStatus) ? this.audio.play(): this.audio.pause()
      this.mouseDouwn = false;
    }
  }

  mouseDrag(event:MouseEvent){
    
    if(this.mouseDouwn == true){

      let audioBarPosition = document.getElementById('audio-bar');
      let itemId = event.target as HTMLElement;
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;

      if(event.clientX - position >= 0 && event.clientX - position <= this.barSize){
        this.pointPosition = event.clientX - position;
      }

    }

  }

  calculatePosition(coorY:number){
    this.audio.currentTime = coorY * this.audio.duration / this.barSize;
  }

  toClick(event:MouseEvent){

    let itemId = event.target as HTMLElement;

    if(itemId.id == 'audio-bar'){

      this.calculatePosition(event.offsetX);

    }

  }
  
}
