import {createElement} from 'lwc';
import jestDemoComponent from 'c/JestDemo';
import getAccounts from '@salesforce/apex/JestDemoController.getAccounts';
import getCases from '@salesforce/apex/JestDemoController.getCases';
import {CurrentPageReference} from 'lightning/navigation';
import {setImmediate} from 'timers';
const mockAccounts = require('./mockData/accounts.json');
const mockPageData = require('./mockData/currentPageRef.json');
const mockCases = require('./mockData/cases.json');

jest.mock('@salesforce/apex/JestDemoController.getCases', ()=>({
    default:jest.fn()
}), {virtual:true});

jest.mock('@salesforce/apex/JestDemoController.getAccounts', ()=>{
    const {createApexTestWireAdapter} = require("@salesforce/sfdx-lwc-jest");
    return{
        default: createApexTestWireAdapter(jest.fn())
    };
}, {virtual:true})

describe('Positive Testing Suite',()=>{
    beforeEach(()=>{
        getCases.mockResolvedValue(mockCases);
        const jestDemo = createElement('c-jest-demo',{
            is:jestDemoComponent
        });
        document.body.appendChild(jestDemo);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    test('child component case data', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const childComp = jestDemo.shadowRoot.querySelector('c-jest-demo-child');
        const casesArray = Array.from(childComp.shadowRoot.querySelectorAll('.caseInfo'));
        const caseNameArray = casesArray.map(p=>p.textContent);
        expect(caseNameArray.length).toBe(1);
        expect(caseNameArray).toEqual(["kewl case"]);
    })

    /*test('apex method call', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const casesArray = Array.from(jestDemo.shadowRoot.querySelectorAll('.caseInfo'));
        const caseNameArray = casesArray.map(p=>p.textContent);
        expect(caseNameArray.length).toBe(1);
        expect(caseNameArray).toEqual(["kewl case"]);
    })*/

    test('current page wire', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const currPageDiv = jestDemo.shadowRoot.querySelector('.navigation');
        expect(currPageDiv.textContent).toEqual("");
        CurrentPageReference.emit(mockPageData);
        return new Promise(setImmediate).then(()=>{
            const currPageDiv = jestDemo.shadowRoot.querySelector('.navigation');
            expect(currPageDiv.textContent).not.toBeNull();
        })
    })

    test('wire apex method test', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        getAccounts.emit(mockAccounts);
        return new Promise(setImmediate).then(()=>{
            const accountArray = Array.from(jestDemo.shadowRoot.querySelectorAll('.acctInfo'));
            const accountNameArray = accountArray.map(div=>div.textContent);
            expect(accountNameArray.length).toBe(3);
            expect(accountNameArray).toEqual(["Matts Account","Jimbobs Account","Terrances Account"]);
        });
    })

    test('check iterator values', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const tacoParagraphs = jestDemo.shadowRoot.querySelectorAll('.tacoInfo');
        const tacoArray = Array.from(tacoParagraphs);
        const tacoTextContentArray = tacoArray.map(p=>p.textContent);
        expect(tacoTextContentArray.length).toBe(3);
        expect(tacoTextContentArray).toEqual(["Chalupa", "Soft Shell", "Hard Shell"]);
    })

    test('onclick new paragraph shown', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const newParagraph = jestDemo.shadowRoot.querySelector('.newParagraph');
        expect(newParagraph).toBeNull();
        const button = jestDemo.shadowRoot.querySelector('.renderButton');
        button.dispatchEvent(new CustomEvent('click'));
        return Promise.resolve().then(()=>{
            const newParagraph = jestDemo.shadowRoot.querySelector('.newParagraph');
            expect(newParagraph.textContent).toBe('Wow I love Tacos');        
        });
    });
    
    test('paragraph bind variable', ()=>{
        const jestDemo = document.querySelector('c-jest-demo');
        const paragraphText = jestDemo.shadowRoot.querySelector('.tacoStuff');
        expect(paragraphText.textContent).toBe('Tacos are exciting');
    });
});