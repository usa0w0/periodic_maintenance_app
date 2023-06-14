function 毎時実行(){
  //　営業日かつ営業時間内のみ
  if (営業日カレンダー[Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')].status == '営業' && 9 <= now.getHours() && now.getHours() < 17){

    // 毎日実行
    const メンテナンス時刻 = Number(設定データ[設定データ.indexOf('メンテナンス時刻')+1]);
    if (メンテナンス時刻 == now.getHours()){

      // 月例点検
      const 先月実施日 = new Date(スクリプトプロパティ.getProperty('月例点検実施日'));
      if (先月実施日.getMonth() < now.getMonth()){
        sendMonthlyRemind()
      }

      // 隔週点検
      const 前回実施日 = new Date(スクリプトプロパティ.getProperty('隔週点検実施日'));
      const 間隔 = Number(設定データ[設定データ.indexOf('隔週実施の間隔')+1]);
      if (前回実施日.setDate(前回実施日.getDate() + 間隔) <= now){
        sendWeeklyRemind()
      }

      const 前回PC点検日 = new Date(スクリプトプロパティ.getProperty('PC点検実施日'));
      const PC点検間隔 = Number(設定データ[設定データ.indexOf('PC点検間隔')+1]);
      if (前回PC点検日.setDate(前回PC点検日.getDate() + PC点検間隔) <= now){
        sendPCRemind()
      }
    }

    // 経過時間リマインド
    sendProgressRemind()
  }
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

function sendPCRemind(){
  const PC検表テンプレ = システムコンテナスプレッドシート.getSheetByName('PC点検表');
  const 新規PC点検表 = PC点検表テンプレ.copyTo(PC点検DBスプレッドシート);
  新規PC点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM-dd'))

  const 通知メッセージ = '<!channel>\n' + PC通知文 + '\n<'+ アプリURL +'|点検ツール>';
  const option = {username: PC通知ボット名}
  slackApp = SlackApp.create(SlackBotトークン);
  slackApp.postMessage(通知チャンネルID, 通知メッセージ, option);

  スクリプトプロパティ.setProperty('PC点検実施日', now);
}

function sendProgressRemind(){
  const 経過時間 = Number(設定データ[設定データ.indexOf('経過時間リマインド')+1]);

  let 通知メッセージ = '↓充電が済んだ機器';
  const option = {username: '充電開始から '+経過時間+' 時間以上が経過した機器があります！'}
  
  let 充電中リスト = JSON.parse(スクリプトプロパティ.getProperty('充電中'));
  let 充電開始時間

  let 通知済みリスト = []

  充電中リスト.forEach(function(機器情報){
    充電開始時間 = new Date(機器情報.date);
    if (充電開始時間.setHours(充電開始時間.getHours() + 経過時間) <= now){
      通知メッセージ += '\n・'+機器情報.machine+' '+機器情報.id;
      通知済みリスト.push(充電中リスト.indexOf(機器情報))
    }
  })

  // 通知するものがなかった場合→終了
  if (!通知済みリスト.length){
    return
  }

  // 通知済みのものを充電中リストから削除
  通知済みリスト.sort((a,b) => (a > b ? -1 : 1)).forEach(
    x => 充電中リスト.splice(x, x+1)
  )

  通知メッセージ += '\n<'+ アプリURL +'|点検ツール>';
  slackApp = SlackApp.create(SlackBotトークン);
  slackApp.postMessage(通知チャンネルID, 通知メッセージ, option);

  スクリプトプロパティ.setProperty('充電中', JSON.stringify(充電中リスト));
}