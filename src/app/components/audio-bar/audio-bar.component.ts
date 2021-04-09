import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-bar',
  templateUrl: './audio-bar.component.html',
  styleUrls: ['./audio-bar.component.css']
})
export class AudioBarComponent implements OnInit {

  audioBar = AudioBar.getAudioBar();
  volumeBar = VolumeBar.getVolumeBar();

  audio = new Audio();

  barAudioSize = 450;
  pointAudioPosition = 0;
  playButtonColor = 'transparent';
  barColor = '#820000';
  barColorPlay = '#FF0000';
  barColorPause = '#820000';
  audioStatus = true;
  speed = 1; 
  time = '00:00';
  //vol = '100%';
  mouseDwnAudio = false;

  barVolumeSize = 75;
  pointVolumePosition = this.barVolumeSize;
  muteColor = 'transparent';
  muteColorUnmuted = 'transparent';
  muteColorMuted = '#8c99a6';
  mouseDwnVolume = false;

  constructor() { }

  ngOnInit(): void {
     
    this.prepareTheme("../../../assets/test.mp3");
  }

  prepareTheme(path:string){
    this.audio = new Audio();
    this.audio.src = path;
    //this.audio.preload="metadata";
    this.audio.load();
    this.audio.onloadedmetadata = ()=>{
      this.audio.onloadeddata = ()=>{
        this.audio.onpause = ()=>{this.barColor = this.barColorPause; this.playButtonColor = 'transparent'}
        this.audio.onplay = ()=>{this.barColor = this.barColorPlay; this.playButtonColor = '#FF3333'}
        this.audio.onvolumechange = ()=>{this.progressBarVolume()};
        this.audio.ontimeupdate = ()=>{this.progressBarAudio()}
        //this.audio.play();
      }
    }
  }

  /*incrementVol(){

    let increment = Math.round((this.audio.volume + 0.1) * 10) / 10;
    increment = (increment < 1) ? increment : 1;

    this.audio.volume = increment;
  }

  decrementVol(){

    let decrement = Math.round((this.audio.volume - 0.1) * 10) / 10;
    decrement = (decrement > 0) ? decrement : 0;
 
    this.audio.volume = decrement;
  }*/

