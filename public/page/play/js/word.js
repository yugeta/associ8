(function(){
  let options = {
    name : "associ8"
  };
  let common = {};

  function MAIN(){
    new UUID().get();
    this.load_video();
    this.set_event();
    new SLIDER();
  }

  function UUID(){
    
  }
  UUID.prototype.get = function(){
    if(typeof $$uuid === "undefined"){return null;}
    let key = options.name + "_uuid";
    let uuid = localStorage.getItem(key);
    if(!uuid){
      uuid = new $$uuid().make();
      localStorage.setItem(key , uuid);
    }
    return uuid;
  };


  MAIN.prototype.load_video = function(){
    let video_src = document.querySelector("input[name='video_1']").value;
    // if(window.innerWidth < 500){
    //   video_src = document.querySelector("input[name='video_2']").value;
    // }
    // else{
    //   video_src = document.querySelector("input[name='video_1']").value;
    // }
    let video_tag = document.querySelector("video.bg");
    if(video_tag){
      let src = document.createElement("source");
      src.src = video_src;
      video_tag.appendChild(src);
    }
  };
  MAIN.prototype.set_event = function(){

  };

  function SLIDER(){

    let first_file = this.get_first_file();

    common.slider = new $$form_slider({
      base_selector      : ".slider-wrap",
      template_selector  : ".template",
      first_file         : first_file,
      onSlide            : this.onSlide.bind(this),
      // onTemplate    : this.onTemplate.bind(this),
      // onButton_next : this.onButton_next.bind(this),
      // onButton_prev : this.onButton_prev.bind(this),
      // onButton_save : this.onButton_save.bind(this),
      onSubmit      : {},
      debug         : false
    });
  }

  SLIDER.prototype.get_first_file = function(){
    let urlinfo = new $$lib().urlinfo();
    if(urlinfo.query.word){
      return "slider-2";
    }
    else{
      return "slider-1";
    }
  };

  SLIDER.prototype.onSlide  = function(name ,e){
    if(!name){return;}
    switch(name){
      case "slider-1": new SLIDER_1(); break;
      case "slider-2": new SLIDER_2(); break;
      case "slider-3": new SLIDER_3(); break;
      case "slider-4": new SLIDER_4(); break;
    }
  };
  SLIDER.prototype.onTemplate  = function(e){
    console.log("onTemplate");
    console.log(e);
  };
  SLIDER.prototype.onButton_next  = function(e){
    console.log("onButton_next");
    console.log(e);
  };
  SLIDER.prototype.onButton_prev  = function(e){
    console.log("onButton_prev");
    console.log(e);
  };
  SLIDER.prototype.onButton_save  = function(e){
    console.log("onButton_save");
    console.log(e);
  };

  // ----------
  function SLIDER_1(){
    this.init();
    this.point_word();
  }
  SLIDER_1.prototype.init = function(){
    let input = document.querySelector("[data-file='slider-1'] input[name='word_0']");
    if(input){
      input.value = "";
    }
    let input_btn = document.querySelector("[data-file='slider-1'] button[name='input']");
    if(input_btn){
      input_btn.addEventListener("click" , this.click_input.bind(this));
    }
    let random = document.querySelector("[data-file='slider-1'] button[name='random']");
    if(random){
      random.addEventListener("click" , this.click_random.bind(this));
    }
  };
  SLIDER_1.prototype.click_input = function(e){
    let word_elm = document.querySelector("input[name='word_0']");
    if(!word_elm || !word_elm.value){return;}
    this.slider_next(word_elm.value);

  };
  SLIDER_1.prototype.click_random = function(e){
    new $$ajax({
      url : location.href,
      query : {
        php  : '\\page\\associ8\\contents\\test\\word::pick_word("random")',
        exit : true
      },
      onSuccess : (function(res){
        if(!res){return;}
        this.slider_next(res);
      }).bind(this)
    });
  };
  SLIDER_1.prototype.slider_next = function(word){
    if(!word){return;}
    let urlinfo = new $$lib().urlinfo();
    let url = urlinfo.url;
    let query = [];
    if(urlinfo.query){
      for(key in urlinfo.query){
        if(key === "word"){continue;}
        query.push(key+"="+urlinfo.query[key]);
      }
    }
    query.push("word="+ encodeURI(word));
    url += "?"+ query.join("&");
    window.history.pushState({}, '', url);
    common.slider.move_view("slider-2","next","");
  };
  SLIDER_1.prototype.point_word = function(){
    let urlinfo = new $$lib().urlinfo();
    if(!urlinfo.query.word){return;}
    let word0_elm = document.querySelector("[data-file='slider-1'] input[name='word_0']");
    if(word0_elm){
      word0_elm.value = decodeURI(urlinfo.query.word);
    }
  };


  // ----------
  function SLIDER_2(){
    this.set_word0();
    new TIMER().set_clear();
    this.set_event();

    // if(flg === false){return;}
    // 
    this.first_word_check();
    // if(!this.timer && !__options.timer_start){
    //   this.timer = new TIMER();
    //   this.timer.start_timer();
    // }
  }
  SLIDER_2.prototype.set_word0 = function(){
    let urlinfo = new $$lib().urlinfo();
    if(!urlinfo.query.word){return;}
    let word0_elm = this.elm_word0();
    word0_elm.textContent = decodeURI(urlinfo.query.word);
  };
  SLIDER_2.prototype.set_event = function(){
    let input_elm = this.elm_input();
    if(input_elm){
      // if(document.body.getAttribute("data-keydown-flg") !== "1"){
      //   document.body.setAttribute("data-keydown-flg","1");
      //   window.addEventListener("keydown" , this.keydown.bind(this));
      // }
      input_elm.addEventListener("input" , this.input.bind(this));
      input_elm.addEventListener("keyup" , this.keyup.bind(this));
      input_elm.focus();
    }
    let word_table = this.elm_table();
    if(word_table){
      word_table.addEventListener("click" , this.click_table.bind(this));
    }
    let timer = this.elm_timer();
    if(timer){
      timer.addEventListener("click" , this.click_timer.bind(this));
    }
    let btn_back = document.querySelector("[data-file='slider-2'] button.back");
    if(btn_back){
      btn_back.addEventListener("click" , this.cancel.bind(this));
    }
  };
  SLIDER_2.prototype.cancel = function(){
    if(!confirm("書き込んだ内容を破棄して、タイトル画面に戻ってもよろしいですか？")){return;}
    let urlinfo = new $$lib().urlinfo();
    let url = urlinfo.url;
    let query = [];
    if(urlinfo.query){
      for(key in urlinfo.query){
        if(key === "word"){continue;}
        query.push(key+"="+urlinfo.query[key]);
      }
    }
    url += "?"+ query.join("&");
    window.history.pushState({}, '', url);
    common.slider.move_view("slider-1","prev","");
  };
  SLIDER_2.prototype.elm_word0 = function(){
    return document.querySelector("[data-file='slider-2'] .word-table .word-0");
  };
  SLIDER_2.prototype.elm_table = function(){
    return document.querySelector("[data-file='slider-2'] .word-table");
  };
  SLIDER_2.prototype.elm_input = function(){
    return document.querySelector("[data-file='slider-2'] input[name='word']");
  };
  SLIDER_2.prototype.elm_timer = function(){
    return document.querySelector("[data-file='slider-2'] .timer");
  };
  SLIDER_2.prototype.currentWord_num = function(){
    let elm = this.elm_word_active();
    if(!elm){return null;}
    let num = elm.getAttribute("data-num");
    if(!num){return null;}
    return Number(num);
  };
  SLIDER_2.prototype.first_word_check = function(){
    let word0_elm = this.elm_word0();
    if(word0_elm.textContent === ""){return;}
    this.nextWord();
  };

  SLIDER_2.prototype.elm_word_active = function(){
    return document.querySelector("[data-file='slider-2'] .word-table [data-active='1']");
  };
  SLIDER_2.prototype.num2elm = function(num){
    if(!num && num !== 0){return null;}
    return document.querySelector("[data-file='slider-2'] .word-table [data-num='"+num+"']");
  };

  SLIDER_2.prototype.keydown = function(){
    let input_elm = this.elm_input();
    if(input_elm){
      input_elm.focus();
    }
  };
  SLIDER_2.prototype.input = function(e){
    let word_target = this.elm_word_active();
    if(!word_target){return;}
    word_target.textContent = e.target.value;
  };
  SLIDER_2.prototype.keyup = function(e){
    if(!e || !e.keyCode){return;}
    switch(e.keyCode){
      case 13: // enter
        this.nextWord();
        break;
    }
  };
  
  SLIDER_2.prototype.nextWord = function(){
    if(this.check_word()){return;}
    let input_elm = this.elm_input();
    if(!input_elm){return;}
    let current_elm = this.elm_word_active();
    if(!current_elm){return;}
    // let current_num = this.currentWord_num();
    current_elm.removeAttribute("data-active");
    // let next_num = current_num+1;
    let empty_next = this.get_empty();
    if(!empty_next){
      this.finish_word();
      return;
    }
    else{
      empty_next.setAttribute("data-active","1");
      input_elm.value = empty_next.textContent || "";
    }
    // if(next_num === 9){
    //   this.finish_word();
    //   return;
    // }
    // let next_elm = this.num2elm(empty_next);
    // if(!next_elm){return;}
    // next_elm.setAttribute("data-active","1");
    // input_elm.value = next_elm.textContent || "";
    
    if(!this.timer && !common.timer_start){
      this.timer = new TIMER();
      this.timer.start_timer();
    }
  };
  SLIDER_2.prototype.get_empty = function(){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]");
    for(let target of targets){
      if(target.getAttribute("data-num") === "0"){continue;}
      if(target.textContent !== ""){continue;}
      return target;
    }
  };

  SLIDER_2.prototype.moveWord = function(next_elm){
    if(!next_elm){return;}
    let current_elm = this.elm_word_active();
    if(!current_elm){return;}
    let input_elm = this.elm_input();
    if(input_elm){
      input_elm.focus();
    }
    if(next_elm.getAttribute("data-num") === "0"){return;}
    // 現在が起点(num=0)の場合に、未記入の場合は移動できない。
    if(current_elm.getAttribute("data-num") === "0" && current_elm.textContent === ""){return;}
    if(this.check_word()){return;}
    
    current_elm.removeAttribute("data-active");
    next_elm.setAttribute("data-active","1");
    if(input_elm){
      input_elm.value = next_elm.textContent || "";
    }
    if(!this.timer && !common.timer_start){
      this.timer = new TIMER();
      this.timer.start_timer();
    }
  };
  SLIDER_2.prototype.finish_word = function(){
    this.get_datas();
    // console.log(__options.words);

    let targets = document.querySelectorAll(".word-table [data-num]");
    for(let target of targets){
      if(target.hasAttribute("data-active")){
        target.removeAttribute("data-active");
      }
    }
    common.start_word = "";
    common.slider.move_view("slider-3","next","");

    if(this.timer){
      this.timer.set_clear();
    }
  };

  SLIDER_2.prototype.check_word = function(){
    let current_elm = this.elm_word_active();
    if(!current_elm){return false;}
    let current_val = current_elm.textContent.trim();
    if(current_val === ""){return false;}
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]");
    for(let target of targets){
      if(target === current_elm){continue;}
      if(target.textContent.trim() === current_val){
        return true;
      }
    }
  };

  SLIDER_2.prototype.click_table = function(e){
    let word_area = new $$lib().upperSelector(e.target , "[data-file='slider-2'] .word-table [data-num]");
    if(!word_area){return;}
    this.moveWord(word_area);
  };

  SLIDER_2.prototype.click_timer = function(e){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]");
    for(let target of targets){
      if(target.textContent === ""){
        return;
      }
    }
    // alert("終了です。");
    this.finish_word();
  };

  SLIDER_2.prototype.get_datas = function(){
    let targets = document.querySelectorAll("[data-file='slider-2'] .word-table [data-num]");
    let words = {};
    for(let target of targets){
      words[target.getAttribute("data-num")] = target.textContent;
    }
    common.words = words;
    common.time  = (+new Date()) - common.timer_start;
  };


  function TIMER(){}
  TIMER.prototype.start_timer = function(){
    this.set_clear();
    common.timer_start    = (+ new Date());
    common.timer_interval = setInterval(this.view_timer.bind(this) , 10);
  };
  TIMER.prototype.elm_timer = function(){
    if(!this.timer_elm){
      this.timer_elm = document.querySelector("[data-file='slider-2'] .timer");
    }
    return this.timer_elm;
  };
  
  TIMER.prototype.view_timer = function(){
    let current_timer = (+new Date()) - common.timer_start;
    let elm = this.elm_timer();
    elm.textContent = this.conv_timer_format(current_timer);
  };
  // return @ 時:分:秒
  TIMER.prototype.conv_timer_format = function(current_timer){
    let sec  = Math.floor(current_timer / 1000);
    let ms   = Math.floor((current_timer - sec*1000) * 1000);
    let s    = sec % 60 || 0;
    let min  = Math.floor((sec - s) / 60);
    let m    = min % 60 || 0;
    return ("00" + m).slice(-2) +" min "+ ("00" + s).slice(-2) +" sec "+ String(ms).substr(0,2) +" ms";
  };
  TIMER.prototype.set_clear = function(){
    if(common.timer_start){
      delete common.timer_start;
    }
    if(common.timer_interval){
      clearInterval(common.timer_interval);
      delete common.timer_interval;
    }
  };


  // ----------
  function SLIDER_3(){
    this.view();
    this.data_cache();
    new COMMON().url_word_clear();
  }
  SLIDER_3.prototype.view = function(){
    let elms = document.querySelectorAll(".slider[data-file='slider-3'] .word[data-num]");
    for(elm of elms){
      let num = elm.getAttribute("data-num");
      if(!num || !common.words || !common.words[num]){continue;}
      elm.textContent = common.words[num];
    }
    let time_sec_elm = document.querySelector(".slider[data-file='slider-3'] .timer-area .timer-val");
    if(time_sec_elm){
      time_sec_elm.textContent = common.time;
    }
    let time_format_elm = document.querySelector(".slider[data-file='slider-3'] .timer-area .timer-format");
    if(time_format_elm){
      time_format_elm.textContent = new TIMER().conv_timer_format(common.time);
    }
  };
  SLIDER_3.prototype.data_cache = function(){
    if(!common.words){return;}
    common.words.entry = (+new Date());

    let cache_data = window.localStorage.getItem(options.name) || "[]";
    let data = JSON.parse(cache_data);
    data.push(common.words);

    // 上限○件の進捗以外は削除する？


    window.localStorage.setItem(options.name , JSON.stringify(data));

// console.log(data);
    this.data_save(common.words);
  };

  SLIDER_3.prototype.data_save = function(data){
    let uuid      = new UUID().get();
    let word_data = [
      data[0],
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      data[7],
      data[8]
    ];
    let word_id   = data.entry;
    if(!uuid){return;}
    new $$ajax({
      url : location.href,
      query : {
        php  : '\\page\\associ8\\common\\word::save("'+uuid+'")',
        word_id : word_id,
        data    : JSON.stringify(word_data),
        exit : true
      },
      onSuccess : (function(res){
console.log(res);
      }).bind(this)
    });
  };


  // ----------
  function SLIDER_4(){
    this.init();
  };
  SLIDER_4.prototype.init = function(){
    let cache = window.localStorage.getItem(options.name);
    if(!cache || cache === "[]"){return;}
    let datas = JSON.parse(cache);
    if(!datas.length){return}
     let ul = document.querySelector(".slider[data-file='slider-4'] ul.history");
     if(!ul){return;}
    for(let i=datas.length-1; i>=0; i--){
      let data = datas[i];
      let html = this.get_data2html(data);
      if(!html){continue;}
      let li = document.createElement("li");
      li.innerHTML = html;
      ul.appendChild(li);
    }
  };
  SLIDER_4.prototype.get_data2html = function(data){
    if(!data){return;}
    let html = "";
    // html += "<div class='center' style='text-align:center;'>";
    html += "<div class='entry'>"+ data["entry"] +"</div>";
    html += "<div class='word-0'>"+ data[0] +"</div>";
    // html += "</div>";
    html += "<div class='words' style='text-align:center;'>";
    for(let i=1; i<=8; i++){
      html += "<span data-num='"+i+"'>"+ (data[i] || "") +"</span>";
    }
    html += "</div>";
    return html;
  };

  function COMMON(){}
  COMMON.prototype.url_word_clear = function(){
    let urlinfo = new $$lib().urlinfo();
    let url = urlinfo.url;
    let query = [];
    if(urlinfo.query){
      for(key in urlinfo.query){
        if(key === "word"){continue;}
        query.push(key+"="+urlinfo.query[key]);
      }
    }
    url += "?"+ query.join("&");
    window.history.pushState({}, '', url);
  };


  switch(document.readyState){
    case "complete" : new MAIN();break;
    default : window.addEventListener("load" , function(){new MAIN()});break;
  }
})()