import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audio-bar',
  templateUrl: './audio-bar.component.html',
  styleUrls: ['./audio-bar.component.css']
})
export class AudioBarComponent implements OnInit {

  @Output() outputToparent = new EventEmitter<string>();

  /*/////////////
  | THEMES VARS |
  /////////////*/

  audio = new Audio();
  themesList:{id:string, name:string}[] = [
    {id: 'test-001', name:'The Last Bible III - Forest:'}, 
    {id: 'test-002', name:'Sim City 2000 - Subway Song:'}, 
    {id: 'test-003', name:'Age of Empires The Rise of Rome - Mean Ain\'t No Hip Hop In Tha House Mix:'}, 
    {id: 'test-004', name:'Doom - E1M2 - The Imps Song:'}];
  themesListRandom:{id:string, name:string}[] = [];
  themesListActive:{id:string, name:string}[] = this.themesList;
  position = 0;
  randomList = false;
  loopList = false;
  launchPaused = false;

  /*////////////
  | AUDIO VARS |
  ////////////*/

  barAudioSize = 525;
  pointAudioPosition = 0;
  speed = 1; 
  time = '00:00';
  overBar = 'none'
  timePointer = this.time;
  timePointerPosition = 0;
  audioStatus = true;
  mouseDwnAudio = false;

  /*/////////////
  | VOlUME VARS |
  /////////////*/

  barVolumeSize = 75;
  pointVolumePosition = this.barVolumeSize;
  mouseDwnVolume = false;
  //vol = '100%';

  /*////////////
  | COLOR VARS |
  ////////////*/

  playButtonColorPause = 'transparent';
  playButtonColorPlay = '#FF3333';
  playButtonColor = this.playButtonColorPause;

  barColor = '#820000';
  barColorPlay = '#FF0000';
  barColorPause = this.barColor;

  muteColorUnmuted = 'transparent';
  muteColorMuted = '#8c99a6';
  muteColor = this.muteColorUnmuted;

  loopColorActive = '#8c99a6';
  loopColorInactive = 'transparent';
  loopColor = this.loopColorInactive;

  randomColorActive = '#8c99a6';
  randomColorInactive = 'transparent';
  randomColor = this.randomColorInactive;

  loopListColorActive = '#8c99a6';
  loopListColorInactive = 'transparent';
  loopListColor = this.loopListColorInactive;

  constructor() { }

  ngOnInit(): void { 
    this.prepareTheme(this.themesListActive[this.position]);
  }

  /////////////////////////
  //PREPARATION FUNCTIONS//
  /////////////////////////

  prepareTheme(theme:{id:string, name:string}){
    let muted = localStorage.getItem('isMuted');
    let loop = localStorage.getItem('isLoop');
    let volume = localStorage.getItem('volVal');
    let velocity = localStorage.getItem('velVal');
    let listLoop = localStorage.getItem('isListLoop');
    let listRandom = localStorage.getItem('isListRandom');

    this.audio.pause();
    this.audio = new Audio();
    this.audio.src = `../../../assets/${theme.id}.mp3`;
    //this.audio.preload="metadata";
    this.audio.load();
    this.audio.onloadedmetadata = ()=>{
      this.audio.onloadeddata = ()=>{
        this.audio.onpause = ()=>{this.barColor = this.barColorPause; this.playButtonColor = this.playButtonColorPause}
        this.audio.onplay = ()=>{this.barColor = this.barColorPlay; this.playButtonColor = this.playButtonColorPlay}
        this.audio.onvolumechange = ()=>{this.progressBarVolume()};
        this.audio.ontimeupdate = ()=>{this.progressBarAudio()}
        this.audio.onended = ()=>{this.calculeNextThemePosition(1)}

        this.audio.muted = (muted) ? JSON.parse(muted) : this.audio.muted;
        this.audio.loop = (loop) ? JSON.parse(loop) : this.audio.loop;
        this.audio.volume = (volume) ? JSON.parse(volume) : this.audio.volume;
        this.audio.playbackRate = (velocity) ? JSON.parse(velocity) : this.audio.playbackRate;
        this.loopList = (listLoop) ? JSON.parse(listLoop) : false;
        this.randomList = (listRandom) ? JSON.parse(listRandom) : false

        this.progressBarAudio();
        this.setLoopAudio();
        this.selectVelocity();
        this.setLoopList();
        this.setRandomList();

        this.outputToparent.emit(JSON.stringify(theme));

        (!this.launchPaused) ? this.audio.play() : this.launchPaused = !this.launchPaused;
      }
    }
  }

