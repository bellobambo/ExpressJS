export const createUserValidationSchema = {
    username : {
        isLength : {
          options : {
            min : 5,
            max : 32,
          }  ,
          errorMessage : 'Username Must Be at least 5 characters with a max of 32 characters',
        },
        notEmpty : {
            errorMessage : 'Username Cannot Be Empty',

        },
        isString : {
            errorMessage : "Username Must Be A String"
        },
    },
    displayName : {
        notEmpty : true 
    }
}