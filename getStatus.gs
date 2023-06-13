function getStatus(シート) {
  const シートデータ = シート.getDataRange().getValues();
  const label = シートデータ[0]
  let machine
  let data = {}

  let index = 0
  シートデータ.slice(1).forEach(
    function(row){
      // 機種登録
      if (row[label.indexOf('機種')] != ''){
        machine = row[label.indexOf('機種')]
      }

      // ID追加
      data[index] = {
        machine: machine,
        id: row[label.indexOf('ID')], 
        status: row[label.indexOf('ステータス')], 
        timestump: row[label.indexOf('タイムスタンプ')], 
        staff: row[label.indexOf('スタッフ名')],
        isChange: false,
      }

      // インクリメント
      index += 1
    }
  );

  return JSON.stringify(data);
}