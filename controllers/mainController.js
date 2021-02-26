var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var email = '';
var bool = false;

//lista de usuários cadastrados feita com finalidade de testar o aplicativo
router.get('/list', (req, res) => {
    Usuario.find((err, docs) => {
        if (!err) {
            res.render("paginas/list", {
                list: docs,
                logado: bool
            });
        }
        else {
            var dialog = require('dialog');
            dialog.info('Falha ao carregar a lista de usuários :' + err);
            res.render("paginas/list", {
              logado: bool
            });
        }
    }).lean();
});

//parte 1
//getters
router.get('/', (req, res) => {
    res.render("paginas/index", {
        viewTitle: "Congredu",
        logado: bool
    });
});

router.get('/sobre', (req, res) => {
    res.render("paginas/sobre", {
        viewTitle: "Congredu - Sobre",
        logado: bool
    });
});

router.get('/comissoes', (req, res) => {
    res.render("paginas/comissoes", {
        viewTitle: "Congredu - Comissões",
        logado: bool
    });
});

router.get('/normas-de-inscricoes', (req, res) => {
    res.render("paginas/normas-de-inscricoes", {
        viewTitle: "Congredu - Inscrições",
        logado: bool
    });
});

router.get('/cadastro', (req, res) => {
    res.render("paginas/cadastro", {
        viewTitle: "Congredu - Cadastro",
        logado: bool
    });
});

router.get('/normasanais', (req, res) => {
    res.render("paginas/normasanais", {
        viewTitle: "Congredu - Normas",
        logado: bool
    });
});

router.get('/normasebook', (req, res) => {
    res.render("paginas/normasebook", {
        viewTitle: "Congredu - Normas",
        logado: bool
    });
});

router.get('/programacao', (req, res) => {
    res.render("paginas/programacao", {
        viewTitle: "Congredu - Programação",
        logado: bool
    });
});

router.get('/contato', (req, res) => {
    res.render("paginas/contato", {
        viewTitle: "Congredu - Contato",
        logado: bool
    });
});

//acesso a página de login
router.post('/entrar', (req, res) => {
    res.render("paginas/login", {
        viewTitle: "Congredu - Login",
        logado: bool
    });
});

//parte 2
//banco de dados: create e update
router.post('/', (req, res) => {

    if (req.body._id == "") {
        inserir(req, res);
    } else {
        atualizar(req, res);
    }

});

//banco de dados: create
function inserir(req, res) {

    if(req.body.password != req.body.password_confirmation){

      var dialog = require('dialog');
      dialog.info('Senhas estão diferentes!');
      res.render('paginas/cadastro', {
        logado: bool
      });

    } else {

      var usuario = new Usuario();
      usuario.username = req.body.first_name;
      usuario.surname = req.body.last_name;
      usuario.nickname = req.body.display_name;
      usuario.password = req.body.password;
      usuario.email = req.body.email;
      usuario.save((err, doc) => {
          if (!err) {
            deslogar();
            var dialog = require('dialog');
            dialog.info('Usuário cadastrado com êxito! Entre com sua conta');
            res.render('paginas/login');
          } else {
              if (err) {
                  var dialog = require('dialog');
                  dialog.info('Falha durante o cadastro: ' + err);
                  res.render('paginas/cadastro');
              }
          }
      });

    }
}

//banco de dados: update
function atualizar(req, res) {
    Usuario.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (err) {
          var dialog = require('dialog');
          dialog.info('Falha durante a modificação de dados do usuário : ' + err);
        } else {
          var dialog = require('dialog');
          dialog.info('Dados atualizados com êxito!');
        }
        res.render("paginas/index", {
            viewTitle: "Congredu",
            logado: bool
        });
    });
}

//banco de dados: read, logar
router.post('/login', (req, res) => {

  var ifTrue = false;

  Usuario.find({}, function(err, usuarios) {

    usuarios.forEach(function(usuario) {

      if(req.body.password == usuario.password && req.body.email == usuario.email){
        req.session.login = usuario.email;
        ifTrue = true;
      }

    });

    if(ifTrue){

      Usuario.find({email: req.body.email}, (err, docs) => {
          if (!err) {
              bool = true;
              email = req.body.email;
              res.render("paginas/index", {
                  usuario: docs,
                  logado: bool
              });
          }
          else {
              var dialog = require('dialog');
              dialog.info('Falha ao carregar a lista de usuários :' + err);
              res.render('paginas/login');
          }
      }).lean();

    } else {
      var dialog = require('dialog');
      dialog.info('Email ou senha inválida!');
      res.render('paginas/login');
    }

  }).lean();
});

//banco de dados: read, jogar dados do usuário na tela de alteração de dados
router.get('/:id', (req, res) => {
    Usuario.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("paginas/editar", {
                viewTitle: "Atualizar usuário",
                usuario: doc,
                logado: bool
            });
        }
    }).lean();
});

//banco de dados: delete
router.get('/delete/:id', (req, res) => {
    Usuario.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            deslogar();
            var dialog = require('dialog');
            dialog.info('Usuário deletado!');
            res.redirect('/');
        }
        else {
          var dialog = require('dialog');
          dialog.info('Falha ao excluir usuário do banco de dados :' + err);
          res.render('paginas/logado', {
            logado: bool
          });
        }

    });
});

//status de autenticação
router.post('/logado', (req, res) => {
  Usuario.find({email: email}, (err, docs) => {
      if (!err) {
          res.render("paginas/logado", {
              usuario: docs,
              logado: bool
          });
      }
  }).lean();

});

router.post('/deslogado', (req, res) => {
  Usuario.find({}, (err, docs) => {
      if (!err) {
          deslogar();
          res.render("paginas/index");
      }
  }).lean();

});

function deslogar(){
  bool = false;
  email = '';
}

module.exports = router;
