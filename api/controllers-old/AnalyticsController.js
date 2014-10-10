/**
 * AnalyticsController
 *
 * @description :: Server-side logic for managing analytics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 * http://www.bttd.co/api/analytics/action?ec=ec&ea=ea&el=el
 * itunes, playstore, homepage
 * ec = Blog, Homepage
 * ea = itunes, playstore
 * el = blog pages : category_order (ex : peerinstruction_1) or Homepage
 */

module.exports = {

	// Blog -> itunes
	// http://www.bttd.co/api/analytics/itunes?ec=Blog&ea=itunes&el=페이지명 
	// Homepage -> itunes
	// http://www.bttd.co/api/analytics/itunes?ec=Homepage&ea=itunes&el=home
	itunes : function(req, res) {
		var ec = req.param('ec');
		var ea = req.param('ea');
		var el = req.param('el');

		var analytics = 'http://www.google-analytics.com/collect?v=1&tid=UA-46797708-1&cid=555&t=event';
		var append = '';
		if (ec)
			append = append +'&ec=' + ec;
		if (ea)
			append = append +'&ea=' + ea;
		if (el)
			append = append +'&el=' + el;
		analytics = analytics + append;

		var request = require('request');
		request(analytics, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(append);
		  }
		})

		return res.redirect('https://itunes.apple.com/us/app/bttendance/id829410376?ls=1&mt=8');
	},

	// Blog -> Google playstore	
	// http://www.bttd.co/api/analytics/playstore?ec=Blog&ea=playstore&el=페이지명
	// Homepage -> Google playstore
	// http://www.bttd.co/api/analytics/playstore?ec=Homepage&ea=playstore&el=home
	playstore : function(req, res) {
		var ec = req.param('ec');
		var ea = req.param('ea');
		var el = req.param('el');

		var analytics = 'http://www.google-analytics.com/collect?v=1&tid=UA-46797708-1&cid=555&t=event';
		var append = '';
		if (ec)
			append = append +'&ec=' + ec;
		if (ea)
			append = append +'&ea=' + ea;
		if (el)
			append = append +'&el=' + el;
		analytics = analytics + append;

		var request = require('request');
		request(analytics, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(append);
		  }
		})

		return res.redirect('https://play.google.com/store/apps/details?id=com.bttendance');
	},

	// Blog -> Homepage
	// http://www.bttd.co/api/analytics/homepage?ec=Blog&ea=Homepage&el=페이지명
	homepage : function(req, res) {
		var ec = req.param('ec');
		var ea = req.param('ea');
		var el = req.param('el');

		var analytics = 'http://www.google-analytics.com/collect?v=1&tid=UA-46797708-1&cid=555&t=event';
		var append = '';
		if (ec)
			append = append +'&ec=' + ec;
		if (ea)
			append = append +'&ea=' + ea;
		if (el)
			append = append +'&el=' + el;
		analytics = analytics + append;

		var request = require('request');
		request(analytics, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(append);
		  }
		})

		return res.redirect('http://www.bttendance.com');
	}
};

