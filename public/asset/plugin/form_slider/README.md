Form Slider
==
Author : Yugeta.Koji
Date   : 2021.05.04



# Summary
- 入力フォームを横スライドで繊維入力してGOALまで行く、入力フォームのスタイルフォレームワーク


# System
- [slider-view] ステップ分けされたHTMLを自動で読み込んで、スライド表示してくれる機能
- [toggle] フォーム内で、チェックボックスやラジオボタンによって、表示・非表示させる機能
- [scroll] 領域内スクロール機能 : サイズをはみ出る場合は、自動的にスクロール対応になる。（設定で領域内スクロールせずに、visibleにすることも可能にする？）
- [disable] 選択項目によって、disable機能を搭載できる。
- [debug] 入力値の確認ができるデバッグモード
- [function] 複合条件による、任意の判定ができる。(複数条件のtoggleなど)
- [button-validation] ボタンを押した時にバリデーションチェック処理を行うことができる（next or prev）
- [input-default] input文字（数値）入力で、ブランクになった場合に、自動登録される値をセットできる。(attribute : data-default="**")
- [range-options] select内のoptionタグを自動セットする機能(option一式をhtmlで返す)
- [form-visual] radioボタン , checkboxをlavelで囲むことにより、端末デザインに影響されない見た目に変更することができる。input -> span
- [form-value] 入力された項目の値を任意のタグで表示する機能 : 任意タグにtypeとnameをセットすることで、対象の値がtextContentで挿入される。
     ex)<span type="form-value" name="**"></span>
- [label-text-cache] radioボタン、checkbox、selectなどの、実際の値とは別にtext値を持っている場合に、その値も同時に保持して、再利用できるようにする。
- [inner-template] templateを外部ファイルではなく、内部タグに仕込んで、読み込みを無くして効率のいい運用ができる機能。
- [form-submit] 入力したフォームデータを送信する設定

# Request
- [secure-mode] XSS対応 : ex)入力文字のタグ記号<>を "<"->"&lt;",">"->"%gt"に切り替える。
- [EFO]



# Sample
- sample/index.html


# architect
 [area] .slider-area
    ├ [slider-1] .slider
    ├ [slider-2] .slider
    └ [slider-3] .slider


# Howto
1. autoload.jsをheadタグ内で読み込んで、bodyタグ内（または、起動後に実行するjavascript）に、起動命令（option必須）を書き込む。
2. スライドするそれぞれのページを構築してリスト化する。（この時に、どの順番に遷移するかを設計しておく）※templateタグの記述でも可能（サンプル参照）
3. 

# Options
  {
    base_selector  : "",
    template_dir   : "./",
    templates      : {},
    first_file     : "",
    onSlide        : function(){},

    debug      : false
  }


