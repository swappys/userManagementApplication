const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {Schema} = mongoose;
const userSchema = new Schema({
    firstName:{
        type:String,
        trim:true,
        required:'First name is required'
    },
    lastName:{
        type:String,
        trim:true,
        required:'Last Name is required'
    },
    email:{
        type: String,
        trim:true,
        required:'Email is required',
        unique:true
    },
    password:{
        type: String,
        required:true,
        min: 6,
        max:64
    },
    passwordChangeDate:{
        type: Date
    }
   
},{timestamps:true});

/**
 * While saving user, we need to make sure the password is hashed, not plain password
 * hashing should be done only in 2 situations
 * 1. if it is the first time a user is being saved/created
 * 2. user have updated/modified the existing password
 * for handling such requirements, we can use 'pre' middleware in our schema
 * this middleware/function will run each time user is saved/created
 * and/or password is modified/updated
 */

userSchema.pre('save', function(next){
    let user = this;
    // hash password only if user is changing the password or registering for the first time
    // make sure to use this otherwise each time user.save() is executed, password
    // will get auto updated and you can't login with original password

    if(user.isModified('password')){

        return bcrypt.hash(user.password, 12, function(err, hash){
            if(err){
                console.log("HASHING ERROR",err);
                return next(err);
            }
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            user.passwordChangeDate=currentDate;
            user.password=hash;
            return next();
        });
    }else{
        return next();
    }
});

userSchema.methods.comparePasswords = function(password, next){
    bcrypt.compare(password,this.password, function(err, match){
        if(err){
            console.log("COMPARE PASSWORD ERR",err);
            return next(err,false);
        }
        // if there is no error then match will be null
        console.log("MATCH PASSWORD", match);
        return next(null, match);// here match is true.
    })
}

const User = mongoose.model("User", userSchema);
module.exports=User;