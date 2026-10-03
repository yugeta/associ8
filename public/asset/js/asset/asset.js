// import { SvgImport } from './svg_import.js'

export class Asset{
  constructor(options){
    this.options = options || {}
    this.module_count = 0
  }

  async init(){
    if(!Asset.main){return}
    // Asset.set_status_loading()
    // document.body.setAttribute('data-page-name' , Asset.page_name)
    await this.html_load()
  }
  

  finish(){
    this.scroll_hash()
    if(!this.options.callback){return}
    this.options.callback()
  }

  static get header(){
    return document.querySelector('headeer')
  }

  static get main(){
    return document.querySelector('main')
  }

  static get footer(){
    return document.querySelector('footer')
  }

  static get default_page_name(){
    return 'index'
  }

  static get queries(){
    const query = location.search.replace(/^\?/,'')
    return Object.fromEntries(new Map(query.split('&').map(e => [e.split('=')[0],e.split('=').slice(1).join('=')]))) || {}
  }
  static get page_name(){
    const queries = Asset.queries
    return queries.p || Asset.default_page_name
  }
  static get file_name(){
    const queries = Asset.queries
    return queries.f || Asset.default_page_name
  }
  static convert_html(html){
    html = html.replace(/\{\{page_name\}\}/g, Asset.page_name)
    html = html.replace(/\{\{file_name\}\}/g, Asset.file_name)
    return html
  }

  static get elm_loading(){
    return document.querySelector('.loading')
  }

  


  async html_load(){
    if(!Asset.page_name){return}
    this.module_loading()
    const path = `page/${Asset.page_name}/${Asset.file_name}.html`
    const res  = await fetch(path).then(res => res.text())
    const html =  Asset.convert_html(res)
    const main = this.get_main(html)
    this.check_load_modules(main)
    Asset.main.parentNode.replaceChild(main, Asset.main)
    this.set_scripts(Asset.main)
  }

//   html_loaded(e){
// // console.log(e.target.responseText)
//     const html = Asset.convert_html(e.target.response)
    
//     const main = this.get_main(html)
    
//     this.check_load_modules(main)
    
//     Asset.main.parentNode.replaceChild(main, Asset.main)
//     // this.menu_load()
//     if(Asset.page_name === 'index'){
//       // Asset.top_menu.innerHTML = Asset.aside_menu.querySelector(':scope > ul').innerHTML
//       // Asset.aside_menu.style.display = 'none'
//     }

//     this.set_scripts(Asset.main)

//     this.module_loaded(e)
//   }
  

  get_main(html){
    const main = document.querySelector('main')
    main.innerHTML = html
    return main
  }
  check_load_modules(main){
    const links = main.querySelectorAll('link')
    for(const link of links){
      this.module_loading()
      link.addEventListener('load' , this.module_loaded.bind(this))
    }
  }
  set_scripts(elm){
    const scripts = Array.from(elm.querySelectorAll('script'))
    this.set_script(scripts)
  }
  set_script(scripts){
    if(!scripts || !scripts.length){return}
    const target_script = scripts.shift()
    if(target_script.closest("svg")){
      this.set_script(scripts)
    }
    else if(target_script.getAttribute('src')){
      this.set_script_src(target_script , scripts)
    }
    else{
      this.set_script_inner(target_script , scripts)
    }
  }
  set_script_src(before_script , scripts){
    const new_script = document.createElement('script')
    new_script.onload = (scripts => {
      this.set_script(scripts)
    }).bind(this , scripts)
    this.copy_attributes(before_script , new_script)
    new_script.setAttribute('data-set',1)
    before_script.parentNode.insertBefore(new_script , before_script)
    before_script.parentNode.removeChild(before_script)
  }
  set_script_inner(before_script , scripts){
    const script_value = before_script.textContent
    try{
      Function('(' + script_value + ')')();
      this.set_script(scripts)
    }
    catch(err){
      console.warn(err)
    }
  }
  copy_attributes(before_elm , after_elm){
    if(!before_elm || !after_elm){return}
    const attributes = before_elm.attributes
    if(!attributes || !attributes.length){return}
    for(const attr of attributes){
      after_elm.setAttribute(attr.nodeName , attr.nodeValue)
    }
  }

  
  module_loading(){
    this.module_count++
  }
  module_loaded(e){
    this.module_count--
    this.check_modules()
  }
  check_modules(){
    if(this.module_count <= 0){
      // setTimeout(Asset.set_status_loaded , 500)
      // Asset.set_status_loaded()
      this.finish()
    }
  }
  // static set_status_loading(){
  //   document.querySelector('html').setAttribute('data-status' , 'loading')
  // }
  // static set_status_loaded(){
  //   document.querySelector('html').setAttribute('data-status' , 'loaded')
  // }
  scroll_hash(){
    if(!location.hash){return}
    location.href = location.href
  }
}