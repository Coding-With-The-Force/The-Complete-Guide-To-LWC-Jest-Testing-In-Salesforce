import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/JestDemoController.getAccounts';
import getCases from '@salesforce/apex/JestDemoController.getCases';
import {CurrentPageReference} from 'lightning/navigation';

export default class JestDemo extends LightningElement {

    @wire(CurrentPageReference)
    currPage;

    @wire(getAccounts)
    accounts;

    cases;
    error;

    tacoStuff = 'Tacos are exciting';
    showNewParagraph = false;
    tacoList = [{Id:1, TacoType: "Chalupa"}, 
    {Id:2, TacoType: "Soft Shell"}, 
    {Id:3, TacoType:"Hard Shell"}];

    connectedCallback(){
        this.getCaseData();
    }

    getCaseData(){
        getCases().then(response=>{
            this.cases = response
        }).catch(error=>{
            this.error = error
        })
    }

    renderNewParagraph(){
        this.showNewParagraph = true;
    }
}