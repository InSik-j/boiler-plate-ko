// const express = require('express')
// const app = express()
// const port = 3000

// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const { User } = require('./models/User');

// const config = require('./config/key');

// // application/x-www-form-urlencoded 같은 데이터를 분석해서 가져옴
// app.use(bodyParser.urlencoded({extended: true}));

// // application/json 같은 데이터를 분석해서 가져옴
// app.use(bodyParser.json());
// app.use(cookieParser());

// const mongoose = require('mongoose')
// mongoose.connect(config.mongoURI,{
//     useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true, useFindAndModify: false
// }).then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(err))



// app.get('/', (req, res) => {
//   res.send('Hello World! 안녕하세요! 새해 복 많이 받으세요!')
// })

// app.post('/register', (req, res) =>{

//     // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
//     // 그것들을 DB에 넣어준다.

//     const user = new User(req.body) // req.body에 json 형태의 데이터가 들어가있음. <- bodyParser가 있기 때문에 가능
    
//     user.save().then(()=>{
//         res.status(200).json({
//             success:true
//         })
//     }).catch((err)=>{
//         return res.json({success:false, err})
//     })
    
   
// })

// // 로그인
// app.post('/login', (req, res) =>{
//     // 1. 요청된 이메일을 DB에 있는지 찾기
//     User.findOne({email: req.body.email}, (err, user) => {
//         if(!user){ // 이메일 정보가 없다면 실행
//             return res.json({
//                 logoinSuccess: false, 
//                 message: "제공된 이메일에 해당하는 유저가 존재하지 않습니다."
//             })
//         }
//     })
//     // 2. 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
//     user.comparePassword(req.body.password, (err, isMatch)=>{
//         if(!isMatch)
//             return res.json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다."

//             // 3. 이메일&비밀번호가 맞다면 토큰 생성
//             user.generateToken((err, user)=>{
//                 if(err) return res.status(400).send(err);

//                 // 토큰을 쿠키에 저장한다. 쿠키 or 로컬 등등 여러 곳에 저장 가능
//                 res.cookie("x_auth", user.token)
//                 .status(200)
//                 .json({loginSuccess: true, userid: user._id})
//             })
//         })
       
//     })
    
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })





const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');

const config = require('./config/key');

// application/x-www-form-urlencoded 같은 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

// application/json 같은 데이터를 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요! 새해 복 많이 받으세요!')
})

app.post('/register', (req, res) =>{

    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어준다.

    const user = new User(req.body) // req.body에 json 형태의 데이터가 들어가있음. <- bodyParser가 있기 때문에 가능
    
    user.save().then(()=>{
        res.status(200).json({
            success:true
        })
    }).catch((err)=>{
        return res.json({success:false, err})
    })
    
   
})

// 로그인
app.post('/login', (req, res) => {
    // 이메일이 DB에 있는지 확인
    User.findOne({
        email: req.body.email
    })
    .then (async (user) => {
        if (!user) {
            throw new Error("제공된 이메일에 해당하는 유저가 없습니다.")
        }
        // 비밀번호가 일치하는지 확인
        const isMatch = await user.comparePassword(req.body.password);
        return { isMatch, user };
    })
    .then(({ isMatch, user }) => {
        console.log(isMatch);
        if (!isMatch) {
            throw new Error("비밀번호가 틀렸습니다.")
        }
        // 로그인 완료
        return user.generateToken();
    })
    .then ((user) => {
        // 토큰 저장 (쿠키, localstorage ...)
        return res.cookie("x_auth", user.token)
        .status(200)
        .json({
            loginSuccess: true,
            userId: user._id
        });
    })
    .catch ((err) => {
        console.log(err);
        return res.status(400).json({
            loginSuccess: false,
            message: err.message
        });
    })
});
    


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})