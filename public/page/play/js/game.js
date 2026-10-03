import { Slider } from "./slider.js"

export class Game{
  constructor(){
    this.init()
  }

  name = "assosi8"

  get elm_video(){
    return document.querySelector("input[name='video_1']")
  }

  get elm_video_bg(){
    return document.querySelector("input[name='video_1']")
  }

  init(){
    this.load_video()
    new Slider();
  }

  uuid(){
    return crypto.randomUUID();
  }

  load_video(){
    let video_src = this.elm_video?.value
    let video_tag = this.elm_video_bg
    if(this.elm_video_bg){
      let src = document.createElement("source")
      src.src = this.elm_video_bg
      video_tag.appendChild(src)
    }
  }

  // /**
  //  * スライダーの初期化
  //  */

  // slider(){
  //   let first_file = this.get_first_file()
  //   this.common.slider = new window.$$form_slider({
  //     base_selector      : ".slider-wrap",
  //     template_selector  : ".template",
  //     first_file         : first_file,
  //     onSlide            : this.onSlide.bind(this),
  //     onSubmit      : {},
  //     debug         : false
  //   })
  // }

  // get_first_file(){
  //   const word = new URLSearchParams(location.search).get("word")
  //   return word ? "slider-2" : "slider-1"
  // }

  // onSlide(name ,e){
  //   if(!name){return}
  //   switch(name){
  //     case "slider-1": new Slider_1(); break
  //     case "slider-2": new Slider_2(); break
  //     case "slider-3": new Slider_3(); break
  //     case "slider-4": new Slider_4(); break
  //   }
  // }



}