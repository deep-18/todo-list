var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Todo = require('../models/todo');
var mongoose = require('mongoose');
const { response } = require('express');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/todo',async function (req, res, next) {
	// User.findOne({unique_id:req.session.userId},function(err,data){
		console.log(req.session.userId)
		const userData = await Todo.find({unique_id: req.session.userId});
		console.log("Printinggg")
		console.log(userData)
		res.render("todo", {data: userData});
	// })
});

router.post('/todocompleted/:id',async function (req, res, next) {
		try {
			const id = req.params.id;
			const result = await Todo.findById(id);
			result.status = "Completed";
			result.save();
			console.log("Intoeditt",id,result)
			res.redirect('/todo')
			// res.send("Successful");
		} catch (error) {
			console.log(error);
		}
});

router.post('/createlist',async function (req, res, next) {
	try {
        const data = new Todo({
			unique_id: req.session.userId,
            task: req.body.task,
            status: "todo"
        });
        const result = await data.save();
		console.log(result)
        res.redirect('/todo')
    } catch (error) {
        console.log(error);
    }
});

router.post('/delete/:id',async function (req, res, next) {
	try {
		const id = req.params.id;
        const result = await Todo.findByIdAndDelete(id);
		console.log("DELETTEEE",result)
        res.redirect('/todo')
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});






module.exports = router;