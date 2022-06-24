import { CommandBar, CommandBarButton, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IContextualMenuProps, IIconProps, IObjectWithKey, ISelection, Selection, SelectionMode} from '@fluentui/react';
import * as React from 'react'
import { useEffect, useState } from 'react';
import CameraModal from './CameraDialog';
import { IInputs } from './generated/ManifestTypes';
import UploadModal from './UploadDialog';
import ViewDocModal from './ViewDoc';
import {Helmet} from "react-helmet";
import  {DeleteDocument, notification, SaveDocument, sla_work_download} from './Logical.js';
import { triggerBase64Download } from 'react-base64-downloader';

const FILE_ICONS: { name: string }[] = [
  { name: 'accdb' },
  { name: 'audio' },
  { name: 'code' },
  { name: 'csv' },
  { name: 'docx' },
  { name: 'dotx' },
  { name: 'mpp' },
  { name: 'mpt' },
  { name: 'model' },
  { name: 'one' },
  { name: 'onetoc' },
  { name: 'potx' },
  { name: 'ppsx' },
  { name: 'pdf' },
  { name: 'photo' },
  { name: 'pptx' },
  { name: 'presentation' },
  { name: 'potx' },
  { name: 'pub' },
  { name: 'rtf' },
  { name: 'spreadsheet' },
  { name: 'txt' },
  { name: 'vector' },
  { name: 'vsdx' },
  { name: 'vssx' },
  { name: 'vstx' },
  { name: 'xlsx' },
  { name: 'xltx' },
  { name: 'xsn' },
];
export interface IFileProps {
	Name: string;
	FileType: string;
	FileBody: string;
}
export interface IModalData {
  description?:string;
  file:any;
}
interface ISubGridProps {
    gridRecords: any[];
    crmContext:ComponentFramework.Context<IInputs>;
}
const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'emailMessage',
        text: 'Email message',
        iconProps: { iconName: 'Mail' },
      },
      {
        key: 'calendarEvent',
        text: 'Calendar event',
        iconProps: { iconName: 'Calendar' },
      },
    ],
  };
  const addIcon: IIconProps = { iconName: 'Add' };
  const mailIcon: IIconProps = { iconName: 'Mail' };
