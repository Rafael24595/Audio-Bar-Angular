import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  command = 'Oh Hey!'
  title = 'audio-bar';
  themeTitle = '';
  themeSrc = '';
 
  themeObservable(themeAsString:string){
    let theme = JSON.parse(themeAsString) as {id:string,name:string};
    this.themeTitle = theme.name;
    this.themeSrc = theme.id;
  }

}
