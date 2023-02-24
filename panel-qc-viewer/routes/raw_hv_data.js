const express = require('express');
const router = express.Router();

router
  .get('/', async(req, res, next) =>{
      res.render('raw_hv_data', { title: 'Panel QC database viewer' });
});

module.exports = router;
