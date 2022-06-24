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
    selectionDetails:any;
    cancelCallBack?:()=>void;

}
const ViewDocModal: React.FunctionComponent<IModalProps> = (props) => {
 

const ImageMimeTypeList =['image/jpeg','image/gif' ,'image/png','image/bmp','image/tiff']
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
            {ImageMimeTypeList.indexOf(props.selectionDetails.fileType)>-1 ? <>
            <img src={props.selectionDetails.fileBaseUrl}  style={{width: "100%",
    height: 200
}}/>
            </>:<>{
             props.selectionDetails.fileType=== "application/pdf" ?<>
             <iframe width='100%' height="300px" src={props.selectionDetails.fileBaseUrl}></iframe>
             
             
             </>:<></>
            }
            
            </>

            }
        {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers}  /> */}
        {/* <Viewer fileUrl={props.selectionDetails.fileblobUrl} /> */}
        </div>
      </Modal>
      </>
  );
};

export default ViewDocModal;
