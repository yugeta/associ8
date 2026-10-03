window.$$form_slider = (function(){
  let __options = {
    name              : "form_slider",
    debug             : false,
    base_selector     : "",
    template_dir      : "",
    template_selector : "",
    templates         : {},
    first_file        : "",
    onSlide           : null, //(function(){}).bind(),
    onTemplate        : null,
    onButton_next     : null, //function(current_step_file){},
    onButton_prev     : null, //function(current_step_file){},
    onButton_save     : null, //function(current_step_file){},

    submit : {
      url        : "",
      query      : {},
      onSuccess  : function(res){},
      succes_url : null
    },

    selectors : {
      "area"   : ".slider-area",
      "slider" : ".slider",
      "datas"  : ".form_slider_datas"
    },

    attributes : {
      "toggle"           : "data-formSlider-toggle",
      "disable"          : "data-formSlider-disable",
      "function_toggle"  : "data-formSlider-function-toggle",
      "function_disable" : "data-formSlider-function-disable",
      "label"            : "data-formSlider-label"
    }
  };

  let MAIN = function(options){
    // 起動処理(ページ読み込み完了を待ってスタート)
    switch(document.readyState){
      case "complete" :
        this.start(options);
        break;
      default :
        window.addEventListener(
          "load" , 
          (function(options){this.start(options)}).bind(this , options)
        );
        break;
    }
  };
  MAIN.prototype.start = function(options){
    if(!this.check_options(options)){return;}
    this.options = this.set_options(options);
    this.init();
    this.load_modules();
    this.set_frame();
    this.set_event();
    this.template_load();
    this.set_debug();
  };


  // ----------
  // init
  // ----------
  MAIN.prototype.init = function(){//console.log(this.options);
    if(this.options.template_selector){
      let template_elm = document.querySelector(this.options.template_selector);
      if(template_elm){
        template_elm.style.setProperty("display","none","");
      }

      // templates-cache
      let template_lists = template_elm.querySelectorAll(":scope > *");
      for(let i=0; i<template_lists.length; i++){
        let key = template_lists[i].getAttribute("data-template");
        if(!key){continue;}
        this.options.templates[key] = template_lists[i].innerHTML;
      }
    }
  };

  MAIN.prototype.check_options = function(options){
    if(!options){
      console.log("Error ! not options.");
      return false;
    }
    if(!options.base_selector || !document.querySelector(options.base_selector)){
      console.log("Error ! not found-element. {base_selector : "+options.base_selector+"}");
      return false;
    }
    if(!options.first_file){
      console.log("Error ! not found-first_file.");
      return false;
    }
    return true;
  };
  MAIN.prototype.set_options = function(options){
    options = options || {};
    for(let i in __options){
      options[i] = options[i] !== undefined ? options[i] : __options[i];
    }
    return options;
  };
  MAIN.prototype.load_modules = function(){
    let scripts = document.getElementsByTagName("script");
    for(let i=0; i<scripts.length; i++){
      if(!scripts[i].src){continue;}
      if(scripts[i].getAttribute("rel") === this.options.name
      || scripts[i].src.indexOf(this.options.rel+".js") !== -1){
        this.load_modules_css(scripts[i]);
        break;
      }
    }
  };
  MAIN.prototype.load_modules_css = function(base_script){
    if(!base_script){return;}
    let urlinfo = new $$lib().urlinfo(base_script.getAttribute("src"));
    let querys = [];
    for(let q in urlinfo.query){
      querys.push(q+"="+urlinfo.query[q]);
    }
    let path   = urlinfo.dir  + this.options.name + ".css" + "?"+ querys.join("&");
    let link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = path;
    link.setAttribute("name" , this.options.name);
    base_script.parentNode.insertBefore(link , base_script);
  };
  MAIN.prototype.set_event = function(e){
    let area = this.get_elm_area();
    if(area){
      new $$lib().event(area , "click" , this.click_button.bind(this));
    }
  };
  MAIN.prototype.set_frame = function(){
    let base = this.get_elm_base();
    if(!base){return;}
    let div = document.createElement("div");
    div.className = this.options.selectors.area.replace(".","");
    base.appendChild(div);
  };
  MAIN.prototype.set_debug = function(){
    let data_area = this.get_elm_datas();
    if(!data_area){
      data_area = this.create_datas_area();
    }
    if(this.options.debug === true){
      data_area.setAttribute("data-debug" , "1");
    }
    else{
      data_area.setAttribute("data-debug" , "0");
    }
  };



  // ----------
  // element
  // ----------
  MAIN.prototype.get_elm_base = function(){
    if(!this.elm_base){
      this.elm_base = document.querySelector(this.options.base_selector);
    }
    return this.elm_base;
  };
  MAIN.prototype.get_elm_area = function(){
    if(!this.elm_area){
      this.elm_area = document.querySelector(this.options.selectors.area);
    }
    return this.elm_area;
  };
  MAIN.prototype.get_elm_slider = function(file_name){
    if(!file_name){return;}
    let area = this.get_elm_area();
    if(!area){return;}
    return area.querySelector(this.options.selectors.slider +"[data-file='"+file_name+"']");
  };
  MAIN.prototype.get_elm_datas = function(){
    if(!this.elm_datas){
      this.elm_datas = document.querySelector(this.options.selectors.datas);
    }
    return this.elm_datas;
  };
  MAIN.prototype.get_elm_data_form = function(name){
    let area = this.get_elm_datas();
    if(!area){return;}
    return area.querySelector("[name='"+ name +"']");
  };
  MAIN.prototype.get_elm_data_forms = function(name){
    let area = this.get_elm_datas();
    if(!area){return;}
    return area.querySelectorAll("[name='"+ name +"']");
  };


  // ----------
  // Button
  // ----------

  MAIN.prototype.click_button = function(e){
    let button = new $$lib().upperSelector(e.target , "[data-mode='next'],[data-mode='prev'],[data-mode='save'],[data-mode='submit']");
    if(!button){return;}
    let mode = button.getAttribute("data-mode");
    let file = button.getAttribute("data-file");
    this.move_view(file , mode , button);
  };
  // file : target-file
  // mode : next , prev , save
  MAIN.prototype.move_view = function(file , mode , custom){
    let area = this.get_elm_area();
    let options = {
      current_file : this.config.file,
      custom       : custom,
      click_file   : file,
      mode         : mode
    };
    switch(mode){
      case "next":
        if(!file){return;}
        if(this.options.onButton_next){
          if(this.options.onButton_next(options) === true){return;}
        }
        if(area){
          area.setAttribute("data-file" , file);
        }
        this.template_load("next");
        break;
      case "prev":
        if(!file){return;}
        if(this.options.onButton_prev){
          if(this.options.onButton_prev(options) === true){return;}
        }
        if(area){
          area.setAttribute("data-file" , file);
        }
        this.template_load("prev");
        break;
      case "save":
        if(!this.options.onButton_save){return;}
        this.options.onButton_save(options);
        break;
      case "submit":
        if(!this.options.submit.url){return;}
        this.post_submit(options);
        break;
    }
  };


  // ----------
  // Template
  // ----------

  // type @ [ "next" , "prev" ]
  MAIN.prototype.template_load = function(type){
    let area = this.get_elm_area();
    if(!area){return;}
    let file   = area.getAttribute("data-file") || this.options.first_file;
    area.setAttribute("data-file" , file);
    let path   = this.options.template_dir + file;
    this.config = {
      file : file,
      path : path,
      type : type
    };
    if(this.options.templates[file]){
      this.set_slider();
    }
    else if(!this.options.template_selector){
      new $$ajax({
        url       : path,
        method    : "get",
        onSuccess : this.template_loaded.bind(this),
        onError   : function(err){console.log(err)}
      });
    }
  };
  MAIN.prototype.template_loaded = function(res , event_res){
    if(!res){
      console.log("Warning ! no-file.");
      return;
    }
    this.options.templates[this.config.file] = res;
    this.set_slider();
  };

  MAIN.prototype.set_slider = function(){
    switch(this.config.type){
      case "next":this.set_slider_next();break;
      case "prev":this.set_slider_prev();break;
      default:this.set_slider_default();break;
    }
    this.set_toggle();
    this.set_disable();
    this.set_function_toggle();
    // this.set_function_disable();
    this.set_form_visual();
    this.set_default();

    if(this.options.onSlide){
      this.options.onSlide(this.config.file);
    }
  };
  MAIN.prototype.set_slider_next = function(){
    let area = this.get_elm_area();
    if(!area){return;}
    let slider = this.create_slider(this.config.file);
    area.appendChild(slider);
    this.add_forms();
    area.firstChild.style.setProperty("margin-left" , "-100%" , "");
    setTimeout((function(area){
      area.removeChild(area.firstChild);
    }).bind(this , area) , 600);
  };
  MAIN.prototype.set_slider_prev= function(){
    let area = this.get_elm_area();
    if(!area){return;}
    let slider = this.create_slider(this.config.file);
    slider.style.setProperty("margin-left" , "-100%" , "");
    area.insertBefore(slider , area.firstChild);
    setTimeout((function(slider){
      slider.style.setProperty("margin-left" , "0" , "");
    }).bind(this , slider) , 0);
    setTimeout((function(area){
      area.removeChild(area.lastChild);
    }).bind(this , area) , 600);
    this.add_forms();
  };
  MAIN.prototype.set_slider_default = function(){
    let area = this.get_elm_area();
    if(!area){return;}
    let slider = this.create_slider(this.config.file);
    if(!slider){return;}
    area.appendChild(slider);
    this.add_forms();
  };

  MAIN.prototype.create_slider = function(file){
    let slider = document.createElement("div");
    slider.className = "slider";
    slider.setAttribute("data-file" , file);
    let template = this.options.templates[this.config.file];
    if(this.options.onTemplate){
      template = this.options.onTemplate({
        template : template,
        config   : this.config
      });
    }
    slider.innerHTML = template;
    return slider;
  };


  // ----------
  // Form
  // ----------

  // スライドインした際の内包するform(input,select,textare)を、一時保存するelementを作成。
  MAIN.prototype.add_forms = function(){
    this.set_element_value();
    let area   = this.get_elm_area();
    if(!area){return;}
    let file_name = area.getAttribute("data-file");
    if(!file_name){return;}
    let slider = this.get_elm_slider(file_name);
    if(!slider){return;}
    let forms = slider.querySelectorAll("input,select,textarea");
    if(!forms || !forms.length){return;}
    for(let i=0; i<forms.length; i++){
      if(forms[i].getAttribute("data-mode") === "no-entry"){continue;}
      this.set_form_event(forms[i]);
      this.set_datas_form(forms[i]);
      this.set_in_to_value(forms[i]);
    }
  };

  // form-value機能
  MAIN.prototype.set_element_value = function(){
    let area   = this.get_elm_area();
    if(!area){return;}
    let file_name = area.getAttribute("data-file");
    if(!file_name){return;}
    let slider = this.get_elm_slider(file_name);
    if(!slider){return;}
    let targets = slider.querySelectorAll(":scope [type='form-value'][name]");
    if(targets.length){
      for(let target of targets){
        let name = target.getAttribute("name");
        if(!name){continue;}
        let data_form = this.get_elm_data_form(name);
        if(!data_form || !data_form.value){continue;}
        target.textContent = data_form.value;
      }
    }
    let texts = slider.querySelectorAll(":scope [type='form-text'][name]");
    if(texts.length){
      for(let target of texts){
        let name = target.getAttribute("name");
        if(!name){continue;}
// console.log(name);
        let data_form = this.get_elm_data_form(name);
// console.log(data_form);
// console.log(data_form.cache_text);
        if(!data_form || !data_form.value){continue;}
        if(data_form.cache_text === undefined){continue;}
        target.textContent = data_form.cache_text;
      }
    }
  };
  MAIN.prototype.create_datas_area = function(){
    let area = this.get_elm_datas();
    if(area){return area;}
    let div = document.createElement("div");
    div.className = this.options.selectors.datas.replace(".","");
    document.body.appendChild(div);
    return div;
  };
  MAIN.prototype.set_form_event = function(form){
    if(form.type === "radio"){
      new $$lib().event(form , "click" , this.change_form.bind(this));
    }
    else if(form.type === "checkbox"){
      new $$lib().event(form , "click" , this.change_form.bind(this));
    }
    else{
      new $$lib().event(form , "change" , this.change_form.bind(this));
    }
  };
  MAIN.prototype.change_form = function(e){
    let target = e.target;
    let name   = this.get_form_name(target);
    let value  = this.get_form_value(target);
    let form   = this.get_elm_data_form(name);
    switch(target.type){
      case "checkbox":
        if(target.checked === true){
          form.value = value;
        }
        else{
          form.value = "";
        }
        break;

      default:
        form.value = value;
        break;
    }

    // label-text-cache
    let data_form = this.get_elm_datas();
    let input;
    if(data_form){
      switch(target.type){
        case "radio":
        case "checkbox":
          input = data_form.querySelector("[name='"+name+"']");
          if(input){
            let text  = this.get_label_text(target);
            text = text.trim();
            input.cache_text = text;
            input.setAttribute("hoge","hogehoge");
  // console.log(input);
  // console.log(input.cache_text);
          }
          break;

        case "select-one":
          input = data_form.querySelector("[name='"+name+"']");
          if(input){
            let text = target.options[target.selectedIndex].text;
            input.cache_text  = text;
          }
          break;
      }
    }
  };
  // [label-text-cache] data-mode=textまたは、label内の文字列の取得
  MAIN.prototype.get_label_text = function(form){
    if(!form){return "";}
    let label = new $$lib().upperSelector(form , "label");
    if(!label){return "";}
    let text_target = label.querySelector("[data-mode='text']");
    if(text_target){
      return text_target.textContent;
    }
    else{
      return label.textContent;
    }
  };

  // system利用用formタグ構築
  MAIN.prototype.set_datas_form = function(form){
    let data_area = this.create_datas_area();
    if(!data_area){return;}
    let name = this.get_form_name(form);
    if(!name){return;}
    let input = data_area.querySelector("[name='"+name+"']");
    let value = this.get_form_value(form);
    if(!input){
      if(form.tagName === "TEXTAREA"){
        input = this.set_datas_form_textarea(name);
      }
      else{
        input = this.set_datas_form_input(name);
      }
    }
    else{
      if(input.value !== ""){return;}
    }
    if(form.type === "radio" || form.type === "checkbox"){
      if(form.checked === true){
        input.value = value;
      }
    }
    else{
      input.value = value;
    }
  };
  
  // inputタグ（標準）
  MAIN.prototype.set_datas_form_input = function(name){
    let data_area = this.create_datas_area();
    if(!data_area){return;}
    input = document.createElement("input");
    if(this.options.debug === true){
      input.type = "text";
    }
    else{
      input.type = "hidden";
    }
    input.name = name;
    input.placeholder = name;
    data_area.appendChild(input);
    return input;
  };
  // textareaタグ対応
  MAIN.prototype.set_datas_form_textarea = function(name){
    let data_area = this.create_datas_area();
    if(!data_area){return;}
    textarea = document.createElement("textarea");
    if(this.options.debug !== true){
      textarea.style.setProperty("display","none","");
    }
    textarea.name = name;
    textarea.placeholder = name;
    data_area.appendChild(textarea);
    return textarea;
  };

  // step遷移した際に入力済みの項目(name値)に、値を自動挿入する処理
  MAIN.prototype.set_in_to_value = function(form){
    let name = this.get_form_name(form);
    let data_form = this.get_elm_data_form(name);
    if(!data_form || !data_form.value){return;}
    switch(form.type){
      case "radio":
        if(form.value === data_form.value){
          form.setAttribute("checked" , "");
        }
        else{
          if(form.hasAttribute("checked")){
            form.removeAttribute("checked");
          }
        }
        break;

      case "checkbox":
        if(form.value === data_form.value){
          form.setAttribute("checked" , "");
        }
        else{
          if(form.hasAttribute("checked")){
            form.removeAttribute("checked");
          }
        }
        break;

      default:
        form.value = data_form.value;
        break;
    }
  };
  // // 任意elementに対して値をセットする
  // MAIN.prototype.set_in_to_element = function(target){
  //   let name = this.get_form_name(target);
  //   let data_form = this.get_elm_data_form(name);
  //   if(!data_form || !data_form.value){return;}
  //   target.textContent = data_form.value;
  // };

  MAIN.prototype.get_form_name = function(form){
    if(form.tagName === "INPUT" && form.type === "radio"){
      return form.name;
    }
    else if(form.tagName === "INPUT" && form.type === "checkbox"){
      return form.name;
    }
    else{
      return form.name;
    }
  };
  MAIN.prototype.get_form_value = function(form){
    if(form.tagName === "INPUT" && form.type === "radio"){
      return form.value;
    }
    else if(form.tagName === "INPUT" && form.type === "checkbox"){
      return form.value;
    }
    else{
      return form.value;
    }
  };

  // ----------
  // Toggle機能
  // ----------
  MAIN.prototype.set_toggle = function(){
    if(!this.config || !this.config.file){}
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let toggles = slider.querySelectorAll("*["+this.options.attributes.toggle+"]");
    for(let toggle of toggles){
      if(!toggle.hasAttribute(this.options.attributes.toggle + "-value")){continue;}
      let name = toggle.getAttribute(this.options.attributes.toggle);
      let form = slider.querySelector("[name='"+name+"']");
      if(!form){continue;}
      this.set_toggle_form_event(name);
    }
  };
  MAIN.prototype.set_toggle_form_event = function(name){
    let slider = this.get_elm_slider(this.config.file);
    let elms = slider.querySelectorAll("[name='"+name+"']");
    for(let form of elms){
      if(form.hasAttribute(this.options.attributes.toggle + "-setted")){continue;}
      if(form.type === "radio" || form.type === "checkbox"){
        new $$lib().event(form , "click" , this.check_toggle.bind(this));
      }
      else{
        new $$lib().event(form , "change" , this.check_toggle.bind(this));
      }
      this.check_toggle({target:form});
      form.setAttribute(this.options.attributes.toggle + "-setted" , "1");
    }

  };

  MAIN.prototype.check_toggle = function(e){
    let target = e.target;
    if(!target){
      console.log("Warning ! toggle-error. no-target.");
      return;
    }
    let name    = target.name;
    let slider  = this.get_elm_slider(this.config.file);
    let toggles = slider.querySelectorAll("["+this.options.attributes.toggle+"='"+name+"']");
    if(target.type === "radio" || target.type === "checkbox"){
      let value  = "";
      let targets = slider.querySelectorAll("[name='"+name+"']");
      for(let i=0; i<targets.length; i++){
        if(targets[i].checked === true){
          value = targets[i].value;
          break;
        }
      }
      this.proc_toggle(toggles , name , value);
    }
    else{
      this.proc_toggle(toggles , name , target.value);
    }
  };
  MAIN.prototype.proc_toggle = function(toggles , name , value){
    if(!toggles || !name){return;}
    for(let i=0; i<toggles.length; i++){
      if(toggles[i].getAttribute(this.options.attributes.toggle + "-value") === value){
        toggles[i].setAttribute("data-hidden" , "0");
      }
      else{
        toggles[i].setAttribute("data-hidden" , "1");
      }
    }
  };

  // ----------
  // Disable機能
  // ----------
  MAIN.prototype.set_disable = function(){
    if(!this.config || !this.config.file){}
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let disables = slider.querySelectorAll("*["+this.options.attributes.disable+"]");
    for(let disable of disables){
      if(!disable.hasAttribute(this.options.attributes.disable + "-value")){continue;}
      let name = disable.getAttribute(this.options.attributes.disable);
      let form = slider.querySelector("[name='"+name+"']");
      if(!form){continue;}
      this.set_disable_form_event(name);
    }
  };
  MAIN.prototype.set_disable_form_event = function(name){
    let slider = this.get_elm_slider(this.config.file);
    let elms = slider.querySelectorAll("[name='"+name+"']");
    for(let form of elms){
      if(form.hasAttribute(this.options.attributes.disable + "d")){continue;}
      if(form.type === "radio" || form.type === "checkbox"){
        new $$lib().event(form , "click" , this.check_disable.bind(this));
        this.check_disable({target:form});
        // if(form.checked === true){
        //  this.check_disable({target:form});
        // }
      }
      else{
        new $$lib().event(form , "change" , this.check_disable.bind(this));
        this.check_disable({target:form});
      }
      form.setAttribute(this.options.attributes.disable + "d" , "1");
      
    }
  };
  MAIN.prototype.check_disable = function(e){
    let target = e.target;
    if(!target){
      console.log("Warning ! disable-error. no-target.");
      return;
    }
    let name    = target.name;
    let slider  = this.get_elm_slider(this.config.file);
    let disables = slider.querySelectorAll("["+this.options.attributes.disable+"='"+name+"']");
    if(target.type === "radio" || target.type === "checkbox"){
      let value = "";
      let elms = slider.querySelectorAll("[name='"+name+"']");
      for(let i=0; i<elms.length; i++){
        if(elms[i].checked === true){
          value = elms[i].value;
          break;
        }
      }
      this.proc_disable(disables , name , value);
    }
    else{
      this.proc_disable(disables , name , target.value);
    }
  };
  MAIN.prototype.proc_disable = function(disables , name , value){
    if(!disables || !name){return;}
    for(let i=0; i<disables.length; i++){
      let current_value = disables[i].getAttribute(this.options.attributes.disable + "-value");
      if(current_value === value){
        disables[i].setAttribute(this.options.attributes.disable+"d" , "1");
      }
      else{
        disables[i].setAttribute(this.options.attributes.disable+"d" , "0");
      }
    }
  };

  // ----------
  // function関数(toggle)
  // ----------
  MAIN.prototype.set_function_toggle = function(){
    if(!this.config || !this.config.file){}
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let toggles = slider.querySelectorAll("*["+this.options.attributes.function_toggle+"]");
    for(let toggle of toggles){
      let attribute_value = toggle.getAttribute(this.options.attributes.function_toggle);
      let forms = this.set_function_toggle_str2forms(attribute_value);
      this.set_function_toggle_form_event(forms);
    }
  };
  MAIN.prototype.set_function_toggle_str2forms = function(setting_value){
    if(!setting_value){return;}
    let slider = this.get_elm_slider(this.config.file);
    let reg = RegExp("{{(.+?)}}","g");
    let res = null;
    let arr = [];
    while((res = reg.exec(setting_value)) !== null){
      let name = res[1];
      let elms = slider.querySelectorAll("[name='"+ name +"']");
      for(let i=0; i<elms.length; i++){
        arr.push(elms[i]);
      }
    }
    return arr;
  };
  MAIN.prototype.set_function_toggle_form_event = function(forms){
    if(!forms || !forms.length){return;}
    for(let form of forms){
      if(form.hasAttribute(this.options.attributes.toggle + "-setted")){continue;}
      if(form.type === "radio" || form.type === "checkbox"){
        new $$lib().event(form , "click" , this.check_function_toggle.bind(this));
        if(form.checked === true){
        }
      }
      else{
        new $$lib().event(form , "change" , this.check_function_toggle.bind(this));
      }
      form.setAttribute(this.options.attributes.toggle + "-setted" , "1");
    }
    this.check_function_toggle();
  };
  // 全ての設定チェック
  MAIN.prototype.check_function_toggle = function(){
    let slider  = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let toggles = slider.querySelectorAll("*["+this.options.attributes.function_toggle+"]");
    if(!toggles || !toggles.length){
      console.log("Warning ! no-function-toggles.");
      return;
    }
    for(let toggle of toggles){
      let setting_value = toggle.getAttribute(this.options.attributes.function_toggle);
      let res = this.proc_function_toggle(setting_value);
      switch(res){
        case true:
          toggle.setAttribute("data-hidden" , "0");
          break;
        case false:
          toggle.setAttribute("data-hidden" , "1");
          break;
      }
    }
  };
  MAIN.prototype.proc_function_toggle = function(setting_value){
    if(!setting_value){return null;}
    // let slider = this.get_elm_slider(this.config.file);
    let reg = RegExp("{{(.+?)}}","g");
    let res = null;
    // let cnt = 0;
    let new_str = setting_value;
    while((res = reg.exec(setting_value)) !== null){
      let name = res[1];
      let value = "'"+ this.form_name2value(name) +"'";
      let reg2 = RegExp("\{\{"+ name +"\}\}","g");
      new_str = new_str.replace(reg2 , value);
    }
    new_str = new_str.replace(/'/g , "\'");
    try{
      return Function('"use strict";return ('+ new_str +')')();
    }
    catch(err){
      console.log(err);
    }
  };
  MAIN.prototype.form_name2value = function(name){
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let form  = slider.querySelector("[name='"+ name +"']");
    if(!form){return;}
    if(form.type === "radio"){
      let forms  = slider.querySelectorAll("[name='"+ name +"']");
      for(let i=0; i<forms.length; i++){
        if(forms[i].checked === true){
          return forms[i].value;
        }
      }
      return "";
    }
    else{
      return form.value;
    }
  };


  // ----------
  // function関数(disable)
  // ----------


  // ----------
  // Formの見た目設定
  // ----------

  MAIN.prototype.set_form_visual = function(){
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let elms = slider.querySelectorAll("input,select,textarea,button");
    for(let i=0; i<elms.length; i++){
      switch(elms[i].type){
        case  "radio":
          this.set_form_visual_radio(elms[i]);
          break;
        case "checkbox":
          this.set_form_visual_checkbox(elms[i]);
          break;
      }
    }
  };

  // radioボタンをlabelで囲っていると、専用処理がセットされる
  MAIN.prototype.set_form_visual_radio = function(radio){
    if(!radio){return;}
    let label = new $$lib().upperSelector(radio , "label");
    if(!label){return;}
    // 登録済み
    if(label.getAttribute(this.options.attributes.label)==="radio"){return;}
    // 未登録
    else{
      label.setAttribute(this.options.attributes.label , "radio");
      let span = document.createElement("span");
      span.setAttribute("type" , "radio");
      span.setAttribute("name" , radio.name);
      radio.parentNode.insertBefore(span , radio);
    }
    //checked
    if(radio.checked === true){
      label.setAttribute("data-check" , "1");
    }
    // event
    new $$lib().event(label , "click" , this.click_visual_radio.bind(this));
  };
  MAIN.prototype.click_visual_radio = function(e){
    let target = e.currentTarget;
    if(!target || target.tagName !== "LABEL"){return;}
    let radio = target.querySelector("input[type='radio']");
    if(!radio){return;}
    let name = radio.name;
    if(!name){return;}
    let slider = this.get_elm_slider(this.config.file);
    let elms = slider.querySelectorAll("input[name='"+name+"']");
    for(let elm of elms){
      let label = new $$lib().upperSelector(elm , "label");
      if(!label){continue;}
      if(elm.checked === true){
        label.setAttribute("data-check" , "1");
      }
      else{
        label.setAttribute("data-check" , "0");
      }
    }
  };
  // radioボタンをlabelで囲っていると、専用処理がセットされる
  MAIN.prototype.set_form_visual_checkbox = function(checkbox){
    if(!checkbox){return;}
    let label = new $$lib().upperSelector(checkbox , "label");
    if(!label){return;}
    // 登録済み
    if(label.getAttribute(this.options.attributes.label)==="checkbox"){return;}
    // 未登録
    else{
      label.setAttribute(this.options.attributes.label , "checkbox");
      let span = document.createElement("span");
      span.setAttribute("type" , "checkbox");
      span.setAttribute("name" , checkbox.name);
      checkbox.parentNode.insertBefore(span , checkbox);
    }
    //checked
    if(checkbox.checked === true){
      label.setAttribute("data-check" , "1");
    }
    // event
    new $$lib().event(label , "click" , this.click_visual_checkbox.bind(this));
  };
  MAIN.prototype.click_visual_checkbox = function(e){
    let target = e.currentTarget;
    if(!target || target.tagName !== "LABEL"){return;}
    let checkbox = target.querySelector("input[type='checkbox']");
    if(!checkbox){return;}
    let name = checkbox.name;
    if(!name){return;}
    let slider = this.get_elm_slider(this.config.file);
    let elms = slider.querySelectorAll("input[name='"+name+"']");
    for(let elm of elms){
      let label = new $$lib().upperSelector(elm , "label");
      if(!label){continue;}
      if(elm.checked === true){
        label.setAttribute("data-check" , "1");
      }
      else{
        label.setAttribute("data-check" , "0");
      }
    }
  };

  // ----------
  // Default
  // ----------
  MAIN.prototype.set_default = function(){
    let slider = this.get_elm_slider(this.config.file);
    if(!slider){return;}
    let defaults = slider.querySelectorAll("[data-default]");
    for(let elm of defaults){
      new $$lib().event(elm , "blur" , function(e){
        if(e.target.value === ""){
          e.target.value = e.target.getAttribute("data-default");
        }
      });
    }
  };


  // ----------
  // API用関数
  // ----------
  
  // 現在のスライダーのエレメントを取得する
  MAIN.prototype.get_slider = function(){
    return this.get_elm_slider(this.config.file);
  };
  // 現在のスライダーのid(file)を取得する
  MAIN.prototype.get_slider_id = function(){
    if(!this.config){return null;}
    return this.config.file;
  };
  // name値から、保用データの値を取得する
  MAIN.prototype.get_saving_value = function(name){
    let elm = this.get_elm_data_form(name);
    if(elm){
      return elm.value;
    }
    else{
      return null;
    }
  };

  // select-optionを自動セットする機能(option一式をhtmlで返す)
  // options = {
  //   start : 開始値
  //   end   : 終了値
  //   step  : 指定がない場合は、+1
  //   default : selected指定値
  //   text  : #の位置を数値変換する。"第#回"
  // };
  MAIN.prototype.get_range_options = function(options){
    if(options.end === undefined){
      console.log("Warning. not-options [end].");
      return;
    }
    let text = options.text || "#";
    let step = options.step || 1;
    let html = "";
    for(let i=options.start; i<=options.end; i=i+step){
      let selected = options.default !== null && options.default == i ? "selected" : "";
      html += "<option value='"+i+"' "+ selected +">"+ text.replace("#" , i) +"</option>";
    }
    return html;
  };
  // 上記OPTIONタグをselectにセットする機能
  MAIN.prototype.set_range_options = function(options){
    let options_html = this.get_range_options(options);
    options.select.insertAdjacentHTML("beforeend" , options_html);
    this.change_form({target:options.select});
    return true;
  };

  // checkedのvalue値を取得する
  MAIN.prototype.get_radio_value = function(name){
    if(!name){return;}
    let area = this.get_elm_area();
    if(!area){return;}
    let elms = area.querySelectorAll("[name='"+name+"']");
    if(!elms || !elms.length){return;}
    let value = "";
    for(let i=0; i<elms.length; i++){
      if(elms[i].tagName !== "INPUT" || elms[i].type !== "radio"){continue;}
      if(elms[i].checked === true){
        value = elms[i].value;
        break;
      }
    }
    return value;
  };

  MAIN.prototype.get_value = function(name , type){
    if(!name){return;}
    let data_form = this.get_elm_datas();
    if(!data_form){return;}
    let elm = data_form.querySelector("[name='"+name+"']");
    if(!elm){return;}
    let value = elm.value;
    switch(type){
      case "number":
        return Number(value);
      default:
        return value;
    }
  };

  MAIN.prototype.post_submit = function(options){
    let submit_data = this.options.submit;
    let data_form = this.get_elm_datas();
    let elms = data_form.querySelectorAll(":scope > *");
    for(let i=0; i<elms.length; i++){
      let name  = elms[i].name;
      let value = elms[i].value
      if(!name){continue;}
      submit_data.query[name] = value;
    }
    new $$ajax({
      url       : submit_data.url,
      method    : "post",
      query     : submit_data.query,
      onSuccess : (function(res){
        this.options.submit.onSuccess(res);
        if(this.options.submit.succes_url){
          location.href = this.options.submit.succes_url;
        }
      }).bind(this),
      onError   : function(err){console.log(err)}
    });
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

  var $$lib  = function(){};
  $$lib.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };
  $$lib.prototype.urlinfo = function(uri){
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
  $$lib.prototype.pathinfo = function(p){
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

  $$lib.prototype.upperSelector = function(elm , selectors) {
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
  $$lib.prototype.construct = function(MAIN){
    switch(document.readyState){
      case "complete"    : new MAIN();break;
      case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
      default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
		}
  };

  $$lib.prototype.ymdhis2date = function(ymdhis){
    var y = ymdhis.substr(0,4);
    var m = ymdhis.substr(4,2);
    var d = ymdhis.substr(6,2);
    var h = ymdhis.substr(8,2);
    var i = ymdhis.substr(10,2);
    var s = ymdhis.substr(12,2);
    return y+"/"+m+"/"+d+" "+h+":"+i+":"+s;
  };



  //指定したエレメントの座標を取得
	$$lib.prototype.pos = function(e,t){

		//エレメント確認処理
		if(!e){return null;}

		//途中指定のエレメントチェック（指定がない場合はbody）
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}

		//デフォルト座標
		var pos={x:0,y:0};
		do{
			//指定エレメントでストップする。
			if(e == t){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof(e)=='undefined' || e==null){return pos;}

			//座標を足し込む
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
		}

		//上位エレメントを参照する
		while(e = e.offsetParent);

		//最終座標を返す
		return pos;
  };
  // 配列（連想配列）のソート
  $$lib.prototype.hash_sort = function(val){
    // json化して戻すことで、元データの書き換えを防ぐ
    var hash = JSON.parse(JSON.stringify(val));
    
    // 連想配列処理
    if(typeof hash === "object"){
      var flg = 0;
      for(var i in hash){
        if(typeof hash[i] === "object"){
          hash[i] = JSON.stringify(hashSort(hash[i]));
        }
        flg++;
      }
      if(flg <= 1){console.log(hash);
        return JSON.stringify(hash)}
      if(typeof hash.length === "undefined"){
        var keys = Object.keys(hash).sort();
        var newHash = {};
        for(var i=0; i<keys.length; i++){
          newHash[keys[i]] = hash[keys[i]];
        }
        return newHash;
      }
      else{
        hash.sort(function(a,b){
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        });
        return hash;
      }
    }
    // その他タイプはそのまま返す
   else{
      return hash;
    }
  }
  // ２つのハッシュデータの同一比較
  $$lib.prototype.hash_compare = function(data1 , data2){
    data1 = this.hash_sort(data1);
    data2 = this.hash_sort(data2);
    if(JSON.stringify(data1) === JSON.stringify(data2)){
      return true;
    }
    else{
      return false;
    }
  };
  $$lib.prototype.numberFormat3_integer = function(num){
    num = String(num);
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){num = tmpStr;}
    return num;
  };




  return MAIN;
  
})();