const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10; // 글자 수

const jwt = require('jsonwebtoken');

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

// // 저장하기 전에 할 기능
// userSchema.pre('save', function( next ){
//     var user = this; // this는 userSchema를 가르킴

//     if(user.isModified('password')){ // 비밀번호가 변경될 때만 변환
//         // 비밀번호를 암호화 시킨다.
//         // salt 생성 -> salt를 이용해서 비밀번호 암호화 -> saltRounds = 글자 수 
//         bcrypt.genSalt(saltRounds, function(err, salt){
//             if(err) return next(err)

//             bcrypt.hash( user.password, salt, function(err, hash){
//                 if(err) return next(err)

//                 user.password = hash; // 성공 시 암호화된 번호로 변경
//                 next()
//             })
//         })
//     } else { // 비밀번호외의 다른 것들은 그냥 넘기기
//         next();
//     }
// })

// userSchema.method.comparePassword = function(plainPassword, cb){
//     // plainPassword : 1234567  암호화된 비밀번호 : %asd12adsa
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if(err) return cb(err)
//             cb(null, isMatch)
//     })
// }

// userSchema.methods.generateToken = function(cb){
//     var user = this;

//     // jsonwebtoken을 이용해서 token 생성
//     var token =  jwt.sign(user._id.toHexString(), 'secretToken')

//     user.token = token;
//     user.save(function(err, user){
//         if(err) return cb(err)
//         cb(null, user)
//     })
    
    
// }
userSchema.pre('save', function( next ) {
    // 비밀번호 암호화
    const user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                return next();
            });
        });
    }
    else {
        return next();
    }
});

userSchema.methods.comparePassword = function(plainPassword) {
    // 암호화된 비밀번호와 같은지 체크
    const user = this;
    return bcrypt.compare(plainPassword, this.password)
}

userSchema.methods.generateToken = function() {
    // jwt 생성
    user = this;
    const token = jwt.sign(user._id.toJSON(), 'secretToken');
    user.token = token;

    return user.save();
}

const User = mongoose.model('User', userSchema)

module.exports = {User}