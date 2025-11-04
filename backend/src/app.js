// // const express = require('express');
// // const path = require('path');

// // const app = express();
// // app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), { maxAge: '7d', immutable: true }));

// // module.exports = app;

// // src/app.js
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const morgan = require('morgan');

// app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }));
// app.use(compression());
// app.use(express.json({ limit: '1mb' }));
// app.use(morgan('dev'));

// const path = require('path');
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), { maxAge: '7d', immutable: true }));

// // inject io into req
// app.use((req, _, next) => { req.io = app.get('io'); next(); });

// // routes
// app.use('/api/foods', require('./routes/foodRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));

// // 404 + centralized error handler
// app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// app.use((err, req, res, next) => {
// console.error(err);
// res.status(500).json({ error: 'Server error' });
// });

