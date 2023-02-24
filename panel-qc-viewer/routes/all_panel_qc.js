const express = require('express');
const router = express.Router();

router
  .get('/', async(req, res, next) =>{
      res.render('all_panel_qc', { title: 'Panel QC database viewer' });
});

module.exports = router;
