 //чистка таблицы рекордов
 function clearRecordScale() {
    var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    var updatePassword;
    var stringName = 'Andreeva_ScaleRecords';
    updatePassword = Math.random();
    $.ajax( {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
            data: { f: 'LOCKGET', n: stringName, p: updatePassword },
            success: lockGetReady.bind(this), error: errorHandler
        }
    );     

    function lockGetReady(callresult) {
        if ( callresult.error!=undefined ) {
            alert(callresult.error);
        }
        else {
            var recordsTable = JSON.parse(callresult.result);
            for (var i=0; i<recordsTable.length;i++) {
                var decision = confirm(recordsTable[i].name + " with " + recordsTable[i].score + ". Do you want to delete?");
                if (decision) {
                    recordsTable.splice(i, 1);  
                }
            }
            $.ajax({
                url : ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
                data : { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
                success : updateReady, error : errorHandler
            });
        }
    }

    function updateReady(callresult) {
        if ( callresult.error!=undefined ) {
            alert(callresult.error);
        }
    }
  
    function errorHandler(jqXHR,statusStr,errorStr) {
        alert(statusStr + ' ' + errorStr);
    }
}

setTimeout(clearRecordScale,3000);