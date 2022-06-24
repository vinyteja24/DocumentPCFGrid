import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import { createRoot } from 'react-dom/client';
import * as  React  from "react";
import editableGrid from "./grid";


export class DocumentGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    _mainContainer:HTMLDivElement;
    _context: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this._mainContainer=container;;
        this._context =context;
        this.loadjscssfile(context.parameters.CallBackWebResourceName.raw ?? "" ,"js")

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        if (!context.parameters.subGridDataSet.loading) {
			if (context.parameters.subGridDataSet.paging != null && context.parameters.subGridDataSet.paging.hasNextPage == true) {
				context.parameters.subGridDataSet.paging.setPageSize(5000);
				context.parameters.subGridDataSet.paging.loadNextPage();
			}
			else {
               let contextViewData:any [] = this.getViewData(context)
                const root = createRoot(this._mainContainer);

                root.render(React.createElement(editableGrid,{
                    gridRecords:contextViewData,
                    crmContext:context			
                }));
		        // ReactDOM.render(React.createElement(MyTable,{...this.getViewData(context),crmContext:context}),this._mainContainer)
			}
		}
    }
    

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }

    public getViewData(context: ComponentFramework.Context<IInputs>): any[] {
		let gridDataSet = context.parameters.subGridDataSet;
		let columnDatalist: any[] = [];
		gridDataSet.sortedRecordIds.map(function (item: any) {
			let record = gridDataSet.records[item];
			let currentGridId = record.getRecordId();
			let ColumnData: any = {};
			gridDataSet.columns.forEach(function (colItem: any, idx: any) {
				ColumnData.key = item + "_" + idx;
				ColumnData[colItem.name] = gridDataSet.records[currentGridId].getFormattedValue(colItem.name);
				ColumnData.url = "";
				ColumnData.id = currentGridId;
				ColumnData.columnobj = gridDataSet.records[currentGridId].getValue(colItem.name);
				ColumnData[colItem.name + "_Obj"] = gridDataSet.records[currentGridId].getValue(colItem.name);
			});
			columnDatalist.push(ColumnData);
		});
		return columnDatalist;
	}
    public loadjscssfile=(filename:string, filetype:string):void=>{
        var fileref:any =undefined;
         if (filetype=="js"){ 
           fileref=document.createElement('script')
         fileref.setAttribute("type","text/javascript")
          fileref.setAttribute("src", filename)
        }
    
        if (typeof fileref!="undefined"){
             document.getElementsByTagName("body")[0].appendChild(fileref);
             fileref.onload=()=>{
             console.log("loading done");
            
            }
        }
       
    }
        
}
