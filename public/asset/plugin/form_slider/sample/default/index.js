(function(){
  function MAIN(){
    let first_file = "step-1";
    this.slider = new $$form_slider({
      base_selector : ".studyfire-form",
      template_dir  : "./",
      first_file    : first_file,
      onSlide       : this.onSlide.bind(this),
      onTemplate    : this.onTemplate.bind(this),
      onButton_next : this.onButton_next.bind(this),
      onButton_prev : this.onButton_prev.bind(this),
      onButton_save : this.onButton_save.bind(this),
      onSubmit      : {},

      debug         : true
    });
  }

  MAIN.prototype.onSlide  = function(){
    console.log("onSlide");
  };
  MAIN.prototype.onTemplate  = function(){
    console.log("onTemplate");
  };
  MAIN.prototype.onButton_next  = function(){
    console.log("onButton_next");
  };
  MAIN.prototype.onButton_prev  = function(){
    console.log("onButton_prev");
  };
  MAIN.prototype.onButton_save  = function(){
    console.log("onButton_save");
  };


  // new MAIN();
  switch(document.readyState){
    case "complete" : new MAIN();break;
    default         : window.addEventListener("load" , function(){new MAIN()});break;
  }
})()