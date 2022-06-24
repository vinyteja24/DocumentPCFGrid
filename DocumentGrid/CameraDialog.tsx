import { ActionButton, FontWeights, getTheme, IButtonStyles, Icon, IconButton, IDragOptions, IIconProps, mergeStyleSets, Modal, values } from '@fluentui/react';
import { useRefEffect } from '@fluentui/react-hooks';
import * as React from 'react';
import { useRef } from 'react';
import Camera from 'react-html5-camera-photo';
import { IInputs } from './generated/ManifestTypes';
import { IFileProps } from './grid';
const theme = getTheme();
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};
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
  interface ICameraModalProps {
    isOpen:boolean;
    Header:string;
    for:string;
    callBack?:(modalData:any)=>void;
    cancelCallBack?:()=>void;
    crmContext:ComponentFramework.Context<IInputs>;

    
}
const CameraModal: React.FunctionComponent<ICameraModalProps> = (props) => {
  const [cameraPicture,setcameraPicture]=React.useState(false);
  const [ImageSrc,setImageSrc]=React.useState<string>("");
  const descriptionRef=useRef(null);
  const videoRef = useRef(null);
  const ImgRef=useRef(null);
  const ctx =useRef(null);
 React.useEffect(()=>{
   if(props.crmContext.client.getFormFactor()!=2 && props.crmContext.client.getFormFactor()!=3){
 
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream:any)=>{
    if(videoRef.current)
        (videoRef.current as any).srcObject = stream;
  })
}
 
 },[])

  return (
      <>
      <Modal isOpen={true} key={'camera'} isBlocking={true}  dragOptions={{
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
          <div style={{display:'grid',textAlign:'center'}} id="videoContainer">
      <div>{ (props.crmContext.client.getFormFactor()==2 || props.crmContext.client.getFormFactor()==3) ? <>
    
      <img src=""  ref={ImgRef} alt='Take Picture' width="320" height="240"  style={{borderRadius: 5}}/>
  
    
        
         </>:<>
         
         <video id="video" width="320" height="240" autoPlay  ref={videoRef}  style={{borderRadius: 5}} ></video>
         </>
        }
        
      </div>
      <div>
      <input type={'text'}  ref={descriptionRef}  placeholder='Description' style={{width: 300,
    borderRadius: 5,marginTop:5}}/>
      </div>
      <div> 
        <div>

         
        </div>
        {(props.crmContext.client.getFormFactor()!=2 && props.crmContext.client.getFormFactor()!=3) &&
 <ActionButton iconProps={{iconName:'Refresh'}}  onClick={()=>{
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream:any)=>{
      if(videoRef.current)
          (videoRef.current as any).srcObject = stream;
    })
    
  }}>Start Camera</ActionButton>
}
<ActionButton iconProps={{iconName:'Photo2Add'}} onClick={()=>{
  debugger;
  if(ctx.current){
    if(props.crmContext.client.getFormFactor()==2 || props.crmContext.client.getFormFactor()==3){
      props.crmContext.device.captureImage({height:240,preferFrontCamera:true,width:320,allowEdit:false,quality:100}).then((Value:ComponentFramework.FileObject)=>{
        const linkSource = `data:${Value.mimeType};base64,${Value.fileContent}`;
        //setImageSrc(linkSource)
        var image = new Image();
image.onload = function() {
  
        (ctx.current as any).getContext('2d').drawImage(image, 0, 0,(ctx.current as any).width, (ctx.current as any).height)
        let timeNow = new Date();
        (ctx.current as any).fillStyle = "#fff";
        (ctx.current as any).getContext('2d').fillText(timeNow, 0,  (ctx.current as any).height)

        // save to file
        const timestamped = (ctx.current as any).toDataURL(Value.mimeType);

        
        let fileObj ={ FileBody:timestamped.split(';base64,')[1],FileType:Value.mimeType,Name:`${( descriptionRef.current as any).value!="" ? (descriptionRef.current as any).value : (new Date()).toLocaleString() }`} as IFileProps;
        let obj:any ={description:(descriptionRef.current as any).value,file:fileObj}
        if(props.callBack){
           props.callBack(obj)
        }   
 }
 image.src=linkSource; 
 if(ImgRef.current){
  (ImgRef.current as any).src=linkSource;
 }

      })
      }
      else{
      (ctx.current as any).getContext('2d').drawImage(videoRef.current, 0, 0, (ctx.current as any).width, (ctx.current as any).height);
      let image_data_url =  (ctx.current as any).toDataURL('image/jpeg');
      const sc = image_data_url
      const img = new Image()
      img.src = sc
      img.onload = () => {
          // load the screenshot to another canvas
         
          (ctx.current as any).getContext('2d').drawImage(img, 0, 0)
          // add time stamp
          let timeNow = new Date();
          (ctx.current as any).fillStyle = "#fff";
          (ctx.current as any).getContext('2d').fillText(timeNow, 0,  (ctx.current as any).height)
  
          // save to file
          const timestamped = (ctx.current as any).toDataURL('image/jpeg');
          if(videoRef.current)
             (videoRef.current as any).srcObject = null;
          const type = timestamped.split(';')[0].split('/')[1];
          let fileObj ={ FileBody:timestamped.split(';base64,')[1],FileType:'image/jpeg',Name:`${( descriptionRef.current as any).value!="" ? (descriptionRef.current as any).value : (new Date()).toLocaleString() }.jpeg`} as IFileProps;
          let obj:any ={description:(descriptionRef.current as any).value,file:fileObj}
          if(props.callBack)
             props.callBack(obj)
      }
      }
    }
}} >Take Picture</ActionButton>
<canvas id="canvas" width="320" height="240"  style={{display:'none'}}  ref={ctx}></canvas>
</div>
</div>
        </div>
      </Modal>
      </>
  );
};

export default CameraModal;
