export const  EmailValidation=(event, selector, EffectSelector)=> {
    let email = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    let Field = document.querySelector(selector);
    let EffectField = document.querySelector(EffectSelector);
    // validate(Field, email, EffectField);
  }
  


 
    let email=""
    let password=""
    let Confirmpassword=""
    let fname=""
    let lname=""
    let StepSize="1"
    let PasswordLength=0
    let AddressStreet=""
    let Address1=""
    let country=""
    let postcode=""
    let day=""
    let month=""
    let year=""
    let city=""
    let checkbhoxAggrement="off"

    


    const HandleSecondStepValidation=()=>{
        let CountrySelect=document.querySelector("#country-select");
        let MonthSelect=document.querySelector("#month-select");
        let AddressLine1Value=document.querySelector("#address1");
        let AddressLine=document.querySelector("#address");
        let postcode=document.querySelector("#postcode");
        let Town=document.querySelector("#town");
        let year=document.querySelector("#year");
        let Day=document.querySelector("#Day");
        
        if(AddressLine.value!=""&&AddressLine1Value.value!=""&&postcode.value!=""&&Day.value!=""&&CountrySelect.value!=""&&year.value!=""&&Town.value!=""&&MonthSelect.value!=""&&checkbhoxAggrement!="off"){
            document.querySelector(".create-account-label").classList.remove("disable")
        }else{
            document.querySelector(".create-account-label").classList.add("disable")
        }

    }


    export const HandleSecondStepText=e=>{
   

        if(e.target.id=="address"){
            AddressStreet=e.target.value
           document.querySelector(".result-wrapper .typing-start-result").style.display="block"
            
           if(e.target.value==0){
            document.querySelector(".result-wrapper > p").style.display="block"
            document.querySelector(".result-wrapper > div").style.display="none"
           }else{
            document.querySelector(".result-wrapper > p").style.display="none"
            document.querySelector(".result-wrapper > div").style.display="block"
           }
            
        }else if (e.target.id=="address1"){
            Address1=e.target.value
        }else if (e.target.id=="postcode"){
            postcode=e.target.value
        
        }else if (e.target.id=="town"){
            city=e.target.value
        }else if (e.target.id=="country-select"){
            country=e.target.value
           
            let BorderElement=e.target.parentNode;
            BorderElement.style.border="1px solid #000 "

        
        }else if (e.target.id=="Day"){
            day=e.target.value
        }else if (e.target.id=="month-select"){
            month=e.target.value
            let BorderElement=e.target.parentNode;
            BorderElement.style.border="1px solid #000 "

        }else if (e.target.id=="AggrementCheckbox"){
     
            if(e.target.checked==true){
                checkbhoxAggrement="on"
            }else{
                checkbhoxAggrement="off"
            }
            
        }else if (e.target.id=="year"){
            year=e.target.value
        }


        HandleSecondStepValidation()

   
    
    }

    const PasswordBarsWorking=(e)=>{
        
        if(StepSize<5){
            let Step=document.querySelector(`#bar-${StepSize}`)
            

            
        }

       

if(PasswordLength<password.length){
  
    if(password.length<4){
        document.querySelector(`#bar-1`).style.backgroundColor="#f63b3b"
    }
    if(password.length==4){
        StepSize=2
        document.querySelector(`#bar-1`).style.backgroundColor="#DEC193"
        document.querySelector(`#bar-2`).style.backgroundColor="#DEC193"
        
    }
    if(password.length==8){
        StepSize=3
        document.querySelector(`#bar-1`).style.backgroundColor="#7299C5"
        document.querySelector(`#bar-2`).style.backgroundColor="#7299C5"
        document.querySelector(`#bar-3`).style.backgroundColor="#7299C5"
    }
    if(password.length>12){
        document.querySelector(`#bar-1`).style.backgroundColor="#7AB89E"
        document.querySelector(`#bar-2`).style.backgroundColor="#7AB89E"
        document.querySelector(`#bar-3`).style.backgroundColor="#7AB89E"
        document.querySelector(`#bar-4`).style.backgroundColor="#7AB89E"
    }
}else{
   
    if(password.length==0){
        document.querySelector(`#bar-4`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-3`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-2`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-1`).style.backgroundColor="#ddd"
    }
    if(password.length<=4&&password.length>0){
        StepSize=1
        document.querySelector(`#bar-1`).style.backgroundColor="#f63b3b"
        document.querySelector(`#bar-4`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-3`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-2`).style.backgroundColor="#ddd"
    }

    if(password.length<=8&&password.length>4){
        StepSize=2
        document.querySelector(`#bar-1`).style.backgroundColor="#DEC193"
        document.querySelector(`#bar-4`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-3`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-2`).style.backgroundColor="#DEC193"
        
    }
    if(password.length>8&&password.length<12){
        document.querySelector(`#bar-1`).style.backgroundColor="#7299C5"
        document.querySelector(`#bar-4`).style.backgroundColor="#ddd"
        document.querySelector(`#bar-3`).style.backgroundColor="#7299C5"
        document.querySelector(`#bar-2`).style.backgroundColor="#7299C5"
    }
}

PasswordLength=password.length

        

        // if(password.length>8&&StepSize=="2"){
        //     StepSize++
        // }
        // if(password.length>12&&StepSize=="3"){
        //     StepSize++
        // }

        // if(password.length<8&&StepSize=="3"){
        //     StepSize--
        // }
    }


    export const HandleTextValidation=e=>{
        let HelperElement=e.target.parentNode.parentNode.nextElementSibling
    

        if(e.target.id=="fname"){
            fname=e.target.value
        }else{
            lname=e.target.value
        }

        HelperElement.textContent=""

        HandleValidation()
    }
    

    export const HandleEmailValidation=e=>{

      let HelperElement=e.target.parentNode.parentNode.nextElementSibling
      email=e.target.value
      
          HelperElement.textContent=""
      
      HandleValidation()
  }

    export const HandlePasswordValidation=e=>{
      
      let HelperElement=e.target.parentNode.parentNode.nextElementSibling
      password=e.target.value
    
          HelperElement.textContent=""
    
          PasswordBarsWorking(e)
      HandleValidation()

  }
  export const HandleConfirmPasswordValidation=e=>{
      
    let HelperElement=e.target.parentNode.parentNode.nextElementSibling
    Confirmpassword=e.target.value
  
    HelperElement.textContent=""
  

    HandleValidation()

}


    const  HandleValidation=()=>{

      
      let Email = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{1,8})(\.[a-z]{1,8})?(\.[a-z]{1,8})?$/;
      
      
      let Button=document.querySelector(".button-wrapper button");

      
    
      if (Email.test(email)&&password!=""&&Confirmpassword!=""&&fname!=""&&lname!="") {
          
        if(password==Confirmpassword)Button.classList.remove("disable")


      }else{
        Button.classList.add("disable")
      }

       
    }



  