const editableGrid = (props: ISubGridProps) => {
  
    const [columns, setcolumns] = useState<IColumn []>([]);
    const [rows,setRows] =useState<any[]>([]);
    const [viewData,setViewData] =useState<any>()
    const [fileUploadDialogOpen,setfileUploadDialogOpen] =useState(false);
    const [cameraDialogOpen,setcameraDialogOpen] =useState(false);
    const [viewDialogOpen,setviewDialogOpen] =useState(false);
    const [selectionDetails,setselectionDetails]=useState<IObjectWithKey>();
    const camerafile= React.useRef(null);
  
     let selection=new Selection(
      {
        onSelectionChanged: () => {
          setselectionDetails(selection.getSelection()[0])
        }
    })
     


    useEffect(() => {
        getGenerateColumn();
        setRows(props.gridRecords);
        
    }, [props])

    const getGenerateColumn =():void=> {
        let gridControlContext = props.crmContext;
        let gridRecords = gridControlContext.parameters.subGridDataSet;
       
        let columnList: any = [];
        gridRecords.columns.forEach(function (colitem: any, idx: any) {
            let colwith = (colitem.visualSizeFactor || 150) //+
            let Column: IColumn ={
                key: colitem.name + "_" + idx
                , minWidth: colwith - 50
                , maxWidth: colwith
                , name: colitem.displayName
                , isRowHeader: false
                , isResizable: true
                , isCollapsible: false
                , isSorted: false,
                isSortedDescending: false
                , fieldName: colitem.name
                , data: colitem.dataType
                , onRender: (ele: any,cellindex?: number) => {
                  
                    return (<><span>{ele[colitem.name]}</span></>
                    )
                }
            }
            columnList.push(Column);
        

        });

        setcolumns(columnList);
    }
    const DocUploadSave=(Param:IModalData)=>{
      //props.crmContext.device.getCurrentPosition().then(())
      toBase64(Param.file).then((baseData:any)=>{
        let filobj:any =baseData.file;
        if(filobj){
          let saveObj:any={}
          let fileObj ={ FileBody:baseData.docobj,FileType:filobj.type,Name:filobj.name} as IFileProps;
          saveObj.description = Param.description
          saveObj.file =fileObj;
          saveObj.formRecord = {
            id:`{${(props.crmContext as any ).page.entityId}}`,            
            entityType:(props.crmContext as any ).page.entityTypeName}  
            SaveDocument(saveObj);
                props.crmContext.parameters.subGridDataSet.refresh();
          setfileUploadDialogOpen(false)
          // let saveCallBack:any =props.crmContext.parameters.CallBackSaveFunction.raw ?? "";
          // if(saveCallBack && saveCallBack!=""){
          //   if(typeof (window as any)[saveCallBack] == 'function'){
          //     (window as any)[saveCallBack](saveObj)?.then((data:any)=>{
          //         props.crmContext.parameters.subGridDataSet.refresh();
          //         setfileUploadDialogOpen(false)
          //     })
          //   }
            // else{
              
            // }
         // }
          
        }

      });

    }
     const CameraSave=(Param:IModalData)=>{
         let SaveObj:any =Param;
         SaveObj.formRecord = {
          id:`{${(props.crmContext as any ).page.entityId}}`,            
          entityType:(props.crmContext as any ).page.entityTypeName}         
          SaveDocument(SaveObj).then((data:any)=>{
            props.crmContext.parameters.subGridDataSet.refresh();
            setcameraDialogOpen(false);
        })
          //props.crmContext.parameters.subGridDataSet.refresh();   
      //  let saveCallBack:any =props.crmContext.parameters.CallBackSaveFunction.raw ?? "";
        // if(saveCallBack && saveCallBack!=""){
        //   if(typeof (window as any)[saveCallBack] == 'function'){
        //     (window as any)[saveCallBack](SaveObj)?.then((data:any)=>{
        //         props.crmContext.parameters.subGridDataSet.refresh();
        //         setcameraDialogOpen(false);
        //     })
        //   }
        // }
    }
    const toBase64 = (file:any) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result){
          resolve({docobj:(reader.result as string).split(';base64,')[1],file:file});}
        
        else{
          resolve({docobj:"",file:file});}
        }
      

      reader.onerror = error => reject(error);
  });

  // const _selection =():Selection => {return new Selection({
  //   onSelectionChanged: () => {
  //     setselectionDetails()
  //     this.setState({
  //       selectionDetails: this._getSelectionDetails(),
  //     });
  //   },
  // })};
  const b64toBlob = (b64Data:any, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) 
       {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


const _items: ICommandBarItemProps[] = [
    {
      key: 'upload',
      text: 'Upload',
      iconProps: { iconName: 'Upload' },
      onClick: () => {       
        setfileUploadDialogOpen(true);
      }
    },
    {
      key: 'camera',
      text: 'camera',
     // disabled:props.crmContext.client.getFormFactor() ==2 || props.crmContext.client.getFormFactor() ==3 ?true :false,
      iconProps: { iconName: 'Camera' },
      onClick: () => {
        setcameraDialogOpen(true)
        // if (camerafile.current)
        //     (camerafile.current as any).click()
      },
    },
    {
      key: 'download',
      text: 'Download',
      disabled: selectionDetails ? false:true,
      iconProps: { iconName: 'Download' },
      onClick: () => {

        sla_work_download(selectionDetails).then((data:any)=>{
          const linkSource = `data:${data.contentType};base64,${data.base64Data}`;
          triggerBase64Download(linkSource, 'my_download_name')
         // const blob = b64toBlob(data.base64Data, data.contentType);
          //  const blobUrl = URL.createObjectURL(blob);
          // window.open(blobUrl);
            // const downloadLink = document.createElement("a");
            // downloadLink.href = linkSource;
            // downloadLink.download = data.fileName;
            // downloadLink.click();
        })
        let downloadCallBack:any = `${(props.crmContext as any)?.page.entityTypeName }_download`;
     
        if(typeof (window as any)[downloadCallBack] == 'function'){
          (window as any)[downloadCallBack](selectionDetails).then((data:any)=>{
            const linkSource = `data:${data.contentType};base64,${data.base64Data}`;
            const blob = b64toBlob(data.base64Data, data.contentType);
            const blobUrl = URL.createObjectURL(blob);
           window.open(blobUrl);
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = data.fileName;
            downloadLink.click();
          })
        }
     
      },
    },
    {
      key: 'view',
      text: 'View',
      disabled: selectionDetails ? false:true,
      iconProps: { iconName: 'View' },
      onClick: () => {
//         var mtype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
// var url = 'data:' + mtype + ';base64,' + base64data;
// window.open(url);
let ViewCallBack:any = `${(props.crmContext as any)?.page.entityTypeName }_download`;
     
// if(typeof (window as any)[ViewCallBack] == 'function'){
//   (window as any)[ViewCallBack](selectionDetails).then((data:any)=>{
//     const linkSource = `data:${data.contentType};base64,${data.base64Data}`;
//     const blob = b64toBlob(data.base64Data, data.contentType);
//     const blobUrl = URL.createObjectURL(blob);
//    // window.open(blobUrl);
//    setViewData({fileBaseUrl:linkSource,fileblobUrl:blobUrl,fileType:data.contentType,fileData:data.base64Data})
//    setviewDialogOpen(true)
//   })
// }
sla_work_download(selectionDetails).then((data:any)=>{
  const linkSource = `data:${data.contentType};base64,${data.base64Data}`;
  const blob = b64toBlob(data.base64Data, data.contentType);
    const blobUrl = URL.createObjectURL(blob);
    setViewData({fileBaseUrl:linkSource,fileblobUrl:blobUrl,fileType:data.contentType,fileData:data.base64Data})
   setviewDialogOpen(true)
   //window.open(blobUrl);
    // const downloadLink = document.createElement("a");
    // downloadLink.href = linkSource;
    // downloadLink.download = data.fileName;
    // downloadLink.click();
})
}
       // setviewDialogOpen(true)},
    },
    {
      key: 'delete',
      text: 'Delete',
      disabled: selectionDetails ? false:true,
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        let deletCallBack:any =props.crmContext.parameters.CallBackDeleteFunction.raw ?? "";
        DeleteDocument(selectionDetails);
        props.crmContext.parameters.subGridDataSet.refresh();
        // if(deletCallBack && deletCallBack!=""){
        //   if(typeof (window as any)[deletCallBack] == 'function'){
        //     (window as any)[deletCallBack](selectionDetails)?.then((data:any)=>{
        //         props.crmContext.parameters.subGridDataSet.refresh();
        //     })
        //   }
        // }
      },
    }
  ];
  
    return (
        <div style={{display:'grid'}}>
           <Helmet>
                <script src="https://use.typekit.net/foobar.js"></script>
                {/* <script>try{Typekit.load({ async: true });}catch(e){}</script> */}
            </Helmet>
  <input type={'file'}  accept="image/*" capture style={{display:'none'}} ref={camerafile}/> 
 <CommandBar
        items={_items}
        ariaLabel="actions"
        
        styles={{root:{float:'right'}}}
      />
      {/* {rows && rows.length>0 ? */}
            <DetailsList
                        items={rows}
                        columns={columns}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selection={selection}
                        selectionMode={SelectionMode.single}
                        selectionPreservedOnEmptyClick={true} 
                        // onItemInvoked={(item?: any, index?: number, ev?: Event) => {
                        //   debugger;
                        //   console.log(item)
                        // } }         
                    />
                    {/* :<>No Data</>
                    } */}
                {fileUploadDialogOpen ?    
            <UploadModal isOpen={fileUploadDialogOpen} Header={'FileUpload'} for='fileUpload' callBack={(data:IModalData)=>{DocUploadSave(data)
           
           }} cancelCallBack={()=>{ setfileUploadDialogOpen(false)}} /> :<></>
} 
{
  cameraDialogOpen ?<CameraModal isOpen={cameraDialogOpen} Header={'Take Picture'} for='Picture' crmContext={props.crmContext} callBack={(data:IModalData)=>{
 CameraSave(data)
 }} cancelCallBack={()=>{ setcameraDialogOpen(false)}} /> :<></>
}
{
  viewDialogOpen ?<ViewDocModal isOpen={viewDialogOpen} Header={'View File'} for='ViewPicture'  selectionDetails={viewData} cancelCallBack={()=>{ setviewDialogOpen(false)}} /> :<></>
   }

        </div>
   
      

    )
}

export default editableGrid
