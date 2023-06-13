/*
リマインダーが必要なタイミング
- 充電中からn時間経過
- 月初タイミング
- 隔週点検のタイミング
*/

function 毎時実行(){
  //　営業日のみ
  if (営業日カレンダー[Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')] == '営業'){

    // 毎日実行
    const メンテンナンス開始時間 = Number(設定データ[設定データ.indexOf('メンテンナンス開始時間')+1]);
    const メンテンナンス終了時間 = Number(設定データ[設定データ.indexOf('メンテンナンス終了時間')+1]);
    if (メンテンナンス開始時間 <= now.getHours() < メンテンナンス終了時間){

      // 月例点検
      const 先月実施日 = new Date(スクリプトプロパティ.getProperty('月例点検実施日'));
      if (先月実施日.getMonth < now.getMonth()){
        sendMonthlyRemind()
      }

      // 隔週点検
      const 前回実施日 = new Date(スクリプトプロパティ.getProperty('隔週点検実施日'));
      const 間隔 = Number(設定データ[設定データ.indexOf('隔週間隔')+1]);
      if (Utilities.formatDate(前回実施日.setDate(前回実施日.getDate() + 間隔), 'JST', 'yyyy-MM-dd') <= Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')){
        sendWeeklyRemind()
      }
    }
  }
}

function sendMonthlyRemind(){
  const 月例点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('月例点検表');
  const 新規月例点検表 = 月例点検表テンプレ.copyTo(月別DBスプレッドシート);
  新規月例点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM'))

  スクリプトプロパティ.setProperty('月例点検実施日', now);
}

function sendWeeklyRemind(){
  const 隔週点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('隔週点検表');
  const 新規隔週点検表 = 隔週点検表テンプレ.copyTo(週別DBスプレッドシート);
  新規隔週点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM-dd'))

  スクリプトプロパティ.setProperty('隔週点検実施日', now);
}