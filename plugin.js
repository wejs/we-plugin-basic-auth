/**
 * Plugin basic auth main file
 */

const auth = require('basic-auth');

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({
    basicAuth: {
      name: null,
      pass: null
    }
  });

  // fast loader to skip features auto load
  plugin.fastLoader = function fastLoader(we, done) {
    done();
  }

  plugin.events.on('we:after:load:express', (we)=> {
    if (!we.config.basicAuth || !we.config.basicAuth.name) {
      return null; // skip if basicAuth not is set
    }

    we.express.use( function checkBasicAuthAccess(req, res, next) {
      const credentials = auth(req);

      if (
        !credentials ||
        credentials.name !== we.config.basicAuth.name ||
        credentials.pass !== we.config.basicAuth.pass
      ) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="'+we.config.hostname+'"')
        res.end('Em breve!');
      } else {
        delete req.headers.authorization; // delete used credentials
        next();
      }
    });
  });


  return plugin;
};