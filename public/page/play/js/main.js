import { Game } from "./game.js"

class Main{
  constructor(){
    new Game()
  }
}


switch(document.readyState){
  case "complete":
  case "interactive":
    new Main();break
  default:
    window.addEventListener("DOMContentLoaded", (()=>new Main()))
}