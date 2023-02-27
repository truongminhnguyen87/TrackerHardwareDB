const express = require('express');
const router = express.Router();

router
  .get('/', async(req, res, next) =>{
      res.render('fnal_plane_db', { title: 'Panel QC database viewer' });
});

module.exports = router;