  ////////////////////
  //VOLUME FUNCTIONS//
  ////////////////////
  /*
  progressBarVolume(){

    let volActual = this.audio.volume;
    let movement = volActual * this.barVolumeSize;
    this.pointVolumePosition = movement;

    //this.vol = `${Math.round(this.audio.volume * 100)}%`;
    this.setMuted();

  }

  muteVol(){
    this.audio.muted = !this.audio.muted;
    this.setMuted();
  }

  setMuted(){
    if(this.audio.muted){
      //this.vol = `<del>${this.vol}</del>`;
      this.muteColor = this.muteColorMuted;
    }
    else{
      //this.vol = this.vol.replace(/(<([^>]+)>)/gi, "");
      this.muteColor = this.muteColorUnmuted;
    }
  }

  mouseUpVolume(){
    if(this.mouseDwnVolume == true){
      this.calculateVolumePosition(this.pointVolumePosition)
      this.mouseDwnVolume = false;
    }
  }


  mouseDownVolume(){
    this.mouseDwnVolume = true;
  }

  calculateVolumePosition(coorY:number){
    this.audio.volume = coorY / this.barVolumeSize;
  }

  toClickVolume(event:MouseEvent){
    let itemId = event.target as HTMLElement;
    if(itemId.id == 'vol-bar'){
      this.calculateVolumePosition(event.offsetX);
    }
  }

  ///////////////////
  // BAR FUNCTIONS //
  ///////////////////

  updateSpeed(){

    this.audio.playbackRate = this.speed;

  }

  /*incrementTime(){

    this.audio.currentTime = this.audio.currentTime + 5;

  }

  decremenTime(){

    this.audio.currentTime = this.audio.currentTime - 5;

  }*/
  /*
  restartTime(){

      this.audio.pause();
      this.audio.currentTime = 0;

  }

  progressBarAudio(){

    let timeActual = this.audio.currentTime;
    let timeTotal = this.audio.duration
    let movement = timeActual * this.barAudioSize / timeTotal;

    this.pointAudioPosition = movement;

    this.incrementSeconds(Math.trunc(timeActual));

  }

  incrementSeconds(seconds:number){
    
    let second:number | string = Math.floor((seconds*1000 % (1000 * 60)) / 1000);
    let minute:number | string = Math.floor((seconds*1000 % (1000 * 60 * 60)) / (1000 * 60))
    second = (second.toString().length > 1) ? second : `0${second}`
    minute = (minute.toString().length > 1) ? minute : `0${minute}`

    this.time = minute + ':' + second;

  }

  mouseDownAudio(){
    this.audioStatus = (this.audio.paused) ? false : true; 
    this.audio.pause();
    this.mouseDwnAudio = true;
  }

  mouseUpAudio(){
    if(this.mouseDwnAudio == true){
      this.calculateAudioPosition(this.pointAudioPosition);
      (this.audioStatus) ? this.audio.play(): this.audio.pause()
      this.mouseDwnAudio = false;
    }
  }

  mouseDrag(event:MouseEvent){
    
    if(this.mouseDwnAudio == true){
      let audioBarPosition = document.getElementById('audio-bar');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      event.preventDefault();
      if(event.clientX - position >= 0 && event.clientX - position <= this.barAudioSize){
        this.pointAudioPosition = event.clientX - position;
      }
    }

    if(this.mouseDwnVolume == true){
      let audioBarPosition = document.getElementById('vol-bar');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      event.preventDefault();
      if(event.clientX - position >= 0 && event.clientX - position <= this.barVolumeSize){
        this.pointVolumePosition = event.clientX - position;
      }
      this.calculateVolumePosition(this.pointVolumePosition);
    }

  }

  calculateAudioPosition(coorY:number){
    this.audio.currentTime = coorY * this.audio.duration / this.barAudioSize;
  }

  toClickAudio(event:MouseEvent){
    let itemId = event.target as HTMLElement;
    if(itemId.id == 'audio-bar'){
      this.calculateAudioPosition(event.offsetX);
    }
  }*/

}







export class AudioBars{

  public static instance:AudioBars;
  audio;

  constructor(){
    this.audio = new Audio();
    AudioBars.instance = new AudioBars()
  }

  public static instanceAudioBars(){
    return (AudioBars.instance) ? AudioBars.instance : new AudioBars();
  }

  getAudio(){
    return this.audio;
  }

}



export class AudioBar{

  public static instance:AudioBar;
  public static audio:HTMLAudioElement;

  public static barAudioSize = 450;
  public static pointAudioPosition = 0;
  public static playButtonColor = 'transparent';
  public static barColor = '#820000';
  public static barColorPlay = '#FF0000';
  public static barColorPause = '#820000';
  public static audioStatus = true;
  public static speed = 1; 
  public static time = '00:00';
  public static mouseDwnAudio = false;

  constructor(){
    let audioInstance = AudioBars.instanceAudioBars();
    AudioBar.audio = audioInstance.getAudio();
  }

  public static getAudioBar(){
    return (AudioBar.instance) ? AudioBar.instance : new AudioBar();
  }

  updateSpeed(){

    AudioBar.audio.playbackRate = AudioBar.speed;

  }

  restartTime(){

    AudioBar.audio.pause();
    AudioBar.audio.currentTime = 0;

  }

  progressBarAudio(){

    let timeActual = AudioBar.audio.currentTime;
    let timeTotal = AudioBar.audio.duration
    let movement = timeActual * AudioBar.barAudioSize / timeTotal;

    AudioBar.pointAudioPosition = movement;

    this.incrementSeconds(Math.trunc(timeActual));

  }

  incrementSeconds(seconds:number){
    
    let second:number | string = Math.floor((seconds*1000 % (1000 * 60)) / 1000);
    let minute:number | string = Math.floor((seconds*1000 % (1000 * 60 * 60)) / (1000 * 60))
    second = (second.toString().length > 1) ? second : `0${second}`
    minute = (minute.toString().length > 1) ? minute : `0${minute}`

    AudioBar.time = minute + ':' + second;

  }

