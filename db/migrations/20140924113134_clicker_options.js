/*
* Sails migration
* Created at 2014-09-24T11:31:34+09:00
* */

exports.up = function (adapter, done) {
	adapter.addAttribute('clickers', 'progressTime', {
      type: 'integer',
      defaultsTo: 90
    }, done);
};

exports.down = function (adapter, done) {
	adapter.removeAttribute('clickers', 'progressTime', done);
};
