import { Common }  from "./common.js"

export class Timer{
  start_timer(){
    this.set_clear()
    Common.timer_start    = (+ new Date())
    Common.timer_interval = setInterval(this.view_timer.bind(this) , 10)
  }

  elm_timer(){
    if(!this.timer_elm){
      this.timer_elm = document.querySelector("[data-file='slider-2'] .timer")
    }
    return this.timer_elm
  }
  
  view_timer(){
    let current_timer = (+new Date()) - Common.timer_start
    let elm = this.elm_timer()
    elm.textContent = this.conv_timer_format(current_timer)
  }

  // return @ 時:分:秒
  conv_timer_format(current_timer){
    let sec  = Math.floor(current_timer / 1000)
    let ms   = Math.floor((current_timer - sec*1000) * 1000)
    let s    = sec % 60 || 0
    let min  = Math.floor((sec - s) / 60)
    let m    = min % 60 || 0
    return ("00" + m).slice(-2) +" min "+ ("00" + s).slice(-2) +" sec "+ String(ms).substr(0,2) +" ms"
  }

  set_clear(){
    if(Common.timer_start){
      delete Common.timer_start
    }
    if(Common.timer_interval){
      clearInterval(Common.timer_interval)
      delete Common.timer_interval
    }
  };
}