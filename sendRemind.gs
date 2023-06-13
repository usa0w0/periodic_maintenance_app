/*
リマインダーが必要なタイミング
- 充電中からn時間経過
- 月初タイミング
- 隔週点検のタイミング
*/

function 毎時実行(){
  //　営業日のみ
  if (営業日カレンダー[Utilities.formatDate(now, 'JST', 'yyyy-MM-dd')].status == '営業'){

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
      const 間隔 = Number(設定データ[設定データ.indexOf('隔週間隔（日数）')+1]);
      if (前回実施日.setDate(前回実施日.getDate() + 間隔) <= now){
        sendWeeklyRemind()
      }
    }
  }
}

function sendMonthlyRemind(){
  const 月例点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('月例点検表');
  const 新規月例点検表 = 月例点検表テンプレ.copyTo(月別DBスプレッドシート);
  新規月例点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM'))

  console.log('月例点検の日です')

  スクリプトプロパティ.setProperty('月例点検実施日', now);
}

function sendWeeklyRemind(){
  const 隔週点検表テンプレ = システムコンテナスプレッドシート.getSheetByName('隔週点検表');
  const 新規隔週点検表 = 隔週点検表テンプレ.copyTo(週別DBスプレッドシート);
  新規隔週点検表.setName(Utilities.formatDate(now, 'JST', 'yyyy-MM-dd'))

  console.log('隔週点検の日です')

  スクリプトプロパティ.setProperty('隔週点検実施日', now);
}