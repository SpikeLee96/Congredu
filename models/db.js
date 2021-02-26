var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/UsuarioDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('Conexão com o banco realizada com sucesso.') }
    else { console.log('Error na conexão com o Banco : ' + err) }
});

require('./usuario');
