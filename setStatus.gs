function setMonthlyStatus(MonthlyData) {
  MonthlyData = JSON.parse(MonthlyData);

  const label = 該当月シート.getDataRange().getValues()[0];
  const 機器数 = 該当月シート.getLastRow()-1;

  for (let i=0; i<機器数; i++){
    console.log(MonthlyData[String(i)]);
    if (MonthlyData[String(i)].isChange){
      該当月シート.getRange(i+2, label.indexOf('ステータス')+1).setValue(MonthlyData[String(i)].status);
      該当月シート.getRange(i+2, label.indexOf('タイムスタンプ')+1).setValue(MonthlyData[String(i)].timestump);
    }
  }
}

function setWeeklyStatus(WeeklyData) {
  WeeklyData = JSON.parse(WeeklyData);

  const label = 該当週シート.getDataRange().getValues()[0];
  const 機器数 = 該当週シート.getLastRow()-1;

  for (let i=0; i<機器数; i++){
    if (WeeklyData[String(i)].isChange){
      該当週シート.getRange(i+2, label.indexOf('ステータス')+1).setValue(WeeklyData[String(i)].status);
      該当週シート.getRange(i+2, label.indexOf('タイムスタンプ')+1).setValue(WeeklyData[String(i)].timestump);
    }
  }
}