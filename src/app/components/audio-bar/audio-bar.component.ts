import { flatten } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BarThemesListInterface } from 'src/app/interfaces/Bar-Themes-List';
import { AudiobufferToWav } from 'src/utils/AudionufferToWav';
import { BarUtils } from 'src/utils/Bar-Utils';

@Component({
  selector: 'app-audio-bar',
  templateUrl: './audio-bar.component.html',
  styleUrls: ['./audio-bar.component.css']
})
export class AudioBarComponent implements OnInit {

  @Output() outputToparent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { 
    this.prepareTheme(this.themesListActive[this.position]);
  }

  /*/////////////
  | THEMES VARS |
  /////////////*/

  audio = new Audio();
  themesList:BarThemesListInterface[] = [
    {id: 'test-001', name:'The Last Bible III - Forest:'}, 
    {id: 'test-002', name:'Sim City 2000 - Subway Song:'}, 
    {id: 'test-003', name:'Age of Empires The Rise of Rome - Mean Ain\'t No Hip Hop In Tha House Mix:'}, 
    {id: 'test-004', name:'Doom - E1M2 - The Imps Song:'}];
  themesListRandom:BarThemesListInterface[] = [];
  themesListActive:BarThemesListInterface[] = this.themesList;
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
  isReverse = false;
  normalSrc = '';
  reverseSrc = '';

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

  loadGifHidden = 'hidden';
  loadGifVisible = 'initial';
  loadGif = this.loadGifHidden;

  playButtonColorPause = 'transparent';
  playButtonColorPlay = '#FF3333';
  playButtonColor = this.playButtonColorPause;

  barColorPause = '#820000';
  barColorPlay = '#FF0000';
  barColorReversePlay = '#8117FF';
  barColorReversePause = '#44305C';
  barColor = this.barColorPause ;

  barVolColorUnmuted = '#808080';
  barVolColorMuted = '#bfbfbf';
  barVolColor = this.barVolColorUnmuted;

  babyMeatballColorUnmuted = '#384048';
  babyMeatballColorMuted = '#8c99a6';
  babyMeatballColor = this.babyMeatballColorUnmuted;

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

  reverseColorActive = '#8c99a6';
  reverseColorInactive = 'transparent';
  reverseColor = this.loopListColorInactive;

  /////////////////////////
  //PREPARATION FUNCTIONS//
  /////////////////////////

