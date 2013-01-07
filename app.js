var express    = require('express')
    , http     = require('http')
    , path     = require('path')
    , mongoose = require('mongoose')
    , http     = require('http')
    , fs       = require('fs')
    , config   = require('./config');

var app = express();
var db  = mongoose.createConnection(config.db.domain, config.db.name);

app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: config.uploadDir
}));

app.set('config', config);
app.set('mongoose', mongoose);
app.set('db', db);

var models = {
    user        : require('./models/user.js')(app),
    meal        : require('./models/meal.js')(app),
    mealtime    : require('./models/mealtime.js')(app),
    order       : require('./models/order.js')(app)
};

app.set('models', models);

var controllers = {
    user        : require('./controllers/user.js')(app),
    meal        : require('./controllers/meal.js')(app),
    mealtime    : require('./controllers/mealtime.js')(app),
    order       : require('./controllers/order.js')(app),
};

app.set('controllers', controllers);

var routes  = {
    user        : require('./routes/user.js')(app),
    meal        : require('./routes/meal.js')(app),
    mealtime    : require('./routes/mealtime.js')(app),
    order       : require('./routes/order.js')(app)
};

app.configure(function() {
    app.set('port', config.port);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.all('*', function (req, res, next) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With"
    });
    next();
});

// routes - order

app.post('/order/add', routes.order.add);
app.get('/order/list', routes.order.getList);
app.get('/order/list_by_user', routes.order.getListByUser);
app.get('/order/count', routes.order.count);
app.get('/order/delete/:id', routes.order.delete);

// routes - meal

app.post('/meal/add', routes.meal.add);
app.get('/meal/list', routes.meal.getList);
app.get('/meal/count', routes.meal.count);
app.get('/meal/get/:id', routes.meal.getById);
app.get('/meal/delete/:id', routes.meal.delete);
app.get('/meal/vote/up/:id', routes.meal.voteUp);
app.get('/meal/vote/down/:id', routes.meal.voteDown);
app.get('/meal/amount/up/:id', routes.meal.amountUp);
app.get('/meal/amount/down/:id', routes.meal.amountDown);
app.get('/meal/image/:id', routes.meal.getImageById);

// routes - mealtimes

app.post('/mealtime/add', routes.mealtime.add);
app.get('/mealtime/list', routes.mealtime.getList);
app.get('/mealtime/count', routes.mealtime.count);
app.get('/mealtime/delete/:id', routes.mealtime.delete);

// routes - user

app.post('/user/add', routes.user.add);
app.get('/user/get_by_username', routes.user.getByUsername);
app.get('/user/delete/:id', routes.user.delete);

http.createServer(app).listen(app.get('port'), function(){
    console.log("HTTP: " + app.get('port'));
});