const server = require('./server');
process.env.NODE_ENV === 'development' ?
  console.log('menjalankan server di mode development🚀⚡') :
  console.log('menjalankan server di mode production✅');

server();
