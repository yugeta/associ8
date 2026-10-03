import { Common }  from "./common.js"
import { Timer } from "./timer.js"

export class Slider_3{
  constructor(){
    this.view()
    this.data_cache()
    new Common().url_word_clear()
  }

  view(){
    let elms = document.querySelectorAll(".slider[data-file='slider-3'] .word[data-num]")
    for(const elm of elms){
      let num = elm.getAttribute("data-num")
      if(!num || !Common.words || !Common.words[num]){continue}
      elm.textContent = Common.words[num]
    }
    let time_sec_elm = document.querySelector(".slider[data-file='slider-3'] .timer-area .timer-val")
    if(time_sec_elm){
      time_sec_elm.textContent = Common.time
    }
    let time_format_elm = document.querySelector(".slider[data-file='slider-3'] .timer-area .timer-format")
    if(time_format_elm){
      time_format_elm.textContent = new Timer().conv_timer_format(Common.time)
    }
  }

  data_cache(){
    if(!Common.words){return;}
    Common.words.entry = (+new Date())
    let cache_data = window.localStorage.getItem(Common.name) || "[]"
    let data = JSON.parse(cache_data)
    data.push(Common.words)
    // 上限○件の進捗以外は削除する？
    window.localStorage.setItem(Common.name , JSON.stringify(data))
    this.data_save(Common.words)
  }


  data_save(data){
    console.log(data)
    // let uuid      = new UUID().get()
    // let word_data = [
    //   data[0],
    //   data[1],
    //   data[2],
    //   data[3],
    //   data[4],
    //   data[5],
    //   data[6],
    //   data[7],
    //   data[8],
    // ]
    // let word_id   = data.entry
    // if(!uuid){return}

    // const body = new URLSearchParams({
    //   php     : '\\page\\associ8\\common\\word::save("'+uuid+'")',
    //   word_id : word_id,
    //   data    : JSON.stringify(word_data),
    //   exit    : true,
    // })

    // fetch(location.href, {
    //   method  : "POST",
    //   headers : {
    //     "Content-Type" : "application/x-www-form-urlencoded",
    //   },
    //   body,
    // })
    // .then((res) => res.text())
    // .then((res) => {
    //   console.log(res)
    // })
    // .catch((error) => {
    //   console.error(error)
    // })
  };

}