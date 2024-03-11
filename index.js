const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require("./config/key");

// application/x-www-form-urlencoded 같은 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

// application/json 같은 데이터를 분석해서 가져옴
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})