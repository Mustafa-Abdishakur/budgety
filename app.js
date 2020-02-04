const budgetController=(() =>{
   
    class Expense {
        constructor(id, description, value){
        this.id=id,
        this.description=description,
        this.value=value,
        this.percentage = -1
     }
     calcPercentage = function(totalIncome){
        if(totalIncome > 0){
          this.percentage = Math.round((this.value/totalIncome)*100);
        } 
         else{
             
             this.percentage = -1;
         }
         
     };
     getPercentage() {
        return this.percentage;
    }
 
    
    }   


    
     class Income{
         constructor(id, description, value){
        this.id=id,
        this.description=description,
        this.value=value
            }
        }
    
    const calculateTotal = type => {
      let sum = 0;
        data.allItems[type].forEach(current =>{
            sum += current.value; 
        });
        data.totals[type]=sum;
    };
   
     let data= {
         allItems:{
             exp:[],
             inc:[]
         },
         totals:{
         exp:0,
         inc:0
        },
         budget:0,
         percentage:-1 //-1 means the value does not exist yet
     };
     return {
         addItem: (type, des, val) =>{
             let newItem,ID;
             //ID is a unique no. assigned to every new income/exp
             //ID = last ID +1
             
             //create ID
             if(data.allItems[type].length>0){
               ID = data.allItems[type][data.allItems[type].length -1].id +1;    
             }
             else{
                 ID = 0;
             }
           
             //create new item based on if its income/expense
             if (type==='exp'){
                 newItem = new Expense(ID,des,val);
             }
             if (type==='inc'){
                 newItem = new Income(ID,des,val);
             }
             //push the new item to the data structure
             data.allItems[type].push(newItem);
             // return the new item to make it accessable
             return newItem;

         },
         
    deleteItem: (type, id) => {
            let ids, index;      
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(current => {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
     
         calculateBudget:() =>{
           //calcualate the total of expense and income
            calculateTotal('exp');
            calculateTotal('inc'); 

             
          //calculate the budget: income-expense
             
        data.budget = data.totals.inc - data.totals.exp; 
          //calculate percentage of income spent 
             if(data.totals.inc>0){                         // if statement to avoid dividing by zero
               data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);  
             }
             else{
               data.percentage = -1;  
             }
             
         },
         
         calculatePercentages:() =>{
             data.allItems.exp.forEach(current => {
                 current.calcPercentage(data.totals.inc);
             })
             
             
         },
         getPercentages:() =>{
           let allPerc;  
           allPerc = data.allItems.exp.map(current =>{
               return current.getPercentage(); 
           });
             
             return allPerc;
             
         },
         
         getBudget:() =>{
           return{
               budget:data.budget,
               totalExp:data.totals.exp,
               totalInc:data.totals.inc,
               percentage:data.percentage
           }
      
         },
         
         
         testing:() =>{             //used to testing if the input is logged in
             console.log(data);
         }
     }
    
    
})();





const UIcontroller = (() =>{
    const DOMinput = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:".budget__income--value",
        expenseLabel:".budget__expenses--value",
        percentageLabel:'.budget__expenses--percentage',
        container:".container",
        expensePercLabel:'.item__percentage',
        timeLabel:'.budget__title--month'
    }

    const formatNumber = (num,type) =>{
            let numSplit, int, decimal, sign;
         // + or - before numbers, all no. are 2 decimal places, coma for numbers in thousands
            num = Math.abs(num); //abs = absoulte value
            num = num.toFixed(2); //makes num to 2 decimal places and makes it a string
            
            numSplit = num.split('.');
            int = numSplit[0];
            
            if(int.length>3){
                 int = `${int.substr(0,int.length-3)},${int.substr(int.length-3, int.length)}`;  //input:25310, output:25,310. substr (substring) reads strings and return a character from it
            }
            decimal = numSplit[1];

           
            
            return `${(type==='exp' ? '-': '+')} ${int}.${decimal}`;
        
        
        };
    const nodeListForEach =  (list, callBack) => {
        for(var i=0; i<list.length; i++){
            callBack(list[i], i);
                }
            };   
        
    return{
         getInput: () =>{
            return{
            type: document.querySelector(DOMinput.inputType).value, //either 'inc' or 'exp'
            description: document.querySelector(DOMinput.inputDescription).value,
            value: parseFloat(document.querySelector(DOMinput.inputValue).value) //parsefloat changes string to a number
                   }
                },
        
        allListItem: (obj, type) =>{
            let html,newHTML,element;
            //create html string with placeholder tag
            if(type==='exp'){
                element = DOMinput.expensesContainer;
                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type==='inc'){
                element=DOMinput.incomeContainer;
                html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div</div></div>';    
            }
            //replace the placeholder with data
            newHTML = html.replace('%id%',obj.id);
            newHTML= newHTML.replace('%description%',obj.description);
            newHTML= newHTML.replace('%value%',formatNumber(obj.value, type));
            // insert the html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
            
        },
        
        deleteListItem:selectorID =>{
          const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
            
        },
        
        clearFields: () => {     //clear the input values once ENTER is pressed
            let fields, fieldsArr;
        fields= document.querySelectorAll(`${DOMinput.inputDescription},${DOMinput.inputValue}`); //querySelector selects all the elements with the same ID
 
        fieldsArr = Array.from(fields); //querySelectorAll returns a node list. this line changes it into an array 
          fieldsArr.forEach((current,index,Array) =>{
              current.value="";
          })  
           fieldsArr[0].focus(); 
        },
         
        getDOMinput: function() {
            return DOMinput;
                },
        
        displayBudget: function(obj){
            let type;
            obj.budget>0 ? type = 'inc': type = 'exp';
            
            document.querySelector(DOMinput.budgetLabel).textContent = formatNumber(obj.budget,type);                       document.querySelector(DOMinput.expenseLabel).textContent =formatNumber(obj.totalExp, 'exp');                     document.querySelector(DOMinput.incomeLabel).textContent = formatNumber( obj.totalInc, 'inc');                       
   
            if(obj.percentage>0){
                document.querySelector(DOMinput.percentageLabel).textContent = `${obj.percentage}%`;
            }
            else{
                document.querySelector(DOMinput.percentageLabel).textContent = '----';

            }
        },
        
        displayPercentages:function(percentages){
            
            let  fields = document.querySelectorAll(DOMinput.expensePercLabel);
                
                nodeListForEach(fields, (current, index) => {
                    if(percentages[index]>0){
                        
                        current.textContent = `${percentages[index]}%`; 
                    }
                    else{
                        current.textContent = '---'
                    }
                })
               
                
                
            },
        displayMonth:() =>{
            var now, year, month;
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(DOMinput.timeLabel).textContent = month + '/' + year;
  
        },
        
        changedType:function(){
            const fields = document.querySelectorAll(DOMinput.inputDescription+ ','+DOMinput.inputType+ ',' +DOMinput.inputValue);
            
            nodeListForEach(fields, (current) => {
                current.classList.toggle('red-focus');
            })
            
            document.querySelector(DOMinput.inputBtn).classList.toggle('red');
        }
        
   
        
    
    
    
    
    }

    })();


const controller = (function(budgetCtrl, UIctrl){

    const setupEventListener = () =>{
         const DOM = UIctrl.getDOMinput();   
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
         document.addEventListener('keypress', event => {
         if ( event.keyCode===13 || event.which===13 ){
                   ctrlAddItem();
                }   
            })
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem); //event delegation
        
        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
        
        }        
   
    const updateBudget = () =>{
         //3. calculate the budget
        budgetCtrl.calculateBudget();
        //4. return the budget
        const budget = budgetCtrl.getBudget();
        //5. display the budget in UI 
        UIctrl.displayBudget(budget);
    }
    
    const updatePercentages = () =>{
        //1. calculate percentage
       budgetCtrl.calculatePercentages();
        //2. read percentage from the budget controlller
        const percentage = budgetCtrl.getPercentages();
        //3. update the UI
        UIctrl.displayPercentages(percentage);
    };
    
   const ctrlAddItem = () =>{
       let input,newItem;
         //0. get the field inputs

         input = UIctrl.getInput();
        if (input.description !=='' && !isNaN(input.value) && input.value >0 ){ //only continue if description and value inputs are not empty
            
        //1. add the item to the budget controller
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //2. add to the UI 
       UIctrl.allListItem(newItem,input.type);
       //3.clear fields (description and value)
       UIctrl.clearFields();
      
       //4. calculate and update the budget
       updateBudget();
       
        //5. calculate and update the percentages
        updatePercentages();
            }
        }
   const ctrlDeleteItem = event =>{   // event is the target event
       let itemID, splitID, type, ID;
       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;    // finding the id of the parent of the target event
   
    if (itemID){        
        
    splitID = itemID.split('-');
    type = splitID[0];
    ID = parseInt(splitID[1]);

    //1. delete the item from data structure
    budgetCtrl.deleteItem(type,ID);
    //2. delete it from the UI
    UIctrl.deleteListItem(itemID);
    //3. update the budget
        updateBudget();
        }
       
   //4. calculate and update the percentages
      
    };
   return {
       init: () =>{
           UIctrl.displayMonth();
           console.log('application has started');
           UIctrl.displayBudget({
                budget:0,
               totalExp:0,
               totalInc:0,
               percentage:-1
           });
        setupEventListener();
           
       }
   }
   

    
})(budgetController, UIcontroller);

controller.init();


