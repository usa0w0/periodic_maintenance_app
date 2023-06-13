const スクリプトプロパティ = PropertiesService.getScriptProperties();

const システムコンテナID = '1Pa9sGHjH321c7OkyPl7pm4mH9fjw1zIxmC6WG4YGvqA';
const システムコンテナスプレッドシート = SpreadsheetApp.openById(システムコンテナID);
const 設定データ = システムコンテナスプレッドシート.getSheetByName('CONFIG').getDataRange().getValues().flat();

const 月別データベースURL = 設定データ[設定データ.indexOf('月別データベースURL')+1];
const 月別DBスプレッドシート = SpreadsheetApp.openByUrl(月別データベースURL);
const 月別DBシート一覧 = 月別DBスプレッドシート.getSheets();
// シート名でソート（最新のものが前に）
月別DBシート一覧.sort((a, b) => {
  const nameA = a.getSheetName();
  const nameB = b.getSheetName();
  if (nameA < nameB) {
    return 1;
  } else {
    return -1;
  }
})
const 該当月シート = 月別DBシート一覧[0];

const 週別データベースURL = 設定データ[設定データ.indexOf('週別データベースURL')+1];
const 週別DBスプレッドシート = SpreadsheetApp.openByUrl(週別データベースURL);
const 週別DBシート一覧 = 週別DBスプレッドシート.getSheets();
// シート名でソート（最新のものが前に）
週別DBシート一覧.sort((a, b) => {
  const nameA = a.getSheetName();
  const nameB = b.getSheetName();
  if (nameA < nameB) {
    return 1;
  } else {
    return -1;
  }
})
const 該当週シート = 週別DBシート一覧[0];

const 営業日カレンダーURL = 設定データ[設定データ.indexOf('営業日カレンダーURL')+1];
let now = new Date();
let 今年度シート名 = String(now.getFullYear());
if (now.getMonth() < 3){
  今年度シート名 = String(now.getFullYear() - 1);
}
const カレンダーシート = SpreadsheetApp.openByUrl(営業日カレンダーURL).getSheetByName(今年度シート名);
const カレンダーラベル = カレンダーシート.getDataRange().getValues()[0];
const カレンダーデータ = カレンダーシート.getDataRange().getValues().slice(1);
// yyyy-mm-dd形式の日付をkeyにしたデータオブジェクト
const 営業日カレンダー = カレンダーデータ.reduce(
    (a,x) => {
        a[Utilities.formatDate(new Date(x[カレンダーラベル.indexOf('日付')]), 'JST', 'yyyy-MM-dd')] = {
          status: x[カレンダーラベル.indexOf('営業ステータス')],
        }
        return a
    }, {}
)

const SlackBotトークン = スクリプトプロパティ.getProperty('SlackBotトークン');
const 投稿チャンネルID = 設定データ[設定データ.indexOf('投稿チャンネルID')+1];

const アプリURL = 設定データ[設定データ.indexOf('webアプリURL')+1];

const 月例通知ボット名 = 設定データ[設定データ.indexOf('月例通知ボット名')+1];
const 月例通知文 = 設定データ[設定データ.indexOf('月例点検通知')+1];

const 隔週通知ボット名 = 設定データ[設定データ.indexOf('隔週通知ボット名')+1];
const 隔週通知文 = 設定データ[設定データ.indexOf('隔週点検通知')+1];

function test(){
  return
}