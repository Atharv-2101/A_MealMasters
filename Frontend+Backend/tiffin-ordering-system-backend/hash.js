const bcrypt = require('bcrypt');

bcrypt.hash('super', 10).then(console.log);
