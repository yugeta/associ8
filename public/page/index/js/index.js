(function(){
  function MAIN(){
    this.set_event();
  }
  MAIN.prototype.set_event = function(){
    let btns = document.querySelectorAll("button.link");
    for(btn of btns){
      btn.addEventListener("click" , this.click_start.bind(this));
    }
  };
  MAIN.prototype.click_start = function(){
    let urlinfo = new $$lib().urlinfo();
    location.href = urlinfo.url + "?p=play";
  };

  switch(document.readyState){
    case "complete" : new MAIN();break;
    default : window.addEventListener("load" , function(){new MAIN()});break;
  }
})()