window.$$scroll_action = (function(){
  let __options = {
    id               : "mynt-lp",
    selector         : ".text-appear",
    target_className : "text-appear-word",

    appear_fade      : 1,   // 0:表示したまま , 1:Fade-in
    appear_duration  : 500, // *ms
    appear_delay     : 0,   // *ms
    appear_move      : 50,  // px
    appear_way       : "right",
    appear_motion    : "bounce", // "bouce"(default)跳ね返る , "linear"直線移動 , "over-bounce"大きく跳ね返る , "small-bounce"小さく跳ね返る
    underline_color  : "rgba(255,0,0,0.5)",
    underline_duration : 1000,

    modules          : [""]
  };

  // ----------
  // MAIN proccess
  function MAIN(options){
    this.options = this.set_options(options);

    this.options.script_tag = this.get_modules();
    if(!this.options.script_tag){
      console.log("No script-tag. rel='"+this.options.id+"'");
      return;
    }
    // if(this.options.script_tag.hasAttribute("data-cid") && this.options.script_tag.hasAttribute("data-pid")){
    //   this.load_setting(this.options.script_tag.getAttribute("data-cid") , this.options.script_tag.getAttribute("data-pid"));
    // }
    // else if(this.options.script_tag.hasAttribute("data-setting-url")){
    //   this.load_setting_file(this.options.script_tag.getAttribute("data-setting-url"));
    // }
    // else{
      this.init();
      this.load_modules();
    // }
    
  }
  MAIN.prototype.load_setting = function(cid , pid){
    if(!cid || !pid){
      console.log("Error ! cid:"+ cid +" , pid:"+ pid);
      return;
    }
    let urlinfo = new LIB("urlinfo" , this.options.script_tag.src);
    let php = urlinfo.dir + this.options.script_tag.getAttribute("rel") + ".php";
    new $$ajax({
      url : php,
      query : {
        mode : "s",
        cid  : cid,
        pid  : pid
      },
      onSuccess : this.loaded_setting.bind(this)
    });
  };
  
  MAIN.prototype.loaded_setting = function(res){
    if(!res){
      console.log("Error. no setting.");
      return;
    }
    let data = JSON.parse(res);
    if(data.status !== "ok" || !data.setting){
      console.log("Error. "+ res);
      return;
    }
    let setting = JSON.parse(data.setting);
    this.set_settings(setting);
  };
  MAIN.prototype.load_setting_file = function(url){
    if(!url){
      console.log("Error ! url");
      return;
    }
    new $$ajax({
      url : url,
      get : "GET",
      onSuccess : this.loaded_setting_file.bind(this)
    });
  };
  MAIN.prototype.loaded_setting_file = function(res){
    if(!res){
      console.log("Error. no setting.");
      return;
    }
    let setting = JSON.parse(res);
    this.set_settings(setting);
  };
  MAIN.prototype.set_settings = function(setting_datas){
    if(setting_datas.lists){
      for(let setting of setting_datas.lists){
        this.set_setting(setting);
      }
    }
    // this.init();
    this.load_modules();
  };
  MAIN.prototype.set_setting = function(setting){
    if(!setting.selector){return;}
    let target = document.querySelector(setting.selector);
    if(!target){return;}
    if(setting.type){
      target.classList.add(setting.type);
      if(setting.datas){
        for(let i in setting.datas){
          target.setAttribute(i , setting.datas[i]);
        }
      }
    }
  };


  MAIN.prototype.init = function(){
    this.event();
    this.hash_link_event_set();

    // text-appear
    this.text_appear();

    // elements-appear
    this.elements_appear();

    // slide-appear
    this.slide_appear();

    // fixed
    this.fixed_appear();

    // underline
    this.underline_appear();

    // scroll-behavior
    this.scroll_vihavior();

    // infinite-scroll
    this.infinite_scroll_set();

    // carousel
    this.carousel_set();

    // callbacks

    // 初期表示処理
    setTimeout(this.scroll.bind(this) , 0);
  };
  
  MAIN.prototype.set_options = function(options){
    let new_options = __options;
    if(options){
      new_options = new_options.concat(options);
    }
    return new_options;
  };
  MAIN.prototype.get_modules = function(){
    let script = document.querySelector("script[rel='"+__options.id+"']");
    return script;
  };
  MAIN.prototype.load_modules = function(){
    let script = this.get_modules();
    if(!script){
      console.log("Error ! no script.");
      return;
    }

    // 同名cssを読み込み
    let urlinfo = new LIB("urlinfo" ,script.getAttribute("src"));
    // if(urlinfo.file.indexOf(__options.id +".js") !== -1){
      let query_value = "";
      if(Object.keys(urlinfo.query).length >= 1){
        let querys = [];
        for(let i in urlinfo.query){
          querys.push(i+"="+urlinfo.query[i]);
        }
        query_value = "?" + querys.join("&");
      }
      // this.load_modules_css(urlinfo.dir + __options.id +".css" + query_value , script);
      // break;
    // }
  };
  MAIN.prototype.load_modules_css = function(url , script){
    if(document.querySelector("link[rel='"+ this.options.id +"']")){
      this.init();
      return;
    }
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = this.init.bind(this);
    script.parentNode.insertBefore(link , script);
    return true;
  };
  MAIN.prototype.event = function(){
    // console.log(typeof document.body.onscroll);
    // console.log(typeof window.onscroll);
    // dardoly構成でスマホではwindow.onscrollが正常に動作しないため、document.bodyを追加している。
    window.addEventListener("scroll" , this.scroll.bind(this));
    // document.body.addEventListener("scroll" , this.scroll.bind(this));

    window.addEventListener("resize" , (function(){
      if(this.infinite_scroll_proc){
        clearTimeout(this.infinite_scroll_proc);
      }
      this.infinite_scroll_proc = setTimeout(this.infinite_scroll_copy.bind(this) , 100);
      this.scroll()
    }).bind(this));
  };
  

  // -----
  // scroll-event
  MAIN.prototype.scroll = function(e){
    this.scroll_text_appear();
    this.scroll_elements_appear();
    this.scroll_slide_appear();
    this.scroll_fixed_appear();
    this.scroll_underline_appear();
    this.carousel_button_pos_all();
  };
  MAIN.prototype.scroll_text_appear = function(e){
    
    // 対象エレメントがページ表示エリアに入った場合にフラグを立てる
    let elms = document.querySelectorAll(".text-appear");

    for(let elm of elms){
      // 繰り返し無し設定の場合は１度きりの表示
      if(elm.getAttribute("data-repeat") === "0"
      && elm.getAttribute("data-anim") === "1"){continue;}

      let bool = this.check_scroll_element_pos(elm);
      if(bool === true
      && elm.getAttribute("data-anim") !== "1"){
        elm.setAttribute("data-anim" , "1");
      }
      else if(bool !== true
      && elm.getAttribute("data-anim") === "1"){
        elm.setAttribute("data-anim" , "0");
      }
    }
  };

  // エレメント座標が表示画面エリアに入ったかどうかの判定
  MAIN.prototype.check_scroll_element_pos = function(elm){
    if(!elm){return;}
    var h = this.get_pageheight();

    let rect = elm.getBoundingClientRect();

    // 画面上部から下部に入っているか判定
    if(rect.top < h
    && rect.top + rect.height > 10){
      return true;
    }
    else{
      return false;
    }
  };

  MAIN.prototype.get_scroll_y = function(){
    // console.log(document.scrollingElement.scrollTop);
    return document.scrollingElement.scrollTop;
  };
  MAIN.prototype.get_pageheight = function(){
    return window.innerHeight;
  };
  MAIN.prototype.get_pagesize = function(){
    return document.scrollingElement.scrollHeight;
  }

  MAIN.prototype.get_appear_options = function(elm){
    let options = {};
    // delay
    if(elm.hasAttribute("data-appear-delay")){
      let num  = elm.getAttribute("data-appear-delay")
      options.appear_delay = num.match(/^\d+?$/) ? num +"ms" : num;
    }
    else{
      options.appear_delay = this.options.appear_delay +"ms";
    }
    // move
    if(elm.hasAttribute("data-appear-move")){
      options.appear_move = elm.getAttribute("data-appear-move") +"px";
    }
    else{
      options.appear_move = this.options.appear_move +"px";
    }
    // duration
    if(elm.hasAttribute("data-appear-duration")){
      let num  = elm.getAttribute("data-appear-duration")

      options.appear_duration = num.match(/^\d+?$/) ? num +"ms" : num;
    }
    else{
      options.appear_duration = this.options.appear_duration +"ms";
    }
    // way
    if(elm.hasAttribute("data-appear-way")){
      options.appear_way = elm.getAttribute("data-appear-way");
    }
    else{
      options.appear_way = this.options.appear_way;
    }
    // motion
    if(elm.hasAttribute("data-appear-motion")){
      options.appear_motion = elm.getAttribute("data-appear-motion");
    }
    else{
      options.appear_motion = this.options.appear_motion;
    }
    // fade
    if(elm.hasAttribute("data-appear-fade")){
      options.appear_fade = elm.getAttribute("data-appear-fade");
    }
    else{
      options.appear_fade = this.options.appear_fade;
    }

    return options;
  };

  // -----
  // text-appear
  MAIN.prototype.text_appear = function(){
    let elms = document.querySelectorAll(".text-appear");
    for(let elm of elms){
      let options = this.get_appear_options(elm);
      this.set_split_value(elm , options);
    }
  };
  MAIN.prototype.set_split_value = function(elm , options){
    if(!elm || !elm.innerHTML){return;}
    if(elm.getAttribute("data-setted-textAppear") === "1"){return;}

    let new_elm = document.createElement("div");
    let num = 0;
    while(elm.innerHTML){
      let delay_num = (num * Number(options.appear_delay.replace("ms","")));
      switch(elm.firstChild.nodeType){
        // element
        case 1:
          let target = elm.firstChild;
          target.style.setProperty("animation-delay" , delay_num +"ms","");
          target.style.setProperty("transform" , "translateY("+ options.appear_move +")","");
          target.style.setProperty("animation-duration" , options.appear_duration ,"");
          target.classList.add("text-appear-word");
          new_elm.appendChild(target);
          num++;
          break;
        // text
        case 3:
          let word = elm.firstChild.textContent.slice(0,1);
          elm.firstChild.textContent = elm.firstChild.textContent.slice(1);
          // 改行コード
          if(word === "\n"){
            let new_text = document.createTextNode(word);
            new_elm.appendChild(new_text);
          }
          // 文字列
          else{
            let span = document.createElement("span");
            span.className = "text-appear-word";
            span.style.setProperty("animation-delay" , delay_num +"ms","");
            span.style.setProperty("transform" , "translateY("+ options.appear_move +")","");
            span.style.setProperty("animation-duration" , options.appear_duration ,"");
            span.textContent = word;
            new_elm.appendChild(span);
            num++;
          }
          if(elm.firstChild.textContent === ""){
            elm.removeChild(elm.firstChild);
          }
          break;
      }
    }
    elm.innerHTML = new_elm.innerHTML;
    elm.setAttribute("data-view","1");
    elm.setAttribute("data-setted-textAppear" , "1");
  };

  

  // -----
  // elements-appear
  MAIN.prototype.elements_appear = function(e){
    let areas = document.querySelectorAll(".elements-appear");
    for(let area of areas){
      if(area.getAttribute("data-setted-textAppear") === "1"){continue;}
      let options = this.get_appear_options(area);
      let elms = area.querySelectorAll(":scope > *");
      let num = 0;
      for(let elm of elms){
        let delay_num = (num *  Number(options.appear_delay.replace("ms","")));
        elm.style.setProperty("animation-delay" , delay_num +"ms");
        elm.style.setProperty("transform" , "translateY("+ options.appear_move +")","");
        elm.style.setProperty("animation-duration" , options.appear_duration ,"");
        elm.classList.add("text-appear-word");
        num++;
      }
      area.setAttribute("data-view","1");
      area.setAttribute("data-setted-textAppear" , "1");
    }
  };

  MAIN.prototype.scroll_elements_appear = function(e){
    
    // 対象エレメントがページ表示エリアに入った場合にフラグを立てる
    let elms = document.querySelectorAll(".elements-appear");

    for(let elm of elms){
      // 繰り返し無し設定の場合は１度きりの表示
      if(elm.getAttribute("data-repeat") === "0"
      && elm.getAttribute("data-anim") === "1"){continue;}

      let bool = this.check_scroll_element_pos(elm);
      if(bool === true
      && elm.getAttribute("data-anim") !== "1"){
        elm.setAttribute("data-anim" , "1");
      }
      else if(bool !== true
      && elm.getAttribute("data-anim") === "1"){
        elm.setAttribute("data-anim" , "0");
      }
    }
  };

  // -----
  // slide-appear
  MAIN.prototype.slide_appear = function(){
    let elms = document.querySelectorAll(".slide-appear");
    for(let elm of elms){
      this.set_slide_appear(elm);
      elm.setAttribute("data-view","1");
      elm.setAttribute("data-duration-textAppear" , "1");

      elm.parentNode.style.setProperty("overflow-x","hidden","");
      elm.parentNode.style.setProperty("overflow-y","hidden","");
      // elm.parentNode.classList.add("no-scroll-bar");
    }
  };
  MAIN.prototype.set_slide_appear = function(elm){
    let options = this.get_appear_options(elm);
    elm.style.setProperty("animation-fade" , options.appear_fade);
    elm.style.setProperty("transition-delay"    , options.appear_delay);
    elm.style.setProperty("transition-duration" , options.appear_duration);

    switch(options.appear_way){
      case "top":
        elm.style.setProperty("transform" , "translate(0 , -"+ options.appear_move +")" , "");
        break;
      case "bottom":
        elm.style.setProperty("transform" , "translate(0 , "+ options.appear_move +")" , "");
        break;
      case "left":
        elm.style.setProperty("transform" , "translate(-"+ options.appear_move +" , 0)" , "");
        break;
      case "right":
      default:
        elm.style.setProperty("transform" , "translate("+ options.appear_move +" , 0)" , "");
        break;
    }

  };
  MAIN.prototype.scroll_slide_appear = function(e){
    
    // 対象エレメントがページ表示エリアに入った場合にフラグを立てる
    let elms = document.querySelectorAll(".slide-appear");

    for(let elm of elms){
      // 繰り返し無し設定の場合は１度きりの表示
      if(elm.getAttribute("data-repeat") === "0"
      && elm.getAttribute("data-anim") === "1"){continue;}

      let bool = this.check_scroll_element_pos(elm);
      if(bool === true
      && elm.getAttribute("data-anim") !== "1"){
        elm.setAttribute("data-anim" , "1");
      }
      else if(bool !== true
      && elm.getAttribute("data-anim") === "1"){
        elm.setAttribute("data-anim" , "0");
      }
    }
  };

  // -----
  // slide-appear
  MAIN.prototype.fixed_appear = function(){
    let elms = document.querySelectorAll(".fixed-appear");
    if(!elms || !elms.length){return;}
    for(let elm of elms){
      if(elm.getAttribute("data-setted-textAppear") === "1"){continue;}
      let options = this.fixed_options(elm);
      if(!options){continue;}
      elm.style.setProperty("transition-duration", options.duration ,"");
      elm.setAttribute("data-view","1");
      elm.setAttribute("data-setted-textAppear" , "1");
    }
    
  };
  MAIN.prototype.fixed_options = function(elm){
    if(!elm){return;}
    let options = {};
    // duration
    if(elm.hasAttribute("data-appear-duration")){
      options.duration = elm.getAttribute("data-appear-duration") + "ms";
    }
    else{
      options.duration = "300ms";
    }

    // range
    if(elm.hasAttribute("data-appear-rangeY")){
      let window_h = window.innerHeight;
      let page_h   = this.get_pagesize() - window_h;
      let ranges = elm.getAttribute("data-appear-rangeY")
      options.type = "row";
      let sp       = ranges.split(",");
      // from
      if(sp[0].match(/%$/)){
        let num = Number(sp[0].replace("%",""));
        if(num >= 0){
          num = ~~((page_h) * num) /100;
        }
        else{
          num = ~~((page_h) * (100 + num)) /100;
        }
        sp[0] = num;
      }
      else{
        let num = Number(sp[0].replace("px",""));
        if(num < 0){
          num = page_h - num;
        }
        sp[0] = num;
      }
      // to
      if(sp[1].match(/%$/)){
        let num = Number(sp[1].replace("%",""));
        if(num >= 0){
          sp[1] = ~~((page_h) * num) / 100;
        }
        else{
          sp[1] = ~~((page_h) * (100 + num)) / 100;
        }
      }
      else{
        let num = Number(sp[1].replace("px",""));
        if(num < 0){
          num = page_h - num;
        }
        sp[1] = num;
      }
      options.from = sp[0];
      options.to   = sp[1];
    }
    else if(elm.hasAttribute("data-appear-selector")){
      let selector = elm.getAttribute("data-appear-selector");
      let elms     = document.querySelectorAll(selector);
      if(elms && elms.length){
        options.type = "selector";
        options.rects = [];
        for(let elm of elms){
          let rect = elm.getBoundingClientRect();
          options.rects.push(rect);
        }
      }
    }

    return options;
  };
  MAIN.prototype.scroll_fixed_appear = function(e){
    let elms = document.querySelectorAll(".fixed-appear");
    if(!elms || !elms.length){return;}
    let scroll_y = this.get_scroll_y();
    let window_h = window.innerHeight;
    for(let elm of elms){
      let options = this.fixed_options(elm);
      if(!options){continue;}
      switch(options.type){
        case "row":
          if(options.from <= scroll_y
          && scroll_y <= options.to){
            elm.setAttribute("data-anim" , "1");
          }
          else{
            elm.setAttribute("data-anim" , "0");
          }
          break;

        case "col":
          break;
        
        case "selector":
          if(options.rects){

            for(let rect of options.rects){
              if((rect.top - window_h) <= 0 && (rect.top + rect.height) >= 0){
                elm.setAttribute("data-anim" , "1");
                break;
              }
              else{
                elm.setAttribute("data-anim" , "0");
              }
            }
          }
          break;
      }
    }
  };
  
  // ----------
  // underline
  MAIN.prototype.underline_appear = function(){
    let elms = document.querySelectorAll(".underline-appear");
    if(!elms || !elms.length){return;}
    for(let elm of elms){
      // color
      if(elm.hasAttribute("data-underline-color")){
        elm.style.setProperty("--apeer-underline-color" , elm.getAttribute("data-underline-color") , "");
      }
      else{
        elm.style.setProperty("--apeer-underline-color" , this.options.underline_color , "");
      }
      // duration
      if(elm.hasAttribute("data-underline-duration")){
        elm.style.setProperty("--apeer-underline-duration" , elm.getAttribute("data-underline-duration")+"ms" , "");
      }
      else{
        elm.style.setProperty("--apeer-underline-duration" , this.options.underline_duration+"ms" , "");
      }
    }
  };
  MAIN.prototype.scroll_underline_appear = function(e){
    let elms = document.querySelectorAll(".underline-appear");
    if(!elms || !elms.length){return;}
    let window_h = window.innerHeight;
    for(let elm of elms){
      let rect = elm.getBoundingClientRect();
      if((rect.top - window_h + rect.height *2) <= 0 && (rect.top + rect.height) >= 0){
        elm.setAttribute("data-anim" , "1");
      }
      else{
        elm.setAttribute("data-anim" , "0");
      }
    }
  };

  // hashlink-url-adjust
  MAIN.prototype.hash_link_event_set = function(){return;
    new LIB().event(window , "click" , this.hash_link_url_check.bind(this));
  };
  MAIN.prototype.hash_link_url_check = function(e){
    let a = new LIB().upperSelector(e.target , "a");
    if(!a){return;}
    let href = a.getAttribute("href");
    if(href.indexOf("#") === -1){return;}
    if(href.match(/^[http:|https:|\/\/]/)){return;}
    setTimeout((function(href){this.hash_link_url_adjust(href)}).bind(this , href) , 0);
  };
  MAIN.prototype.hash_link_url_adjust = function(href){
    let sp = location.href.split("#");
    history.pushState(null, null, sp[0])
  };

  // ----------
  // scroll-vihavior
  MAIN.prototype.scroll_vihavior = function(){
    // safari判定
    if(this.has_browser_safari()){
      this.hack_hashLink();
    }
  };
  // safari判定
  MAIN.prototype.has_browser_safari = function(){
    if(navigator.appCodeName === "Mozilla"
    && navigator.appName === "Netscape"
    && navigator.userAgent.indexOf("Safari") !== -1
    && navigator.vendor.indexOf("Apple") !== -1){
      return true;
    }
    else{
      return false;
    }
  };
  MAIN.prototype.hack_hashLink = function(){
    let a_arr = document.links;
    if(!a_arr || !a_arr.length){return;}
    for(let a of a_arr){
      a.onclick = (function(e){
        let href = e.target.getAttribute("href");
        if(href.indexOf("#") === -1){return;}
        if(href.match(/^[http:|https:|\/\/]/)){return;}
        let names = href.split("#");
        let elm_names = document.getElementsByName(names[1]);
        if(!elm_names || !elm_names.length){return;}
        let elm_name = elm_names[0];
        this.smoth_scroll(elm_name);
        return false;
      }).bind(this);
    }
  };
  MAIN.prototype.smoth_scroll = function(to){
    let scroll_y = this.get_scroll_y();
    let rect     = to.getBoundingClientRect();
    if(Math.abs(rect.top) > 30){
      let num = rect.top / 2.5;
      if(Math.abs(num) > 100){
        if(num > 0){
          num = 100;
        }
        else{
          num = -100;
        }
      }
      document.documentElement.scrollTop = scroll_y + num;
      setTimeout(this.smoth_scroll.bind(this,to) , 30);
    }
    else{
      document.documentElement.scrollTop = scroll_y + rect.top;
    }
  };

  // ----------
  // infinite-scroll
  MAIN.prototype.infinite_scroll_set = function(){
    

    // first-set
    let targets = document.querySelectorAll(".infinite-scroll");
    if(!targets || !targets.length){return;}

    // mark
    for(let target of targets){
      let elms = target.querySelectorAll(":scope > *");
      if(!elms || !elms.length){continue;}
      target.setAttribute("data-infinite-scroll" , "1");
      for(let elm of elms){
        elm.infinite_scroll_primary = true;
      }
    }

    this.infinite_scroll_copy();
  };

  MAIN.prototype.infinite_scroll_copy = function(){
    let targets = document.querySelectorAll("*[data-infinite-scroll]");
    if(!targets || !targets.length){return;}
    // copy 
    for(let target of targets){
      target.setAttribute("data-infinite-scroll" , "0");
      this.del_elm_infinite(target);
      let target_html = target.innerHTML;
      let width = this.get_elm_innerWidth(target);
      let count = Math.ceil(target.offsetWidth * 2 / width)-1;
      count = count || 1;
      for(let i=0; i<count; i++){
        target.insertAdjacentHTML("beforeend" , target_html);
      }
      // set-duration
      this.set_infinite_scroll_duration(target);

      target.setAttribute("data-infinite-scroll" , "1");
    }
  };

  MAIN.prototype.get_elm_innerWidth = function(elm){
    if(!elm){return null;}
    let width = 0;
    for(let i=0; i<elm.children.length; i++){
      width += elm.children[i].offsetWidth;
    }
    return width;
  };

  MAIN.prototype.del_elm_infinite = function(elm){
    if(!elm){return;}
    for(let i=elm.children.length-1; i>=0; i--){
      if(elm.children[i].infinite_scroll_primary === true){continue;}
      elm.children[i].parentNode.removeChild(elm.children[i]);
    }
  };
  MAIN.prototype.set_infinite_scroll_duration = function(target){
    if(!target){return;}
    let duration = target.getAttribute("data-infinite-scroll-duration") || "1500";
    for(let i=0; i<target.children.length; i++){
      target.children[i].style.setProperty("animation-duration" , duration+"ms","");
    }
  };

  // ----------
  // carousel
  MAIN.prototype.carousel_set = function(){
    let targets = document.querySelectorAll(".mynt-lp-carousel");
    
    for(let target of targets){
      if(target.children.length <= 1){continue;}
      this.carousel_init(target);
    }
  };
  MAIN.prototype.carousel_init = function(target){
    if(!target){return;}
    this.set_slide(target);
    // navigation
    // this.carousel_navigation(target);
    this.carousel_button(target);
    new LIB("event" , target , "scroll" , (function(e){
      this.carousel_navigation_active_clear(e.target.carousel_navigation);
      if(this.carousel_scroll_cache){
        clearTimeout(this.carousel_scroll_cache);
      }
      this.carousel_scroll_cache = setTimeout(this.carousel_scroll.bind(this , e) , 100);
      if(this.carousel_scroll_cache2){
        clearTimeout(this.carousel_scroll_cache2);
        this.carousel_set_next_time(target);
      }
    }).bind(this));
    if(target.getAttribute("data-carousel-auto-slide") === "1"){
      this.carousel_set_next_time(target);
    }
  };
  MAIN.prototype.set_slide = function(carousel){
    for(let i=0; i<carousel.children.length; i++){
      carousel.children[i].setAttribute("mynt-lp-carousel-selide","1");
      carousel.children[i].setAttribute("data-num",i);
    }
    this.set_slide_active(carousel , 0);
  };
  MAIN.prototype.set_slide_active = function(carousel , num){
    if(!carousel){return;}
    num = Number(num || 0);
    for(let i=0; i<carousel.children.length; i++){
      if(i === num){
        carousel.children[i].setAttribute("data-active" , "1");
      }
      else if(carousel.children[i].hasAttribute("data-active")){
        carousel.children[i].removeAttribute("data-active");
      }
    }
  };
  // 左右送りボタン
  MAIN.prototype.carousel_button = function(target){
    if(!target){return;}
    target.parentNode.style.setProperty("position","relative","");
    let button_l = document.createElement("div");
    button_l.className = "mynt-lp-carousel-button-l";
    button_l.carousel_target = target;
    target.appendChild(button_l);
    new $$lib().event(button_l , "click" , this.carousel_button_click.bind(this , "left"));
    let button_r = document.createElement("div");
    button_r.carousel_target = target;
    button_r.className = "mynt-lp-carousel-button-r";
    target.appendChild(button_r);
    target.carousel_button_l = button_l;
    target.carousel_button_r = button_r;
    this.carousel_button_pos(target);
    new $$lib().event(button_r , "click" , this.carousel_button_click.bind(this , "right"));
    target.className += " no-scroll-bar";
  };
  MAIN.prototype.carousel_button_pos_all = function(){
    let button_l_arr = document.querySelectorAll(".mynt-lp-carousel-button-l");
    for(let i=0; i<button_l_arr.length; i++){
      let target = button_l_arr[i].carousel_target;
      if(!target){continue;}
      this.carousel_button_pos(target);
    }
  }
  MAIN.prototype.carousel_button_pos = function(target){
    if(!target){return;}
    let offset = 5;
    // let rect = target.getBoundingClientRect();
    let button_l = target.carousel_button_l;
    button_l.style.setProperty("top", (target.offsetTop + target.offsetHeight / 2) +"px","");
    button_l.style.setProperty("left", (target.offsetLeft + offset) +"px","");
    
    let button_r = target.carousel_button_r;
    button_r.style.setProperty("top", (target.offsetTop + target.offsetHeight / 2) +"px","");
    button_r.style.setProperty("left", (target.offsetLeft + target.offsetWidth - button_r.offsetWidth - offset) +"px","");

    if(target.offsetWidth < target.scrollWidth){
      button_l.style.setProperty("display","block","");
      button_r.style.setProperty("display","block","");
    }
    else{
      button_l.style.setProperty("display","none","");
      button_r.style.setProperty("display","none","");
    }
  }
  MAIN.prototype.carousel_button_click = function(direct , e){
// console.log(direct);
    let target = e.target.carousel_target;
    if(!target){return;}
// console.log(e);
    let first_item = target.firstElementChild;
    let currentScroll = target.scrollLeft;
// console.log(first_item);
// console.log(currentScroll);
// console.log(first_item.offsetWidth);
    // let moveScroll    = first_item.offsetWidth;
    switch(direct){
      case "left":
        currentScroll -= first_item.offsetWidth;
        break;

      case "right":
        currentScroll += first_item.offsetWidth;
        break;
    }
    // if(currentScroll < 0){
    //   currentScroll = 0;
    // }
    // else if(currentScroll > target.scrollLeft - target.offsetWidth){
    //   currentScroll = target.scrollLeft - target.offsetWidth;
    // }
// console.log(currentScroll);
    target.scrollLeft = currentScroll;
// console.log(target.scrollLeft);

    // let offset = 2;
    // for(let i=0; i<moveScroll; i=i+offset){
    //   let move = direct === left ? -offset : offset;
    //   this.carousel_button_move_anime(target , currentScroll + move);
    // }
    
// console.log(currentScroll);
  };
  // MAIN.prototype.carousel_button_move_anime = function(target , move_num){
  //   target.scrollLeft = move_num;
  // };



  // ポイントナビゲーション
  MAIN.prototype.carousel_navigation = function(target){
    if(!target){return;}
    let navigation_area = document.createElement("div");
    navigation_area.className = "mynt-lp-carousel-navigation";
    target.parentNode.insertBefore(navigation_area , target);
    target.carousel_navigation = navigation_area;
    let bounding = target.getBoundingClientRect();
    navigation_area.style.setProperty("top", (bounding.top + document.scrollingElement.scrollTop + bounding.height) + "px","");
    for(let i=0; i<target.children.length; i++){
      let point = document.createElement("div");
      point.className = "mynt-lp-carousel-navigation-point";
      point.setAttribute("data-num" , i);
      navigation_area.appendChild(point);
      let point_bounding = target.children[i].getBoundingClientRect();
      if(point_bounding.x >= bounding.x && point_bounding.x+point_bounding.width <= bounding.x+bounding.width){
        point.setAttribute("data-active" , "1");
      }
      point.carousel_parent = target;
      new LIB("event" , point , "click" , this.carousel_point_click.bind(this));
    }
  }
  MAIN.prototype.carousel_point_click = function(e){
    if(this.carousel_slide_scroll_flg){
      console.log(this.carousel_slide_scroll_flg);
      return;
    }
    let target = e.currentTarget;
    if(!target){return;}
    let carousel = target.carousel_parent;
    if(!carousel){return;}
    let num = target.getAttribute("data-num");
    num = Number(num || 0);
    this.set_slide_active(carousel , num);
    // point-del-mark
    this.carousel_navigation_active_clear(carousel.carousel_navigation);
    target.setAttribute("data-active" , "1");
    if(this.has_browser_safari()){
      this.carousel_slide_scroll_safari(carousel , num);
    }
    else{
      this.carousel_slide_scroll_normal(carousel , num);
    }

    if(this.carousel_scroll_cache){
      clearTimeout(this.carousel_scroll_cache);
    }
    if(this.carousel_scroll_cache2){
      clearTimeout(this.carousel_scroll_cache2);
      this.carousel_set_next_time(target);
    }
  };
  MAIN.prototype.carousel_slide_scroll_normal = function(carousel , num , callback){
    let bounding = carousel.getBoundingClientRect();
    carousel.scrollLeft = bounding.width * num;
    if(callback){
      callback();
    }
  };
  MAIN.prototype.carousel_slide_scroll_safari = function(carousel , num , callback){
    let bounding = carousel.getBoundingClientRect();
    let current_scroll = carousel.scrollLeft;
    let finish_scroll  = bounding.width * num;
    let diff = finish_scroll - current_scroll;
    if(Math.abs(diff) > 30){
      let pos = diff / 2.5;
      if(Math.abs(pos) > 100){
        if(pos > 0){
          pos = 100;
        }
        else{
          pos = -100;
        }
      }
      carousel.scrollLeft = current_scroll + pos;
      this.carousel_slide_scroll_flg = setTimeout(this.carousel_slide_scroll_safari.bind(this , carousel , num , callback) , 30);
    }
    else{
      carousel.scrollLeft = bounding.width * num;
      if(this.carousel_slide_scroll_flg){
        clearTimeout(this.carousel_slide_scroll_flg);
        delete this.carousel_slide_scroll_flg;
      }
      if(callback){
        callback();
      }
    }
  };
  MAIN.prototype.carousel_navigation_active_clear = function(navigation){
    if(!navigation){return;}
    for(let navi of navigation.children){
      if(navi.hasAttribute("data-active")){
        navi.removeAttribute("data-active");
      }
    }
  };
  MAIN.prototype.carousel_scroll = function(e){return;
    let carousel = e.target;
    let current_num = this.carousel_get_current_pos(carousel);
    this.carousel_navigation_active_clear(carousel.carousel_navigation);
    let point = carousel.carousel_navigation.querySelector("[data-num='"+current_num+"']");
    if(point){
      point.setAttribute("data-active" , 1);
    }
    this.set_slide_active(carousel , current_num);
  };
  MAIN.prototype.carousel_get_current_pos = function(carousel){
    if(!carousel){return;}
    let elm = null;
    let diff = 0;
    for(let slider of carousel.children){
      let slider_bounding = slider.getBoundingClientRect();
      if(slider_bounding.x === 0){
        elm = slider;
        break;
      }
      // 枠内に一番大きい割合で入っているelementの取得
      else{
        if(elm === null
        || Math.abs(slider_bounding.x) < Math.abs(diff)){
          elm = slider;
          diff = slider_bounding.x;
        }
      }
    }
    return elm.getAttribute("data-num");
  };

  MAIN.prototype.carousel_get_current_num = function(carousel){
    if(!carousel){return;}
    // 一番x軸が0に近い値のものをピックアップ
    let num = 0;
    for(let slider of carousel.children){
      if(slider.getAttribute("data-active") === "1"){
        num = Number(slider.getAttribute("data-num"));
      }
    }
    return num;
  };
  MAIN.prototype.carousel_get_next_num = function(carousel){
    if(!carousel){return;}
    // let current_num = this.carousel_get_current_num(carousel);
    let current_num = this.carousel_get_current_pos(carousel);
    let max = carousel.children.length - 1;
    let num = Number(current_num) + 1;
    return max >= num ? num : 0;
  };
  MAIN.prototype.carousel_set_next_time = function(carousel){
    if(!carousel){return;}
    let next_time = carousel.getAttribute("data-carousel-next-time");
    next_time = Number(next_time || 0)
    if(!next_time){return;}
    this.carousel_scroll_cache2 = setTimeout(this.carousel_next_time_scroll.bind(this , carousel) , next_time);
  };
  MAIN.prototype.carousel_next_time_scroll = function(carousel){
    if(this.carousel_slide_scroll_flg){
      this.carousel_set_next_time(carousel);
      return;
    }
    if(!carousel){return;}
    let next_num = this.carousel_get_next_num(carousel);
    this.set_slide_active(carousel , next_num);
    if(this.has_browser_safari(carousel , next_num)){
      this.carousel_slide_scroll_safari(carousel , next_num , (function(){
        this.carousel_set_next_time(carousel);
      }).bind(this , carousel , next_num));
    }
    else{
      this.carousel_slide_scroll_normal(carousel , next_num , (function(){
        this.carousel_set_next_time(carousel);
      }).bind(this , carousel , next_num));
    }
  };



  // ==========
  // Ajax
  var $$ajax = function(options){
    if(!options){return}
		var ajax = new $$ajax;
		var httpoj = $$ajax.prototype.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = ajax.setOption(options);
		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		httpoj.setRequestHeader('Content-Type', option.type);
		// onload-check
		httpoj.onreadystatechange = function(event_res){// thisは、event_res.targetと同じ
			//readyState値は4で受信完了;
			if (this.readyState==4 && this.status==200){
				//コールバック(既存データも返す)
				option.onSuccess(this.responseText , event_res);
			}
		};
		//query整形
		var data = ajax.setQuery(option);
		//send メソッド
		if(data.length){
			httpoj.send(data.join("&"));
		}
		else{
			httpoj.send();
		}
  };
	$$ajax.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		async:"true",		// [trye:非同期 false:同期]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // [text/javascript]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	$$ajax.prototype.option = {};
	$$ajax.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	$$ajax.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	$$ajax.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.query != "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys != "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};
	$$ajax.prototype.loadHTML = function(filePath , selector){
		$$ajax({
      url:filePath+"?"+(+new Date()),
      method:"GET",
			async:false,
			data:{
				selector:selector
			},
      async:true,
      onSuccess:function(res){
        var target = document.querySelector(this.data.selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				target.innerHTML = "";
				target.appendChild(div1);

				// script
				$$ajax.prototype.orderScript(div2 , target);
      }
    });
	};

	$$ajax.prototype.orderScript = function(tags , target){
		if(!tags.childNodes.length){return;}

		var div = document.createElement("div");
		var newScript = document.createElement("script");
		if(tags.childNodes[0].innerHTML){newScript.innerHTML = tags.childNodes[0].innerHTML;}

		// Attributes
		var attrs = tags.childNodes[0].attributes;
		for(var i=0; i<attrs.length; i++){
			newScript.setAttribute(attrs[i].name , attrs[i].value);
		}

		if(typeof tags.childNodes[0].src === "undefined"){
			target.appendChild(newScript);
			div.appendChild(tags.childNodes[0]);
			$$ajax.prototype.orderScript(tags , target);
		}
		else{
			newScript.onload = function(){
				$$ajax.prototype.orderScript(tags , target);
			};
			target.appendChild(newScript);
			div.appendChild(tags.childNodes[0]);
		}
	};

	$$ajax.prototype.addHTML = function(filePath , selector){
		$$ajax({
      url:filePath+"?"+(+new Date()),
      method:"GET",
			async:false,
			data:{
				selector:selector
			},
      async:true,
      onSuccess:function(res){
        var target = document.querySelector(this.data.selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				// target.innerHTML = "";
				target.appendChild(div1);

				// script
				$$ajax.prototype.orderScript(div2 , target);
      }
    });
	};




  // ----------
  // Library
  function LIB(){
    let mode = "",
        args = [];
    for(let i=0; i<arguments.length; i++){
      if(i===0){
        mode = arguments[i];
      }
      else{
        args.push(arguments[i]);
      }
    }
    if(!mode){return;}
    if(this[mode] === undefined){return;}
    return this[mode].apply({} , args);
  }
  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };
  LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
		//URLとクエリ分離分解;
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		//基本情報取得;
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv.slice(1).join("=");
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  LIB.prototype.pathinfo = function(p){
		var basename="",
		    dirname=[],
				filename=[],
				ext="";
		var p2 = p.split("?");
		var urls = p2[0].split("/");
		for(var i=0; i<urls.length-1; i++){
			dirname.push(urls[i]);
		}
		basename = urls[urls.length-1];
		var basenames = basename.split(".");
		for(var i=0;i<basenames.length-1;i++){
			filename.push(basenames[i]);
		}
		ext = basenames[basenames.length-1];
		return {
			"hostname":urls[2],
			"basename":basename,
			"dirname":dirname.join("/"),
			"filename":filename.join("."),
			"extension":ext,
      "query":(p2[1])?p2[1]:"",
      "path":p2[0]
    };
  };

  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  // //指定したエレメントの座標を取得
	// LIB.prototype.pos = function(e,t){

	// 	//エレメント確認処理
	// 	if(!e){return null;}

	// 	//途中指定のエレメントチェック（指定がない場合はbody）
	// 	if(typeof(t)=='undefined' || t==null){
	// 		t = document.body;
	// 	}

	// 	//デフォルト座標
	// 	var pos={x:0,y:0};
	// 	do{
	// 		//指定エレメントでストップする。
	// 		if(e == t){break}

	// 		//対象エレメントが存在しない場合はその辞典で終了
	// 		if(typeof(e)=='undefined' || e==null){return pos;}

	// 		//座標を足し込む
	// 		pos.x += e.offsetLeft;
	// 		pos.y += e.offsetTop;
	// 	}

	// 	//上位エレメントを参照する
	// 	while(e = e.offsetParent);

	// 	//最終座標を返す
	// 	return pos;
  // };


  // ----------
  // start
  switch(document.readyState){
    case "complete" : new MAIN();break;
    default : window.addEventListener("load" , function(){new MAIN()});break;
  }

  return MAIN;
})();