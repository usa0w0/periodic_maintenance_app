function doGet() {
  var html = HtmlService.createTemplateFromFile('index');
  html.MonthlyData = getStatus(該当月シート);
  html.WeeklyData = getStatus(該当週シート);
  return html.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle('定期点検ツール');
}