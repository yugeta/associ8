

export class IpUa{
  constructor(){
    this.ip()
    this.ua()
  }

  ip(){
    const elm = document.querySelector(`#ip`)
    if(!elm){return}
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => {
        elm.value = data.ip
      })
  }

  ua(){
    const elm = document.querySelector(`#user_agent`)
    if(!elm){return}
    elm.value = navigator.userAgent
  }
}