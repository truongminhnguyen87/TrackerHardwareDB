const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
  .get('/:id', async(req, res, next) =>{
    const response = await fetch('https://dbdata0vm.fnal.gov:9443/QE/mu2e/prod/app/SQ/query?dbname=mu2e_tracker_prd&t=qc.planes&w=plane:eq:'+req.params.id+'&f=text');
    const planeInfo = await response.text();
    return res.send(planeInfo);
})

module.exports = router;