  mouseDownAudio(){
    AudioBar.audioStatus = (AudioBar.audio.paused) ? false : true; 
    AudioBar.audio.pause();
    AudioBar.mouseDwnAudio = true;
  }

  mouseUpAudio(){
    if(AudioBar.mouseDwnAudio == true){
      this.calculateAudioPosition(AudioBar.pointAudioPosition);
      (AudioBar.audioStatus) ? AudioBar.audio.play(): AudioBar.audio.pause()
      AudioBar.mouseDwnAudio = false;
    }
  }

  /*mouseDrag(event:MouseEvent){
    
    if(this.mouseDwnAudio == true){
      let audioBarPosition = document.getElementById('audio-bar');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      event.preventDefault();
      if(event.clientX - position >= 0 && event.clientX - position <= this.barAudioSize){
        this.pointAudioPosition = event.clientX - position;
      }
    }

    if(this.mouseDwnVolume == true){
      let audioBarPosition = document.getElementById('vol-bar');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      event.preventDefault();
      if(event.clientX - position >= 0 && event.clientX - position <= this.barVolumeSize){
        this.pointVolumePosition = event.clientX - position;
      }
      this.calculateVolumePosition(this.pointVolumePosition);
    }

  }*/

  calculateAudioPosition(coorY:number){
    AudioBar.audio.currentTime = coorY * AudioBar.audio.duration / AudioBar.barAudioSize;
  }

  toClickAudio(event:MouseEvent){
    let itemId = event.target as HTMLElement;
    if(itemId.id == 'audio-bar'){
      this.calculateAudioPosition(event.offsetX);
    }
  }

}

export class VolumeBar{

  public static instance:VolumeBar;
  audio:HTMLAudioElement;

  barVolumeSize = 75;
  pointVolumePosition = this.barVolumeSize;
  muteColor = 'transparent';
  muteColorUnmuted = 'transparent';
  muteColorMuted = '#8c99a6';
  mouseDwnVolume = false;

  constructor(){
    let audioInstance = AudioBars.instanceAudioBars();
    this.audio = audioInstance.getAudio();
  }

  public static getVolumeBar(){
    return (VolumeBar.instance) ? AudioBar.instance : new AudioBar();
  }

  /*prepareTheme(path:string){
    this.audio = new Audio();
    this.audio.src = path;
    //this.audio.preload="metadata";
    this.audio.load();
    this.audio.onloadedmetadata = ()=>{
      this.audio.onloadeddata = ()=>{
        this.audio.onpause = ()=>{this.barColor = this.barColorPause; this.playButtonColor = 'transparent'}
        this.audio.onplay = ()=>{this.barColor = this.barColorPlay; this.playButtonColor = '#FF3333'}
        this.audio.onvolumechange = ()=>{this.progressBarVolume()};
        this.audio.ontimeupdate = ()=>{this.progressBarAudio()}
        //this.audio.play();
      }
    }
  }*/

  progressBarVolume(){

    let volActual = this.audio.volume;
    let movement = volActual * this.barVolumeSize;
    this.pointVolumePosition = movement;

    //this.vol = `${Math.round(this.audio.volume * 100)}%`;
    this.setMuted();

  }

  muteVol(){
    this.audio.muted = !this.audio.muted;
    this.setMuted();
  }

  setMuted(){
    if(this.audio.muted){
      //this.vol = `<del>${this.vol}</del>`;
      this.muteColor = this.muteColorMuted;
    }
    else{
      //this.vol = this.vol.replace(/(<([^>]+)>)/gi, "");
      this.muteColor = this.muteColorUnmuted;
    }
  }

  mouseUpVolume(){
    if(this.mouseDwnVolume == true){
      this.calculateVolumePosition(this.pointVolumePosition)
      this.mouseDwnVolume = false;
    }
  }


  mouseDownVolume(){
    this.mouseDwnVolume = true;
  }

  calculateVolumePosition(coorY:number){
    this.audio.volume = coorY / this.barVolumeSize;
  }

  toClickVolume(event:MouseEvent){
    let itemId = event.target as HTMLElement;
    if(itemId.id == 'vol-bar'){
      this.calculateVolumePosition(event.offsetX);
    }
  }

}