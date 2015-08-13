var fs = require('fs');
var merge = require('merge');
var cwd = process.cwd();

module.exports = function (options) {
	options = merge(true, {}, options, {
		favicon: null,
		titlePrefix: 'DEBUG — ',
		dist: cwd + '/dist'
	});

	return function(req, res, next) {
		var favicon, html, path, title, url;

		url = req.url;

		if (/(\.html|\/)$/.test(url)) {
			try {
				if (/\/$/.test(url)) {
					url = url + 'index.html';
				}

				path = (options.dist + url).replace(/\//g, '\\');

				html = fs.readFileSync(path).toString();


				title = (html.match(/<title>(.+)<\/title>/i) || '')[1];

				if (title) {
					title = title.replace(/'/g, '\\\'');
					title = '\t<script>console.log(\'' + options.titlePrefix + title + '\');</script>\n\t</head>';
					html = html.replace(/<\/head>/i, title);
				}

				html = html
						.replace(/\t*<link(.+?)?rel="(shortcut )?icon( shortcut)?"(.+?)?>\n?/gi, '')
						.replace(/<\/head>/i, '\t<link href="\/debug.ico" rel="icon">\n\t<\/head>')
						.replace(/<title>/i, '<title>' + options.titlePrefix);

				res.setHeader('Content-Type', 'text/html');
				res.end(html);

				return;
			} catch (err) {
				console.error('No such page:', path);
			}
		}

		if (/debug\.ico$/.test(url)) {
			try {
				path = options.favicon || __dirname + '/' + url;
				favicon = fs.readFileSync(path);

				res.setHeader('Content-Type', 'image/x-icon');
				res.end(favicon);

				return;
			} catch (err) {
				console.error('No such favicon:', path);
			}
		}

		return next();
	};
};