  prepareTheme(theme:BarThemesListInterface){
    let muted = localStorage.getItem('isMuted');
    let loop = localStorage.getItem('isLoop');
    let volume = localStorage.getItem('volVal');
    let velocity = localStorage.getItem('velVal');
    let listLoop = localStorage.getItem('isListLoop');
    let listRandom = localStorage.getItem('isListRandom');

    this.isReverse = false;
    this.reverseSrc = '';
    this.normalSrc = `../../../assets/${theme.id}.mp3`;
    this.audio.pause();
    this.audio = new Audio();
    this.audio.src = this.normalSrc;
    //this.audio.preload="metadata";
    this.audio.load();
    this.audio.onloadedmetadata = ()=>{
      this.audio.onloadeddata = ()=>{
        this.audio.onpause = ()=>{this.setPlay()}
        this.audio.onplay = ()=>{this.setPlay()}
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
        this.setReverse();

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

  setPlay(){

    if(this.audio.paused){
      this.barColor = (this.isReverse) ? this.barColorReversePause : this.barColorPause; 
      this.playButtonColor = this.playButtonColorPause
    }
    else{
      this.barColor = (this.isReverse) ? this.barColorReversePlay : this.barColorPlay;
      this.playButtonColor = this.playButtonColorPlay;
    }

  }

  setReverse(){
    if(this.isReverse){
      this.reverseColor = this.reverseColorActive
      this.barColor = (this.audio.paused) ? this.barColorReversePause : this.barColorReversePlay;
    }
    else{
      this.reverseColor = this.reverseColorInactive;
      this.barColor = (this.audio.paused) ? this.barColorPause : this.barColorPlay;
    }
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
      this.themesListRandom = BarUtils.randomizeList(this.themesList, this.position);
      this.position = 0;
      this.themesListActive = this.themesListRandom;
    }
    else{
      this.position = BarUtils.findActualPosition(this.themesListActive, this.position, this.themesList);
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
    let timeTotal = this.audio.duration;
    return timeActual * this.barAudioSize / timeTotal;

  }

  calculateAudioPosition(coorY:number){
    this.audio.currentTime = coorY * this.audio.duration / this.barAudioSize;
  }

  calculateVolumePosition(coorY:number){
    let vol = 
      (coorY / this.barVolumeSize > 1) 
        ? 1 
        : (coorY / this.barVolumeSize < 0.001)
          ? 0
          : coorY / this.barVolumeSize;
    this.audio.volume = vol;
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
    let volBarPosition = document.getElementById('vol-bar');
    let position = (volBarPosition) ? volBarPosition.offsetLeft : 0;
    event.preventDefault();

    if(event.clientX - position >= 0 && event.clientX - position <= this.barVolumeSize){
      this.pointVolumePosition = BarUtils.positionInBar(event.clientX, volBarPosition);
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
      this.barVolColor = this.barVolColorMuted;
      this.babyMeatballColor = this.babyMeatballColorMuted
    }
    else{
      //this.vol = this.vol.replace(/(<([^>]+)>)/gi, "");
      this.muteColor = this.muteColorUnmuted;
      this.barVolColor = this.barVolColorUnmuted;
      this.babyMeatballColor = this.babyMeatballColorUnmuted;
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
        this.pointAudioPosition = BarUtils.positionInBar(event.clientX, audioBarPosition);
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
    let movement = (!this.isReverse) ? this.calculeTimeBySeconds() : this.calculeTimeBySeconds(this.audio.duration - this.audio.currentTime);
    this.pointAudioPosition = movement;
    this.time = BarUtils.getSeconds((!this.isReverse) ? Math.trunc(this.audio.currentTime) : Math.trunc(this.audio.duration - this.audio.currentTime));
  }

  showTimePointer(event:MouseEvent){
    let item:HTMLElement | string = event.target as HTMLElement;
    let itemId = item.id;
    item = (itemId == 'Meatball' && item.parentElement) ? item.parentElement : item;
    if(itemId == 'audio-bar-padding' || itemId == 'Meatball' ){
      this.overBar = 'block';
      let positionInPage = BarUtils.positionInBar(event.clientX, item);
      let time = this.calculeTimeByPixel(positionInPage);
      this.timePointer = BarUtils.getSeconds(time);
      this.timePointerPosition = positionInPage;
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

  /////////////////////
  // BETA FUNCTIONS //
  ////////////////////

  revertAudioImplement(){

    this.loadGif = this.loadGifVisible;
    this.audioStatus = (this.audio.paused) ? false : true;

    if(this.audio.src != this.reverseSrc){
      this.audio.pause();
      (this.reverseSrc == '')
        ? this.revertAudio(this.audio.src).then(()=>{this.isReverse = true; this.switchSRC()})
        : (this.isReverse = true, this.switchSRC()) ;  
    }
    else{
      this.isReverse = false;
      this.switchSRC();
    }
  }

  switchSRC(){

    if(this.isReverse){

      this.loadGif = this.loadGifHidden;
      let time = this.audio.duration - this.audio.currentTime;
      this.audio.src = this.reverseSrc;
      this.audio.currentTime = time;

    }else{

      this.loadGif = this.loadGifHidden;
      let time = this.audio.duration - this.audio.currentTime;
      this.audio.src = this.normalSrc;
      this.audio.currentTime = time;

    }

    this.setReverse();
    (this.audioStatus) ? this.audio.play() : this.audio.pause();
    this.audioStatus = (this.audio.paused) ? false : true; 

  }

  revertAudio(src:string) {
    
    return new Promise(resolve=>{

      var context = new AudioContext();
      var xhr = new XMLHttpRequest(),
      method = "GET",
      url = src;

      xhr.open(method, url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onreadystatechange = ()=> this.xhrReady(xhr, context).then(()=>resolve(true));
      xhr.send();

    })

  }

  xhrReady(xhr: { readyState: number; status: number; response: any; }, context: { decodeAudioData: (arg0: any, arg1: (buffer: any) => void) => void; createBufferSource: () => any; }){

    return new Promise(resolve=>{

      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        context.decodeAudioData(xhr.response, (buffer)=>{
          var src = context.createBufferSource();
          Array.prototype.reverse.call(buffer.getChannelData(0));
          Array.prototype.reverse.call(buffer.getChannelData(1));
          src.buffer = buffer;
  
          var wav = AudiobufferToWav.audioBufferToWav(buffer);
          let blob = new Blob([wav],{type:'mp3'});
          let blobUrl = URL.createObjectURL(blob);
  
          this.reverseSrc = blobUrl;
  
          resolve(true);
          
        });
      }

    });

  }

}
