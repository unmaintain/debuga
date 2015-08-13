var fs = require('fs');
var path = require('path');
var merge = require('merge');
var cwd = process.cwd();

module.exports = function (options) {
	options = merge(true, {}, {
		favicon: null,
		titlePrefix: 'DEBUG — ',
		dist: 'dist'
	}, options);

	return function(req, res, next) {
		var favicon, html, page, title, url;

		url = req.url;

		if (/(\.html|\/)$/.test(url)) {
			try {
				if (/\/$/.test(url)) {
					url = url + 'index.html';
				}

				page = path.join(cwd, options.dist, url);

				html = fs.readFileSync(page).toString();

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
				console.error('No such page:', page);
			}
		}

		if (/debug\.ico$/.test(url)) {
			try {
				favicon = options.favicon ? path.join(cwd, options.favicon) : path.join(__dirname, url);

				resource = fs.readFileSync(favicon);

				res.setHeader('Content-Type', 'image/x-icon');
				res.end(resource);

				return;
			} catch (err) {
				console.error('No such favicon:', path);
			}
		}

		return next();
	};
};
