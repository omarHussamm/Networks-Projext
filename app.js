const express = require ('express');
const path = require ('path');
const app= express();
const fs = require('fs');
const { name } = require('ejs');
let users = [];
let currentUser = -1; 
const books = [
  {name:'Dune',ejsFile:'dune'},
  {name:'Lord of the Flies',ejsFile:'flies'},
  {name:'The Grapes of Wrath',ejsFile:'grapes'},
  {name:'The Sun and Her Flowers',ejsFile:'sun'},
  {name:'Leaves of Grass',ejsFile:'leaves'},
  {name:'To Kill a Mockingbird',ejsFile:'mockingbird'}
];

fs.readFile('userServer.json', function(err, data) {
   const textchunk = JSON.parse(data.toString('utf8'));
    textchunk.forEach(user=>{
        users.push(user);
    });
  });
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


// functions


const usernotNull = res =>{
  console.log(currentUser);
  if(currentUser === -1){
    res.redirect('/');
    return true;
  }
  return false;
}

const updateserver = (id)=>{  fs.writeFile('userServer.json', JSON.stringify(users), function (err) {
  if (err) throw err;
});
currentUser = id;
  console.log(currentUser);
};
const updatereadlist = (res,ejsName,booknName)=>{
  flag=false;
    if(users[currentUser].readlist.includes(booknName) )
      flag=true;
  if(flag){
    res.render(ejsName,{message: booknName +" already in readlist"});
  }
  else{
    users[currentUser].readlist.push(booknName);
    updateserver(currentUser);
    res.render(ejsName,{message: booknName+" added to readlist"});
 }
};


// post get requests


app.get('/',function(req,res){
  res.render('login',{failed:""});
});
app.post('/',function(req,res){
  flag = false;
  users.forEach(userss=>{
    if(userss.username===req.body['username'] && userss.password===req.body['password']){
      flag = true;
      currentUser=users.indexOf(userss);
      console.log(currentUser);
      return;
    }
  }); 
  if(flag){
    res.render('home') ;}
  else{
    res.render('login', {failed:"Wrong username or password"}) ;
   }});
  app.get('/registration',function(req,res){
    res.render('registration',{failed:""});
  });
  app.get('/novel',function(req,res){
    if(usernotNull(res))
    return;
    res.render('novel');
  });
  app.get('/poetry',function(req,res){
    if(usernotNull(res))
    return;
    res.render('poetry');
  });
  app.get('/fiction',function(req,res){
    if(usernotNull(res))
    return;
    res.render('fiction');
  });
  app.get('/readlist',function(req,res){
    if(usernotNull(res))
    return;
    res.render('readlist',{message:users[currentUser].readlist});
  });
  app.get('/grapes',function(req,res){
    if(usernotNull(res))
    return;
    res.render('grapes',{message:""});
  });
  app.post('/grapes',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'grapes','The Grapes of Wrath')
  });
  app.get('/flies',function(req,res){
    if(usernotNull(res))
    return;
    res.render('flies',{message:""});
  });
  app.post('/flies',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'flies','Lord of the Flies')
  });
  app.get('/leaves',function(req,res){
    if(usernotNull(res))
    return;
    res.render('leaves',{message:""});
  });
  app.post('/leaves',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'leaves','Leaves of Grass')
  });
  app.get('/mockingbird',function(req,res){
    if(usernotNull(res))
    return;
    res.render('mockingbird',{message:""});
  });
  app.post('/mockingbird',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'mockingbird','To Kill a Mockingbird')
  });
  app.get('/sun',function(req,res){
    if(usernotNull(res))
    return;
    res.render('sun',{message:""});
  });
  app.post('/sun',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'sun','The Sun and Her Flowers')
  });
  app.get('/dune',function(req,res){
    if(usernotNull(res))
    return;
    res.render('dune',{message:""});
  });

  app.post('/dune',function(req,res){
    if(usernotNull(res))
    return;
    updatereadlist(res,'dune','Dune')
  });
  
app.post('/register',function(req,res){
    const user = {};
    user['username'] = req.body['username'];
    user['password'] = req.body['password'];
    user['readlist'] = [];
   if(user.username===''|| user.password===''){
   
    res.render('registration',{failed:"You typed an empty username or password"})
}
    else{ 
    let flag = true;
    const check = users.forEach(user=>{
        if(user.username===req.body['username']){
        flag= false;
        return;
    }
    });
    if(flag){
        users.push(user);
        updateserver(updateserver);
        res.redirect('/');

    }else{
      res.render('registration',{failed:"Username already taken"});
    }
}
});
app.post('/search',function(req,res){
  let searchResult = [];
books.forEach(book =>{
  if((book.name).includes(req.body['Search'])){
    searchResult.push(book);
  }
});
res.render('searchresults',{message : searchResult});
});

// run 
if(process.env.PORT){
  app.listen(process.env.PORT,function() {
    console.log("Server started");
  })
}else{
  app.listen(3000,function() {
    console.log("Server started on 3000");});
}