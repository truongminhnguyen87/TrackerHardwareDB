const express = require('express');
const router = express.Router();

router
  .get('/', async(req, res, next) =>{
      res.render('plane_qc', { title: 'Panel QC database viewer' });
});

module.exports = router;
