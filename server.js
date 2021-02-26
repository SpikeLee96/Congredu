require('./models/db');

var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');

var bodyparser = require('body-parser');

var mainController = require('./controllers/mainController');

var app = express();
const session = require('express-session');


app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set("view engine", "handlebars");

var hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifCond', function(v1, options) {
  if(v1 === "") {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(session({secret:'123456'}));

app.use('/.vscode', express.static('.vscode'));
app.use('/ajax', express.static('ajax'));
app.use('/bodybg', express.static('bodybg'));
app.use('/contactform', express.static('contactform'));
app.use('/css', express.static('css'));
app.use('/Documentation', express.static('Documentation'));
app.use('/fonts', express.static('fonts'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));
app.use('/lib', express.static('lib'));
app.use('/plugins', express.static('plugins'));
app.use('/skins', express.static('skins'));

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(3001, () => {
    console.log('Servidor iniciado na porta 3001');
});

app.use('/', mainController);