# Reference
  - toggle
    - 表示する項目に次のattributeをセットすることで、自動的にイベントがセットされて、表示・表示のトグルセットが行われる。
      data-formSlider-toggle="%対象項目のname値"
      data-formSlider-toggle-value="%対象項目の値"
      * radioやcheckboxの場合は、チェックされた項目の値で判定し、selectの場合は、切り替わったvalue値で対応する。
    - ex)
      <div class="toggle-sample" data-formSlider-toggle="test" data-formSlider-toggle-value="1">
        ...
      </div>
      name="test" value="1"
      になった場合に、表示されるelement

  - disable
    - toggle機能とほぼ同じ仕様で、次の属性値でコントロールできる。
      data-formSlider-disable="%対象項目のname値"
      ata-formSlider-disable-value="%対象項目の値"
    - ex)
        <div class="toggle-sample" data-formSlider-disable="test" data-formSlider-disable-value="1">
          ...
        </div>
        name="test" value="1"
        data-formSlider-disabled="1"の属性が付与される
        内包される、input,textarea,selectがdisable化されます。
        *他の項目にも影響させたい場合は、*[data-formSlider-disabled="1"]{}にて、cssセットしてください。

  - function
    - toggle,disableともに、単一の値でしか判定できないが、複数の値に対して設定ができるようにする機能
    - %入力formのname値 + %入力フォームのvalue値　を複数パターンに対して、条件判定できる機能
    - 比較式は次が仕様できる。
      == : 同じ値(統合)
      != : 違う値(不等号)
      >  : より大きい(比較)
      <  : より小さい(比較)
      >= : 以上(比較)
      <= : 以下(比較)
    - 値は基本的にstringとして扱うが、比較式の場合は、数値として扱う（クォーテーションは不要）
    - 対象フォームと値の取得方法
      data-formSlider-function="";
      ({{%入力formのname値}}これで値を取得できる
      また、上記を複数書いて、||(or) , &&(and)で、eval判定させることができる。
    - ex)
      <div class="toggle-sample" data-formSlider-function-toggle="({{test1}}==1)||({{test2}}==2)">
        ...
      </div>
    - 命令 : data-formSlider-function-**
      data-formSlider-function-toggle : 有効(true)の結果の場合に、表示されて、それ以外は非表示になる
      data-formSlider-function-disable : 有効な場合にdisableとなる。

  - Button
    - ボタン押下時に、バリデーションチェックの処理を実行できる。
      エラーがある場合は、次に遷移しない仕様
      ※エラー時の挙動は、書き込んでください。
    - エラーの場合に、return true;を返すと、遷移しない。

  - range-options
    - get_range_options
      options = {
        select  : 対象のselectタグ,
        start   : 開始値
        end     : 終了値
        step    : 指定がない場合は、+1
        default : selected指定値
        text   : #の位置を数値変換する。"第#回"
      };
      返ってきた値は次の方法でselect文に入れる。
      select.insertAdjacentHTML("beforeend" , options_html);
    - set_range_options
      取得したoptionsタグをselectタグにセットする。

  - forms
    - radio-button

    - check-box

    - select

    - input


  - [label-text-cache]
    - summary
      radioボタン、checkbox、selectなどの、実際の値とは別にtext値を持っている場合に、その値も同時に保持して、再利用できるようにする。
    - caution
      labelセットがされている項目に対してのみ発動
      * labelセットは、"button-validation"機能が適用される設定です。
      form再現ではなく、text再現の場合のみの表示になります。type="form-value" -> type="form-text"とすることで、value値からtext値での表示に切り替わります。
      * "form-value"機能対象
    - How-to
    次の２パターンのどちらか（上位優先）の文字列を返す
      1)
        label
          input type=radio
          ---text---
      2)
        label
          input type=radio
          element[data-mode="text"].textContent

  - [inner-template]
    - summary
      templateを外部ファイルではなく、内部タグに仕込んで、読み込みを無くして効率のいい運用ができる機能。
    - caution
      data-templateで登録されていない値をnext,prevのdata-fileで指定した場合、空白の画面が表示されます。
    - How-to
      - templateタグを次の階層の様に登録
        .template（class名は何でも可）
          <div data-template="step-1">...</div>
          <div data-template="step-2">...</div>

      - option設定に template_selector:""で、templateを埋め込んだselectorを記述
      - nextとprevには、data-file="%ata-templateの値%"を挿入
      

  - [form-submit]
    - summary
      入力したフォームデータを送信する設定
    - caution
      - options.submit.urlに登録されたurlに対して、post送信するので、受け側のサーバーで受信できるようにしておいてください。
      - name値等は、そのままの値が送信されます。
    - How-to
      - 任意のquery値をセットしたい場合は、options.submit.queryに、key:value（連想配列）で登録をしてください。
      - postしたサーバーからのレスポンス値を、options.submit.onSuccessで値を受け取り、callback処理が記述できます。
      - conversionページがある場合は、options.submit.succes_urlに登録した値に遷移しますが、callbackでページ遷移処理を書いてもらってもいいです。


# Caution
- 入力フォームの配列name値（radioボタン以外の重複name値）は、正常に動作しません。(name="data[]")
  ※必ずユニークnameになるようにしてください。
- formタグが複数に別れている入力フォームには対応していません。
  ＊1つの<form>タグ内でのみ使用できます。
- 


