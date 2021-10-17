const corsFilter = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Authorization, Accept, auth-token, address');

    res.header('Access-Control-Allow-Headers', '*');
    if (req.method == 'OPTIONS') {
      res.end();
    } else {
      next();
    }
  };
  
  module.exports = corsFilter;
  