import { Schema } from "mongoose";
import { stringValidate } from "./mongoValidateUtils"


export default {
    UserSchema: new Schema({
        firstName: { type: String, requred: true, validate: stringValidate.maxLength(true, 30) },
        lastName: { type: String, requred: true, validate: stringValidate.maxLength(true, 30) },
        // email: { type: String, requred: true, validate: stringValidate.maxLength(320, "email") },
        // firstName: { type: String, requred: true, validate: stringValidate.maxLength(320, "firstName") },
        // firstName: { type: String, requred: true, validate: stringValidate.maxLength(30, "firstName") },

        // lastName, varchar(30)  
        // email              | varchar(320) 
        // passwordHash       | char(60)     
        // gender             | char(1)      
        // salutation         | varchar(5)   
        // birthDate          | date         | S  |     | N
        // nationality        | varchar(56)  
        // occupation         | varchar(30)  | S  |     | N
        // address            | varchar(150) 
        // postcode           | varchar(12)  
        // city               | varchar(85)  
        // state              | varchar(50)  | S  |     | N
        // country            | varchar(56)  
        // phoneNumber        | varchar(16)  
        // linkedIn           | varchar(75)  | S  |     | N
        // isEmailVerified    | tinyint(1)   | S  |     | 0
        // languages          | varchar(200) 
        // skillsAndInterests | varchar(400) 
        // isAdmin            | tinyint(1)   | S  |     | 0
    })
}