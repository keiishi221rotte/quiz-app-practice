//documentは、オブジェクトで、その中にquerySelectorというメソッドがある。querySelector('ここにhtmlの要素を書く')ことでその要素を取得できる。
//liタグのように複数の値を取得したいときには、querySelectorAllを使用する。

const answersList = document.querySelectorAll('ol.answers li');

//querySelectorAllは要素が複数あるため下記のようにforEachを使って、1つずつ機能を与えなければならない。
//addEventListenerの第一引数にはclickやmousehoverなどを''で囲み機能を追加して、第二引数にそれが発生した際の関数を書く。

answersList.forEach(li =>li.addEventListener('click',checkClicedAnswer));

//選択肢をclickした際の関数
function checkClicedAnswer(event){
  //クリックされた答えの要素(liタグ)をひとつだけ取得する。
  const clickedAnswerElement =event.currentTarget;
  
  //選択した答え(A,B,C,D)
  //dataset.answerでdata-answerの値をとることができる。
  const selectedAnswer =clickedAnswerElement.dataset.answer;
  //closestでlickedAnswerElementの一つ上の階層に行く。そこに、ol.answersがあったら、dataset.idでdata-idの値を取得する。
  const questionId = clickedAnswerElement.closest('ol.answers').dataset.id;

  //next章
  // フォームデータの入れ物を作る
  const formData = new FormData();

  // 送信したい値を追加
  formData.append('id', questionId);
  formData.append('selectedAnswer', selectedAnswer);

  // xhr = XMLHttpRequestの頭文字です
  const xhr = new XMLHttpRequest();

  // HTTPメソッドをPOSTに指定、送信するURLを指定
  xhr.open('POST', 'answer.php');

  // フォームデータを送信
  xhr.send(formData);


  // loadendはリクエストが完了したときにイベントが発生する
  //下のやつは、第2引数に直接関数を定義する方法で記述している。
  xhr.addEventListener('loadend', function(event){
  /** @type {XMLHttpRequest} */
  const xhr=event.currentTarget;
  //リクエストが成功したかステータスコードで確認
  if(xhr.status===200){
     const response = JSON.parse(xhr.response);
     //答えが正しいか判定する。
     const result=response.result;
     const correctAnswer=response.correctAnswer;
     const correctAnswerValue=response.correctAnswerValue;
     const explanation=response.explanation;
     //画面表示
     displayResult(result,correctAnswer,correctAnswerValue,explanation);
    }else{
    //エラー
    alert('Error:解答データの取得に失敗しました。')
  }
});
}


function displayResult(result,correctAnswer,correctAnswerValue,explanation){
    //メッセージを入れる変数を用意
    let message;
    //カラーコードを入れる変数を用意
    let answerColorCode;
    
    if (result){
      //正しい答えだった時
      message='正解！いいね！';
      answerColorCode='';
    }else {
       //間違った答えだった時
       message='不正解！頑張れ！';
       answerColorCode='red';
    }
  
    alert(message);
  
  //正解の内容をHTMLに組み込む。
  document.querySelector('span#correct-answer').innerHTML=correctAnswer+'.'+correctAnswerValue;
  document.querySelector('span#explanation').innerHTML=explanation;

    //色を変更(間違っていた時だけ色が変わる。)
    document.querySelector('span#correct-answer').style.color=answerColorCode;
    //答え全体を表示する。
    document.querySelector('div#section-correct-answer').style.display='block';  
}



