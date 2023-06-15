function init(){
  const ui = SpreadsheetApp.getUi();

  // プロンプトダイアログを表示
  if (トークン入力() == '終了'){
    return
  }
  if (通知テスト() == '終了'){
    return
  }
  点検データベース作成()
  ui.alert(
    '初期設定 完了',
    '全ての準備が終わりました。最後に、GASデプロイを作成してください。',
    ui.ButtonSet.OK
  )
}

function トークン入力(){
  const ui = SpreadsheetApp.getUi();
  
  // トークン入力
  const トークン入力プロンプト = ui.prompt(
    '初期設定 1/n',
    'Slack通知のために、チャンネルへの送信権限を付与したトークンを入力してください。',
    ui.ButtonSet.OK_CANCEL
  );
  if (トークン入力プロンプト.getSelectedButton() == ui.Button.OK){
    if (トークン入力プロンプト.getResponseText()){
      ui.alert('初期設定 1/n', '入力を受け付けました。');
      スクリプトプロパティ.setProperty('SlackBotトークン', トークン入力プロンプト.getResponseText());
      return '継続';
    } else {
      ui.alert('初期設定 1/n', 'トークンが入力されていません。初めからやり直してください。', ui.ButtonSet.OK);
      return '終了';
    }
  } else {
    ui.alert('初期設定 1/n', '処理をキャンセルします。初めからやり直してください。', ui.ButtonSet.OK);
    return '終了';
  }
}

function 通知テスト(){
  const ui = SpreadsheetApp.getUi();

  // 通知テスト
  const 通知テストプロンプト = ui.alert(
    '初期設定 2/n',
    'Slack通知のテストを行います。[通知チャンネルID]は入力されていますか？',
    ui.ButtonSet.YES_NO_CANCEL
  );

  // トークンが設定済みであることを確認
  const SlackBotトークン = スクリプトプロパティ.getProperty('SlackBotトークン');
  if (!SlackBotトークン){
    ui.alert('初期設定 2/n', 'トークンが設定されていません。初めからやり直してください。', ui.ButtonSet.OK);
    return '終了';
  }
  
  switch (通知テストプロンプト){
    case ui.Button.YES:
      slackApp = SlackApp.create(SlackBotトークン);
      slackApp.postMessage(通知チャンネルID, 'テストメッセージです', {username: 点検管理ツール});
      if (ui.alert('初期設定 2/n', 'テストメッセージがslackに送信されましたか？\n届いていない場合には、[キャンセル]から初期設定を終了してください。', ui.ButtonSet.OK_CANCEL) == ui.Button.OK){
        return '継続';
      } else {
        ui.alert('初期設定 2/n', '処理をキャンセルします。初めからやり直してください。', ui.ButtonSet.OK);
        return '終了';
      }
      break;
    case ui.Button.NO:
      ui.alert('初期設定 2/n', '処理をキャンセルします。[通知チャンネルID]入力後、初めからやり直してください。', ui.ButtonSet.OK);
      return '終了';
    case ui.Button.CANCEL:
    case ui.Button.CLOSE:
      ui.alert('初期設定 2/n', '処理をキャンセルします。初めからやり直してください。', ui.ButtonSet.OK);
      return '終了';
  }
}

function 点検データベース作成(){
  const ui = SpreadsheetApp.getUi();
  
  // DB作成プロンプト
  const DB作成プロンプト = ui.alert(
    '初期設定 3/n',
    '点検表を保管するDBスプレッドシートを新規作成しますか？',
    ui.ButtonSet.YES_NO
  );

  if (DB作成プロンプト == ui.Button.YES){
    月別DBスプレッドシート = SpreadsheetApp.create('新規-月例点検表');
    週別DBスプレッドシート = SpreadsheetApp.create('新規-隔週点検表');
    PC点検DBスプレッドシート = SpreadsheetApp.create('新規-PC点検表');
    システムコンテナID.getRange('B2').setValue(月別DBスプレッドシート.getUrl())
    システムコンテナID.getRange('B3').setValue(週別DBスプレッドシート.getUrl())
    システムコンテナID.getRange('B4').setValue(PC点検DBスプレッドシート.getUrl())
    ui.alert('初期設定 3/n', 'DBスプレッドシートを作成しました。', ui.ButtonSet.OK);
    return '継続';
  } else {
    ui.alert('初期設定 3/n', '次に進みます。データベースURLは、CONFIGシート内に必ず入力してください。', ui.ButtonSet.OK);
    return '継続';
  }
}