  //////////////////////////
  //REPRODUCTION FUNCTIONS//
  //////////////////////////

  loopListReproduction(){
    this.loopList = !this.loopList;
    this.setLoopList();
    localStorage.setItem('isListLoop', JSON.stringify(this.loopList));
  }

  setLoopList(){
    if(this.loopList){
      this.loopListColor = this.loopListColorActive;
    }
    else{
      this.loopListColor = this.loopListColorInactive;
    }
  }

  loopAudio(){
    this.audio.loop = !this.audio.loop;
    this.setLoopAudio()
    localStorage.setItem('isLoop', JSON.stringify(this.audio.loop));
  }

  setLoopAudio(){
    this.loopColor = (this.audio.loop) ? this.loopColorActive : this.loopColorInactive;
  }

  randomReproduction(){
    this.randomList = !this.randomList;
    if(this.randomList){
      this.randomizeList();
      this.position = 0;
      this.themesListActive = this.themesListRandom;
    }
    else{
      this.position = this.findActualPosition();
      this.themesListActive = this.themesList;
    }
    this.setRandomList();
    localStorage.setItem('isListRandom', JSON.stringify(this.randomList));
  }

  setRandomList(){
    if(this.randomList){
      this.randomColor = this.randomColorActive;
    }
    else{
      this.randomColor = this.randomColorInactive;
    }
  }

  ///////////////////
  //TOOLS FUNCTIONS//
  ///////////////////

  randomizeList(){
    let randomList = [];
    let themeListTransition:{id:string, name:string}[] = this.copyArray(this.themesList) as {id:string, name:string}[];
    randomList.push(themeListTransition[this.position]);
    themeListTransition.splice(this.position, 1);
    while(themeListTransition.length > 0){
      let random = Math.floor(Math.random() * themeListTransition.length);
      if(random < themeListTransition.length){
        randomList.push(themeListTransition[random]);
        themeListTransition.splice(random, 1);
      }
    }
    this.themesListRandom = randomList;
  }

  getSeconds(time?:number){
    let seconds = (time) ? time : Math.trunc(this.audio.currentTime)
    let second:number | string = Math.floor((seconds*1000 % (1000 * 60)) / 1000);
    let minute:number | string = Math.floor((seconds*1000 % (1000 * 60 * 60)) / (1000 * 60))
    second = (second.toString().length > 1) ? second : `0${second}`;
    minute = (minute.toString().length > 1) ? minute : `0${minute}`;

    return minute + ':' + second;
  }

  findActualPosition(){
    let actualId = this.themesListActive[this.position].id;
    let index = -1;
    this.themesList.find(theme=>{ index++; return (theme.id == actualId)})
    return index;
  }

  calculeNextThemePosition(event:Event | number){
    let action:HTMLInputElement | number = -1;
    if(event){
      if(typeof event != 'number' && event.target){
        action = event.target as HTMLInputElement;
        action = parseInt(action.value);
      }
      else if(typeof event == 'number'){
        action = event;
      }
      if(this.loopList){
        action = (this.position + action < 0) ? this.themesListActive.length -1 : (this.position + action > this.themesList.length -1) ? 0 : this.position + action;
      }
      else{
        (this.position + action < 0) ? (action = 0, this.launchPaused = true) : (this.position + action > this.themesListActive.length -1) ? (action = this.themesListActive.length -1, this.launchPaused = true) : action = this.position + action;
      }
    }
    this.position = action;
    this.prepareTheme(this.themesListActive[this.position]);
  }

  calculeTimeByPixel(position:number){
    let timeTotal = this.audio.duration
    return position * timeTotal / this.barAudioSize ;

  }

  calculeTimeBySeconds(position?:number){
    let timeActual = (position) ? position : this.audio.currentTime;
    let timeTotal = this.audio.duration
    return timeActual * this.barAudioSize / timeTotal;

  }

