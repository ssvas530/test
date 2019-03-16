var Scrap = require('../models').Scrap;

module.exports.findAll = function (req, res, next) {
    Scrap
        .find({})
        .exec(next);
};


module.exports.jobScrap = function (req, res, next) {
    Scrap
        .find({
            job: req.body._id
        })
        .populate('materialType', '_id name')
        .exec(next);
};

module.exports.create = function (req, res, next) {
    var scrap = new Scrap();
    scrap.name = req.body.name;
    scrap.amount = req.body.amount;
    scrap.date = req.body.date;

    scrap.materialType = req.body.materialType;
    scrap.job = req.body.job;
    scrap.save(next);
};

module.exports.update = function (req, res, next) {
    Scrap.findById(req.body._id, function (err, scrap) {
        if (err) {
            console.log('error:', err);
            return next(err);
        }
        scrap.amount = req.body.amount;
        scrap.materialType = req.body.materialType;
        scrap.date = req.body.date;

        scrap.name = req.body.name;
        scrap.save(next);
    });
};

module.exports.delete = function (req, res, next) {
    Scrap.remove({
        _id: req.body._id
    }, next);
};
