"use strict";
// import { IStorage, StorageEventNotification } from "./interfaces/storageInterface";
// export class LocalStorage implements IStorage{
//     eventNotification = new StorageEventNotification();
//     private _data;
//     private _location:string = "LocalStorageDefaultId";
//     /**
//      * Defines an id for the location in the local storage
//      *
//      * @param {string} location
//      * @memberof LocalStorage
//      */
//     connectStorage(location: string){
//         this._location = location;
//     }    
//     /**
//      * load data from the local storage
//      *
//      * @returns {*}
//      * @memberof LocalStorage
//      */
//     loadData(): any {
//         let data = {}
//         let keys = Object.keys(localStorage)
//         for(let key of keys){
//             let item = localStorage.getItem(key)
//             if(item != undefined){
//                 data[key] = JSON.parse(item)
//             }
//         }
//         this._data = data;
//         /*let data = localStorage.getItem(this._location);
//         if(data != undefined){
//             let dataObject = JSON.parse(data);
//             this._data =  dataObject;
//         } */       
//     }
//     /*retrieveData() : any{
//         if(this._data != undefined){
//             return this._data
//         }
//         else {
//             console.log("data not defined");
//         }
//     }*/
//     /**
//      * Saves the data to local storage
//      *
//      * @param {*} data
//      * @memberof LocalStorage
//      */
//     saveData(key: string,data: any) {
//         let dataString = JSON.stringify(data);
//         let dataLength = dataString.length; // LocalStorage not working with data larger then round about 5.200.000 characters(differs from PC/Browser)
//         try{
//             localStorage.setItem(key, dataString); 
//         }
//         catch(e:any){
//             console.error("Save data to local storage not possible! Maybe the data is too large(" + dataLength + " > 5200000 characters).");
//         }
//     }
//     /**
//      * Removes all data from local storage
//      *
//      * @memberof LocalStorage
//      */
//     clear(){
//         //check if there is an item in store
//         if(localStorage.getItem(Object.keys(localStorage)[0])) {
//             //clear the storage
//             localStorage.clear();
//         }
//     }
// }
