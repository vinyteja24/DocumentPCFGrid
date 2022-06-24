

export function notification(){
   // alert(JSON.stringify(Xrm))
    alert("hi")
}

export function SaveDocument(data) {
    debugger;
    var entityType = data.formRecord.entityType;
    var entity = {};    

    switch (entityType) {
        case "sla_work":
            entity["sla_WorkItemTask@odata.bind"] = "/sla_works(" + data.formRecord.id.replace('{', '').replace('}', '') + ")";            
            break;
        case "sla_inspection": // add blue web resource name
            entity["sla_Inspection@odata.bind"] = "/sla_inspections(" + data.formRecord.id.replace('{', '').replace('}', '') + ")";            
            break;
    }
    entity.sla_description = data.description;
    entity.sla_documentdescription = data.file.FileBody;
    entity.sla_name = data.file.Name;
    entity.sla_mimetype = data.file.FileType;

    return new Promise(resolve => {
        Xrm.WebApi.online.createRecord("sla_document", entity).then(
            function success(result) {
                var newEntityId = result.id;
resolve(newEntityId )

            },
            function (error) {
                Xrm.Navigation.openAlertDialog(error.message);

            }
        );
    })
    
    window.close();
}
export function DeleteDocument(data) {
    debugger;
   
    if (data != null && data.id != null) {
        Xrm.WebApi.deleteRecord("sla_document", data.id)
    }
}
export function sla_work_download(data){
return new Promise(resolve => {
Xrm.WebApi.online.retrieveRecord("sla_document",data.id, "?$select=sla_documentdescription,sla_mimetype,sla_name").then(
    function success(result) {
        var sla_documentdescription = result["sla_documentdescription"];
        var sla_mimetype = result["sla_mimetype"];
        var sla_name = result["sla_name"];
resolve({contentType:sla_mimetype ,base64Data:sla_documentdescription ,fileName: sla_name })
    },
    function(error) {
        Xrm.Utility.alertDialog(error.message);
    }
);
});
}