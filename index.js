var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: { //column name//
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

// // `sequelize.define` also returns the model
// console.log(Comments === sequelize.models.Comments); // true
(async () => {await Comments.sync(); // round bracket 안 {force: true} 제거, 저장 내용 사람지기 때문//
console.log("The table for the User model was just (re)crated!");
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  // Find all users
  const comments = await Comments.findAll(); 
  console.log(comments); //comments 내용 확인, READ
  res.render('index', { comments: comments}); 
});

app.post('/create', async function (req, res) {
    console.log(req.body)
    const { content } = req.body
    // Create a new user
    await Comments.create({ content: content });
    
    res.redirect('/') //다시 get쪽으로 보내야 index page에 보임
});

app.post('/update/:id', async function (req, res) {
  console.log(req.params)
  console.log(req.body)
  const { content } = req.body
  const { id } = req.params

  await Comments.update({ content:content }, { //좌측 content는 컬럼 이름
    where: {
      id:id  //좌측 id는 컬럼 이름
    }
  });
    res.redirect('/')
  });

  app.post('/delete/:id', async function (req, res) {
    console.log(req.params)
    const { id } = req.params
  
    await Comments.destroy({//좌측 content는 컬럼 이름
      where: {
        id:id  //좌측 id는 컬럼 이름
      }
  });
  
  res.redirect('/') //다시 get쪽으로 보내야 index page에 보임
});

app.listen(3000);
console.log('Server is listening on port 3000');