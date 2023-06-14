function doGet() {
  var html = HtmlService.createTemplateFromFile('index');
  html.user = JSON.stringify(ログインユーザー)
  html.MonthlyData = getStatus(該当月シート);
  html.WeeklyData = getStatus(該当週シート);
  html.PCData = getStatus(該当PC点検シート);
  return html.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle('定期点検ツール');
}