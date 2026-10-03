import { Asset }    from "./asset.js"

class Main{
  constructor(){
    this.init()
  }

  get html(){
    return document.querySelector('html')
  }

  get page_name(){
    return new Urlinfo().queries.p || "index"
  }

  async init(){
    await new Asset().init()
  }

  finish(){
    const status = this.html.getAttribute('data-status')
    if(status === 'loading'){
      this.html.removeAttribute('data-status')
    }
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
    break
  default:
    window.addEventListener("DOMContentLoaded" , (()=>new Main()))
}