  calculateAudioPosition(coorY:number){
    this.audio.currentTime = coorY * this.audio.duration / this.barAudioSize;
  }

  calculateVolumePosition(coorY:number){
    this.audio.volume = coorY / this.barVolumeSize;
  }

  copyArray(array:object[]){
    let arrayCopy = [];
    for (const obj of array) {
      arrayCopy.push(obj);
    }
    return arrayCopy
  }

  //////////////////////
  //MULTIBAR FUNCTIONS//
  //////////////////////

  mouseDrag(event:MouseEvent){
    
    this.showTimePointer(event);

    if(this.mouseDwnAudio == true){
      this.audioBarDrag(event);
    }

    if(this.mouseDwnVolume == true){
      this.volumeBarDrag(event);
    }

  }

  toClick(event:MouseEvent){
    let itemId = event.target as HTMLElement;
    if(itemId.id == 'audio-bar-padding'){
      this.calculateAudioPosition(event.offsetX);
      this.mouseDownAudio();
    }
    if(itemId.id == 'vol-bar'){
      this.calculateVolumePosition(event.offsetX);
      this.mouseDownVolume();
    }
  }

  ////////////////////
  //VOLUME FUNCTIONS//
  ////////////////////

  volumeBarDrag(event:MouseEvent){
    let audioBarPosition = document.getElementById('vol-bar');
    let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
    event.preventDefault();

    if(event.clientX - position >= 0 && event.clientX - position <= this.barVolumeSize){
      this.pointVolumePosition = event.clientX - position;
    }
    this.calculateVolumePosition(this.pointVolumePosition);
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

  progressBarVolume(){
    let volActual = this.audio.volume;
    let movement = volActual * this.barVolumeSize;
    this.pointVolumePosition = movement;

    //this.vol = `${Math.round(this.audio.volume * 100)}%`;
    this.setMuted();
    localStorage.setItem('volVal', JSON.stringify(this.audio.volume));
  }

  muteVol(){
    this.audio.muted = !this.audio.muted;
    localStorage.setItem('isMuted', JSON.stringify(this.audio.muted));
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

  ///////////////////
  // BAR FUNCTIONS //
  ///////////////////

  audioBarDrag(event:MouseEvent){
    let audioBarPosition = document.getElementById('audio-bar-padding');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      event.preventDefault();
      if(event.clientX - position >= 0 && event.clientX - position <= this.barAudioSize){
        this.pointAudioPosition = event.clientX - position;
      }
  }

  mouseDownAudio(){
    this.audioStatus = (this.audio.paused) ? false : true; 
    this.audio.pause();
    this.mouseDwnAudio = true;
  }

  mouseUpAudio(){
    if(this.mouseDwnAudio == true){
      this.calculateAudioPosition(this.pointAudioPosition);
      (this.audioStatus) ? this.audio.play(): this.audio.pause();
      this.mouseDwnAudio = false;
    }
  }

  progressBarAudio(){
    let movement = this.calculeTimeBySeconds();
    this.pointAudioPosition = movement;
    this.time = this.getSeconds();
  }

  showTimePointer(event:MouseEvent){
    let itemId:HTMLElement | string = event.target as HTMLElement;
    itemId = itemId.id;
    
    if(itemId == 'audio-bar-padding' || itemId == 'Meatball' ){
      this.overBar = 'block';
      let audioBarPosition = document.getElementById('audio-bar-padding');
      let position = (audioBarPosition) ? audioBarPosition.offsetLeft : 0;
      position = event.clientX - position;
      let time = this.calculeTimeByPixel(position);
      this.timePointer = this.getSeconds(time)
      this.timePointerPosition = position
    }
    else{
      this.overBar = 'none';
    }
  }

  selectVelocity(){
    this.speed = this.audio.playbackRate;
  }

  updateSpeed(){
    this.audio.playbackRate = this.speed;
    localStorage.setItem('velVal', JSON.stringify(this.audio.playbackRate));
  }

  stopAudio(){
    this.audio.pause();
    this.audio.currentTime = 0;
}

  /*incrementTime(){

    this.audio.currentTime = this.audio.currentTime + 5;

  }

  decremenTime(){

    this.audio.currentTime = this.audio.currentTime - 5;

  }*/

}
