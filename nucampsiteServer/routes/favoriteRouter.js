const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');


const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorites => {
        if (favorites) {
          Favorite.findById(favorites._id)
            .populate('campsites')
            .then(favorites => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorites);
            });
        } else {
          err = new Error('Favorites not found.');
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })

.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            req.body.forEach(favorite => {
                if (!favorite.campsites.includes(favorite._id)) {
                    favorite.campsites.push(favorite._id);
                }
            });
            favorite.save()
              .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
         Favorite.create({ user: req.user._id })
            .then(favorite => {
              req.body.forEach(favorite => {
                favorite.campsites.push(favorite._id);
              });
              favorite.save()
                .then(favorite => {
                  Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('campsites')
                    .then(favorite=> {
                      console.log('Favorite Created ', favorite);
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                    });
                })
                .catch(err => next(err));
            })
            .catch(err=> next(err));
        }
      })
      .catch(err => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          Favorite.remove({ user: req.user._id })
          .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
          });
        } else {
          res.end('There are no favorites to delete!');
        }
      })
      .catch(err => next(err));
  });

favoriteRouter.route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.favoriteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          req.body.forEach(favorite => {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
              favorite.campsites.push(req.params.campsiteId);
            }
          });
          favorite.save()
            .then(favorite => {
              Favorite.findById(favorite._id)
                .populate('user')
                .populate('campsites');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorite => {
              favorite.campsites.push(req.params.campsiteId);
              favorite.save()
                .then(favorite => {
                  Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('campsites')
                    .then(favorite => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                    });
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.favoriteId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.favoriteId)
      .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch(err => next(err));
  });
                  


module.exports = favoriteRouter;