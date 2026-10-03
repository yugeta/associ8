

export class Common{
  static name = "Associate-8"

  url_word_clear(){
    const url = new URL(location.href)
    url.searchParams.delete("word")
    window.history.pushState({}, '', url.href)
  };
}