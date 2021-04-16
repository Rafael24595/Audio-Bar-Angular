import { BarThemesListInterface } from "src/app/interfaces/Bar-Themes-List";

export class BarUtils{

  public static positionInBar(cuersorPosition:number, item:HTMLElement | null){
    let overflow = 
    (item) 
      ? (Math.sign(item.getBoundingClientRect().x) < 0) 
        ? Math.abs(item.getBoundingClientRect().x) 
        : item.getBoundingClientRect().x * -1
      : 0 ;
    return cuersorPosition + overflow;
  }

    public static randomizeList(themesList:{id:string, name:string}[],position:number){
        let randomList = [];
        let themeListTransition:{id:string, name:string}[] = this.copyArray(themesList) as {id:string, name:string}[];
        randomList.push(themeListTransition[position]);
        themeListTransition.splice(position, 1);
        while(themeListTransition.length > 0){
          let random = Math.floor(Math.random() * themeListTransition.length);
          if(random < themeListTransition.length){
            randomList.push(themeListTransition[random]);
            themeListTransition.splice(random, 1);
          }
        }
        return randomList;
      }

      public static findActualPosition(themesListActive:BarThemesListInterface[],position:number,themesList:BarThemesListInterface[]){
        let actualId = themesListActive[position].id;
        let index = -1;
        themesList.find(theme=>{ index++; return (theme.id == actualId)})
        return index;
      }

      public static copyArray(array:object[]){
        let arrayCopy = [];
        for (const obj of array) {
          arrayCopy.push(obj);
        }
        return arrayCopy
      }

      public static getSeconds(time:number){
        let second:number | string = Math.floor((time * 1000 % (1000 * 60)) / 1000);
        let minute:number | string = Math.floor((time * 1000 % (1000 * 60 * 60)) / (1000 * 60))
        second = (second.toString().length > 1) ? second : `0${second}`;
        minute = (minute.toString().length > 1) ? minute : `0${minute}`;
    
        return minute + ':' + second;
      }

}