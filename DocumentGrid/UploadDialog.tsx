import { ActionButton, FontWeights, getTheme, IButtonStyles, Icon, IconButton, IDragOptions, IIconProps, mergeStyleSets, Modal } from '@fluentui/react';
import * as React from 'react';
import * as $ from "jquery";

const theme = getTheme();
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: [
      // eslint-disable-next-line deprecation/deprecation
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      },
    },
  });
  const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
  interface IModalProps {
    isOpen:boolean;
    Header:string;
    for:string;
    callBack?:(modalData:any)=>void;
    cancelCallBack?:()=>void;

}
const UploadModal: React.FunctionComponent<IModalProps> = (props) => {
  const descriptionRef=React.useRef(null);
  const [fileLengthError,setfileLengthError]= React.useState<string>("")
   const [fileList,setfileList]= React.useState<any>([])
   const [dragText,setdragText]= React.useState('Drag & Drop to Upload File')
   const  uploadFileControl =React.useRef(null);
   const DragDropControl =React.useRef(null);
   const DragTextControl =React.useRef(null);
  React.useEffect(()=>{
      $(document).ready(()=>{
        const dropArea =  document.getElementById('dropArea')
        const dragText =  document.getElementById('dragText')
      if(dropArea && dragText)
      {
          //const dropArea =DragDropControl.current as HTMLDivElement;
         //const  dragText = DragTextControl.current ? DragTextControl.current as HTMLHeadingElement :document.createElement('header')
          //If user Drag File Over DropArea
        dropArea.addEventListener("dragover", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        dropArea.classList.add("active");
       // dragText.textContent = ;
       // setdragText("Release to Upload File")
      });
      //If user leave dragged File from DropArea
      dropArea.addEventListener("dragleave", ()=>{
        dropArea.classList.remove("active");
       // dragText.textContent = "Drag & Drop to Upload File";
      });
      //If user drop File on DropArea
      dropArea.addEventListener("drop", (event:any)=>{
        fileUpload(event,1)
      });
    }
      })
    

  },[])

  const fileUpload=(event:any,type:number)=>{
    event.preventDefault(); //preventing from default behaviour
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        let file:File = type==1 ? event.dataTransfer.files[0] : event.target.files[0];
        if(file){
              if(file.size > (25 * 1000000)) {
                setdragText("Drag & Drop to Upload File")
                        setfileList([]);
                        const dropArea =  document.getElementById('dropArea')
                        if(dropArea)
                             dropArea.classList.remove("active");
                        if(uploadFileControl.current)
                            (uploadFileControl.current as any).value=''
                     setfileLengthError("File Size Exceeded Cannot add file size more than 2MB.");
              }
              else{
                let newList =[];
                newList.push(file)          
                 setfileList([...newList])
              }
           
             
        }
        //calling function
    
  }

  return (
      <>
      <Modal isOpen={true} key={'upload'} isBlocking={true} dragOptions={{
        keepInBounds:true,
        moveMenuItemText:'Move'
      } as IDragOptions} >
      <div className={contentStyles.header}>
          <span>{props.Header}</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={():void=>{
                if(props.cancelCallBack)
                    props.cancelCallBack();
            }}
          />
        </div>
        <div className={contentStyles.body}>
            
            <div className="drag-area"  ref={DragDropControl} id='dropArea'>
            <div className="icon">
                <Icon iconName='CloudUpload' styles={{root:{fontSize:'50px'}}} />
            </div>
            <header ref={DragTextControl} id='dragText'>{dragText}</header>
            <span>OR</span><br/>
            <a href='javascript:void' onClick={()=>{
             
              if(uploadFileControl.current){
                  (uploadFileControl.current as any).click()
              }
            }}>Browse File</a>

            <input type={'file'} ref={uploadFileControl} style={{display:'none'}} onChange={(e:any)=>{fileUpload(e,0)}}/>
            </div>
            <div>
            <div>
      <input type={'text'}  ref={descriptionRef}  placeholder='Description'   style={{width: '98%',
    borderRadius: 5,marginTop:5}}/>
      </div>
      <div>
        {fileLengthError !="" &&
          <span style={{color:"red"}}>{fileLengthError}</span>
        }
        </div>
      <div style={{display:''}}>
      <div>
            {
                fileList.map((item:File)=>(<>
                <div>
                    <span>{item.name}</span><IconButton
                    //styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close popup modal"   
                    onClick={():void=>{
                        setdragText("Drag & Drop to Upload File")
                        setfileList([]);
                        const dropArea =  document.getElementById('dropArea')
                        if(dropArea)
                             dropArea.classList.remove("active");
                        if(uploadFileControl.current)
                            (uploadFileControl.current as any).value=''
                    }}
                  /></div>
               </> ))
            }
        </div>
        
        <div style={{float:'right'}}>
          <ActionButton iconProps={{iconName:'Save'}}  onClick={()=>{
            let obj:any ={description:(descriptionRef.current as any).value,file:fileList[0]}
            if(props.callBack)
               props.callBack(obj)
          }}>Save</ActionButton>
        </div>
        </div>
        </div>
        </div>
      </Modal>
      </>
  );
};

export default UploadModal;
