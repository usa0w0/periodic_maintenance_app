function 毎時実行(){
  let message = Utilities.formatDate(now, 'JST', 'MM-dd HH:mm') + '\n点検ツールから毎時実行関数が定期実行されたよ！'
  message += '\n営業中判定は、' + String(営業日カレンダー[Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')].status == '営業' && 9 <= now.getHours() && now.getHours() < 17)

  //　営業日かつ営業時間内のみ
  if (営業日カレンダー[Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')].status == '営業' && 9 <= now.getHours() && now.getHours() < 17){

    // 毎日実行
    const メンテナンス時刻 = Number(設定データ[設定データ.indexOf('メンテナンス時刻')+1]);
    message += '\nメンテナンス時刻判定は、' + String(メンテナンス時刻 == now.getHours())
    if (メンテナンス時刻 == now.getHours()){

      // 月例点検
      const 先月実施日 = new Date(スクリプトプロパティ.getProperty('月例点検実施日'));
      message += '\n月例点検判定は、' + String(先月実施日.getMonth() < now.getMonth())
      if (先月実施日.getMonth() < now.getMonth()){
        sendMonthlyRemind()
      }

      // 隔週点検
      const 前回実施日 = new Date(スクリプトプロパティ.getProperty('隔週点検実施日'));
      const 間隔 = Number(設定データ[設定データ.indexOf('隔週の間隔')+1]);
      message += '\n隔週点検判定は、' + String(前回実施日.setDate(前回実施日.getDate() + 間隔) <= now)
      if (前回実施日.setDate(前回実施日.getDate() + 間隔) <= now){
        sendWeeklyRemind()
      }
    }

    // 経過時間リマインド
    sendProgressRemind()
  }

  SlackApp.create(SlackBotトークン).postMessage('UCW6C8292', message);
}

function sendMonthlyRemind(){
  const 月例点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('月例点検表');
  const 新規月例点検表 = 月例点検表テンプレ.copyTo(月別DBスプレッドシート);
  新規月例点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM'))

  const 通知メッセージ = '<!channel>\n' + 月例通知文 + '\n<'+ アプリURL +'|点検ツール>';
  const option = {username: 月例通知ボット名}
  slackApp = SlackApp.create(SlackBotトークン);
  slackApp.postMessage(通知チャンネルID, 通知メッセージ, option);

  スクリプトプロパティ.setProperty('月例点検実施日', now);
}

function sendWeeklyRemind(){
  const 隔週点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('隔週点検表');
  const 新規隔週点検表 = 隔週点検表テンプレ.copyTo(週別DBスプレッドシート);
  新規隔週点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM-dd'))

  const 通知メッセージ = '<!channel>\n' + 隔週通知文 + '\n<'+ アプリURL +'|点検ツール>';
  const option = {username: 隔週通知ボット名}
  slackApp = SlackApp.create(SlackBotトークン);
  slackApp.postMessage(通知チャンネルID, 通知メッセージ, option);

  スクリプトプロパティ.setProperty('隔週点検実施日', now);
}

function sendProgressRemind(){
  const 経過時間 = Number(設定データ[設定データ.indexOf('経過時間リマインド')+1]);

  let 通知メッセージ = '';
  const option = {username: '充電開始から '+経過時間+' 時間以上が経過した機器があります！'}
  
  let 充電中リスト = JSON.parse(スクリプトプロパティ.getProperty('充電中'));
  let 充電開始時間

  console.log(充電中リスト)

  充電中リスト.forEach(function(機器情報){
    充電開始時間 = new Date(機器情報.date);
    if (充電開始時間.setHours(充電開始時間.getHours() + 経過時間) <= now){
      通知メッセージ += '・'+機器情報.id;
      充電中リスト.splice(充電中リスト.indexOf(機器情報), 充電中リスト.indexOf(機器情報)+1);
    }
  })

  if (通知メッセージ == ''){
    return
  }

  通知メッセージ += '\n<'+ アプリURL +'|点検ツール>';
  slackApp = SlackApp.create(SlackBotトークン);
  slackApp.postMessage(通知チャンネルID, 通知メッセージ, option);

  スクリプトプロパティ.setProperty('充電中', JSON.stringify(充電中リスト));
}