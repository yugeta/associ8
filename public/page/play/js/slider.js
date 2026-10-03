import { Common }  from "./common.js"
import { Slider_1 } from "./slider_1.js"
import { Slider_2 } from "./slider_2.js"
import { Slider_3 } from "./slider_3.js"
import { Slider_4 } from "./slider_4.js"

export class Slider{
  constructor(){
    this.init()
  }

  init(){
    let first_file = this.get_first_file()
    Common.slider = new window.$$form_slider({
      base_selector      : ".slider-wrap",
      template_selector  : ".template",
      first_file         : first_file,
      onSlide            : this.onSlide.bind(this),
      onSubmit      : {},
      debug         : false
    })
  }

  get_first_file(){
    const word = new URLSearchParams(location.search).get("word")
    return word ? "slider-2" : "slider-1"
  }

  onSlide(name ,e){
    if(!name){return}
    switch(name){
      case "slider-1": new Slider_1(); break
      case "slider-2": new Slider_2(); break
      case "slider-3": new Slider_3(); break
      case "slider-4": new Slider_4(); break
    }
  }

  onTemplate(e){
    console.log("onTemplate")
    console.log(e)
  }

  onButton_next(e){
    console.log("onButton_next")
    console.log(e)
  }

  onButton_prev(e){
    console.log("onButton_prev")
    console.log(e)
  }
  
  onButton_save(e){
    console.log("onButton_save")
    console.log(e)
  }
  
}