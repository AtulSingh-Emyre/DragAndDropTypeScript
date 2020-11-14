// Data validation
interface Validatable {
    value: string | number;
    required? : boolean;
    minLen? : number;
    maxLen? : number;
    min? : number;
    max? : number;
}

function validate(validatableInput:Validatable) {
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().length!== 0
    }
    if(validatableInput.maxLen != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length<=validatableInput.maxLen;
    }
    if(validatableInput.minLen != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length>=validatableInput.minLen;
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value<=validatableInput.max;
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value>=validatableInput.min;
    }
    return isValid;
}



//Autobind Decorator
function AutoBind(_target:any, _methodName:string,descriptor:PropertyDescriptor){
   const orgDescriptor = descriptor;
   const modifDescriptor : PropertyDescriptor = {
       configurable:true,
       get() {
           return orgDescriptor.value.bind(this)
       }
   }
   return modifDescriptor;  
}

//ProjectInput class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      this.templateElement = document.getElementById(
        'project-input'
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as HTMLFormElement;
      this.element.id = 'user-input';
  
      this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
  
      this.configure();
      this.attach();
    }

    private gatherUserInput(): [string,string,number]|void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable : Validatable = {
            value : enteredTitle,
            required : true
        }
        const descriptionValidatable : Validatable = {
            value : enteredDescription,
            required : true,
            minLen : 5
        }
        const peopleValidatable : Validatable = {
            value : +enteredPeople,
            required : true,
            min : 1,
            max : 5
        }

        if( !validate(titleValidatable) || 
            !validate(descriptionValidatable) || 
            !validate(peopleValidatable))
        {
            alert("invalid inputs");
            return;
        }
        return [enteredTitle,enteredDescription,+enteredPeople]
    }

    @AutoBind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput()
      if(Array.isArray(userInput)){
      const [ title , description , people] = userInput
      console.log(title, description, people);}
    }



  
    private configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }
  
    private attach() {
      this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
  }
  
  const prjInput = new ProjectInput();
  