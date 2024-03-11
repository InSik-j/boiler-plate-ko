const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10; // 글자 수

const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxLength: 50
    },
    email:{
        type: String,
        trim: true, // 공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: {
        type: String   
    },
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
})

// 저장하기 전에 할 기능
userSchema.pre('save', function( next ){
    var user = this; // this는 userSchema를 가르킴

    if(user.isModified('password')){ // 비밀번호가 변경될 때만 변환
        // 비밀번호를 암호화 시킨다.
        // salt 생성 -> salt를 이용해서 비밀번호 암호화 -> saltRounds = 글자 수 
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash( user.password, salt, function(err, hash){
                if(err) return next(err)

                user.password = hash; // 성공 시 암호화된 번호로 변경
                next()
            })
        })
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}