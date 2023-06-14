function setMonthlyStatus(MonthlyData) {
  MonthlyData = JSON.parse(MonthlyData);

  const label = 該当月シート.getDataRange().getValues()[0];
  const 機器数 = 該当月シート.getLastRow()-1;

  let 充電中リスト = JSON.parse(スクリプトプロパティ.getProperty('充電中'));

  for (let i=0; i<機器数; i++){
    console.log(MonthlyData[String(i)]);
    if (MonthlyData[String(i)].isChange){
      該当月シート.getRange(i+2, label.indexOf('ステータス')+1).setValue(MonthlyData[String(i)].status);
      該当月シート.getRange(i+2, label.indexOf('タイムスタンプ')+1).setValue(MonthlyData[String(i)].timestump);

      // ステータス→充電中の場合、記録
      if (MonthlyData[String(i)].status == '充電中'){
        充電中リスト.push({
          date: MonthlyData[String(i)].timestump,
          machine: MonthlyData[String(i)].machine,
          id: MonthlyData[String(i)].id,
        })
      }
    }
  }

  スクリプトプロパティ.setProperty('充電中', JSON.stringify(充電中リスト))
}

function setWeeklyStatus(WeeklyData) {
  WeeklyData = JSON.parse(WeeklyData);

  const label = 該当週シート.getDataRange().getValues()[0];
  const 機器数 = 該当週シート.getLastRow()-1;

  let 充電中リスト = JSON.parse(スクリプトプロパティ.getProperty('充電中'));

  for (let i=0; i<機器数; i++){
    if (WeeklyData[String(i)].isChange){
      該当週シート.getRange(i+2, label.indexOf('ステータス')+1).setValue(WeeklyData[String(i)].status);
      該当週シート.getRange(i+2, label.indexOf('タイムスタンプ')+1).setValue(WeeklyData[String(i)].timestump);

      // ステータス→充電中の場合、記録
      if (WeeklyData[String(i)].status == '充電中'){
        充電中リスト.push({
          date: WeeklyData[String(i)].timestump,
          machine: WeeklyData[String(i)].machine,
          id: WeeklyData[String(i)].id,
        })
      }
    }
  }

  スクリプトプロパティ.setProperty('充電中', JSON.stringify(充電中リスト))
}

function setPCStatus(PCData) {
  PCData = JSON.parse(PCData);

  const label = 該当週シート.getDataRange().getValues()[0];
  const 機器数 = 該当週シート.getLastRow()-1;

  let 充電中リスト = JSON.parse(スクリプトプロパティ.getProperty('充電中'));

  for (let i=0; i<機器数; i++){
    if (PCData[String(i)].isChange){
      該当週シート.getRange(i+2, label.indexOf('ステータス')+1).setValue(PCData[String(i)].status);
      該当週シート.getRange(i+2, label.indexOf('タイムスタンプ')+1).setValue(PCData[String(i)].timestump);

      // ステータス→充電中の場合、記録
      if (PCData[String(i)].status == '充電中'){
        充電中リスト.push({
          date: PCData[String(i)].timestump,
          machine: PCData[String(i)].machine,
          id: PCData[String(i)].id,
        })
      }
    }
  }

  スクリプトプロパティ.setProperty('充電中', JSON.stringify(充電中リスト))
}