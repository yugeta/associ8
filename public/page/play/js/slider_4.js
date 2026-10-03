import { Common } from "./common.js"

export class Slider_4{
  constructor(){
    this.init()
  }

  init(){
    let cache = window.localStorage.getItem(Common.name)
    if(!cache || cache === "[]"){return}
    let datas = JSON.parse(cache)
    if(!datas.length){return}
     let ul = document.querySelector(".slider[data-file='slider-4'] ul.history")
     if(!ul){return}
    for(let i=datas.length-1; i>=0; i--){
      let data = datas[i]
      let html = this.get_data2html(data)
      if(!html){continue}
      let li = document.createElement("li")
      li.innerHTML = html
      ul.appendChild(li)
    }
  }

  get_data2html(data){
    if(!data){return}
    let html = ""
    html += "<div class='entry'>"+ data["entry"] +"</div>"
    html += "<div class='word-0'>"+ data[0] +"</div>"
    html += "<div class='words' style='text-align:center;'>"
    for(let i=1; i<=8; i++){
      html += "<span data-num='"+i+"'>"+ (data[i] || "") +"</span>"
    }
    html += "</div>"
    return html
  }
}
