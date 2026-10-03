import { Data } from "./data.js"
import { Common }  from "./common.js"

export class Slider_1{
  constructor(){
    this.init();
    this.point_word();
  }

  init(){
    let input = document.querySelector("[data-file='slider-1'] input[name='word_0']");
    if(input){
      input.value = "";
    }
    let input_btn = document.querySelector("[data-file='slider-1'] button[name='input']");
    if(input_btn){
      input_btn.addEventListener("click" , this.click_input.bind(this));
    }
    let random = document.querySelector("[data-file='slider-1'] button[name='random']");
    if(random){
      random.addEventListener("click" , this.click_random.bind(this));
    }
  }

  click_input(e){
    let word_elm = document.querySelector("input[name='word_0']");
    if(!word_elm || !word_elm.value){return;}
    this.slider_next(word_elm.value);

  }

  click_random(e){
    const num = Math.floor(Math.random() * Data.length) + 1
    const word = Data[num].word
    console.log(word)
    this.slider_next(word);
  }

  slider_next(word){
    if(!word){return;}
    const url = new URL(location.href);
    url.searchParams.set("word", word);
    window.history.pushState({}, '', url.href);
    Common.slider.move_view("slider-2","next","");
  }

  point_word(){
    let urlinfo = new $$lib().urlinfo();
    if(!urlinfo.query.word){return;}
    let word0_elm = document.querySelector("[data-file='slider-1'] input[name='word_0']");
    if(word0_elm){
      word0_elm.value = decodeURI(urlinfo.query.word);
    }
  }
}