const express = require('express');
const router = express.Router();

router
  .get('/', async(req, res, next) =>{
      res.render('find_panel', { title: 'Panel QC database viewer' });
});

module.exports = router;
