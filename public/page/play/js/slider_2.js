import { Timer } from "./timer.js"
import { Common }  from "./common.js"

export class Slider_2{
  constructor(){
    this.set_word0()
    new Timer().set_clear()
    this.set_event()
    this.first_word_check()
  }

  set_word0(){
    let urlinfo = new $$lib().urlinfo()
    if(!urlinfo.query.word){return}
    let word0_elm = this.elm_word0()
    word0_elm.textContent = decodeURI(urlinfo.query.word)
  }

  set_event(){
    let input_elm = this.elm_input()
    if(input_elm){
      input_elm.addEventListener("input" , this.input.bind(this))
      input_elm.addEventListener("keyup" , this.keyup.bind(this))
      input_elm.focus()
    }
    let word_table = this.elm_table()
    if(word_table){
      word_table.addEventListener("click" , this.click_table.bind(this))
    }
    let timer = this.elm_timer()
    if(timer){
      timer.addEventListener("click" , this.click_timer.bind(this))
    }
    let btn_back = document.querySelector("[data-file='slider-2'] button.back")
    if(btn_back){
      btn_back.addEventListener("click" , this.cancel.bind(this))
    }
  }

  cancel(){
    if(!confirm("書き込んだ内容を破棄して、タイトル画面に戻ってもよろしいですか？")){return}
    const url = new URLSearchParams(location.href).delete("word")
    window.history.pushState({}, '', url.href)
    Common.slider.move_view("slider-1","prev","")
  }

  elm_word0(){
    return document.querySelector("[data-file='slider-2'] .word-table .word-0")
  }

  elm_table(){
    return document.querySelector("[data-file='slider-2'] .word-table")
  }

  elm_input(){
    return document.querySelector("[data-file='slider-2'] input[name='word']")
  }

  elm_timer(){
    return document.querySelector("[data-file='slider-2'] .timer")
  }

  currentWord_num(){
    let elm = this.elm_word_active()
    if(!elm){return null}
    let num = elm.getAttribute("data-num")
    if(!num){return null}
    return ~~(num)
  }

  first_word_check(){
    let word0_elm = this.elm_word0()
    if(word0_elm.textContent === ""){return}
    this.nextWord()
  }

  elm_word_active(){
    return document.querySelector("[data-file='slider-2'] .word-table [data-active='1']")
  }

  num2elm(num){
    if(!num && num !== 0){return null;}
    return document.querySelector("[data-file='slider-2'] .word-table [data-num='"+num+"']")
  }

  keydown(){
    let input_elm = this.elm_input()
    if(input_elm){
      input_elm.focus()
    }
  };
  input(e){
    let word_target = this.elm_word_active()
    if(!word_target){return}
    word_target.textContent = e.target.value
  }
  keyup(e){
    if(!e || !e.keyCode){return}
    switch(e.keyCode){
      case 13: // enter
        this.nextWord()
        break
    }
  }
  
  nextWord(){
    if(this.check_word()){return}
    let input_elm = this.elm_input()
    if(!input_elm){return}
    let current_elm = this.elm_word_active()
    if(!current_elm){return}
    current_elm.removeAttribute("data-active")
    let empty_next = this.get_empty()
    if(!empty_next){
      this.finish_word()
      return
    }
    else{
      empty_next.setAttribute("data-active","1")
      input_elm.value = empty_next.textContent || ""
    }
    if(!this.timer && !Common.timer_start){
      this.timer = new Timer()
      this.timer.start_timer()
    }
  }

  get_empty(){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]")
    for(let target of targets){
      if(target.getAttribute("data-num") === "0"){continue}
      if(target.textContent !== ""){continue}
      return target
    }
  }

  moveWord(next_elm){
    if(!next_elm){return}
    let current_elm = this.elm_word_active()
    if(!current_elm){return}
    let input_elm = this.elm_input()
    if(input_elm){
      input_elm.focus()
    }
    if(next_elm.getAttribute("data-num") === "0"){return}
    // 現在が起点(num=0)の場合に、未記入の場合は移動できない。
    if(current_elm.getAttribute("data-num") === "0" && current_elm.textContent === ""){return}
    if(this.check_word()){return}
    
    current_elm.removeAttribute("data-active")
    next_elm.setAttribute("data-active","1")
    if(input_elm){
      input_elm.value = next_elm.textContent || ""
    }
    if(!this.timer && !Common.timer_start){
      this.timer = new Timer()
      this.timer.start_timer()
    }
  }

  finish_word(){
    this.get_datas()

    let targets = document.querySelectorAll(".word-table [data-num]")
    for(let target of targets){
      if(target.hasAttribute("data-active")){
        target.removeAttribute("data-active")
      }
    }
    Common.start_word = "";
    Common.slider.move_view("slider-3","next","")

    if(this.timer){
      this.timer.set_clear()
    }
  }

  check_word(){
    let current_elm = this.elm_word_active()
    if(!current_elm){return false}
    let current_val = current_elm.textContent.trim()
    if(current_val === ""){return false}
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]")
    for(let target of targets){
      if(target === current_elm){continue}
      if(target.textContent.trim() === current_val){
        return true
      }
    }
  }

  click_table(e){
    let word_area = new $$lib().upperSelector(e.target , "[data-file='slider-2'] .word-table [data-num]")
    if(!word_area){return}
    this.moveWord(word_area)
  }

  click_timer(e){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]")
    for(let target of targets){
      if(target.textContent === ""){
        return
      }
    }
    this.finish_word()
  }

  get_datas(){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]")
    let words = {}
    for(let target of targets){
      words[target.getAttribute("data-num")] = target.textContent
    }
    Common.words = words
    Common.time  = (+new Date()) - Common.timer_start
  }
}