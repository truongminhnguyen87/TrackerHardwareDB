const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const papa = require('papaparse') // for parsing csv

router
  .get('/', async(req, res, next) =>{
      const response = await fetch('https://dbdata0vm.fnal.gov:9443/QE/mu2e/prod/app/SQ/query?dbname=mu2e_tracker_prd&t=imported.fnal_planes&c=last_modified');
      const panelInfo = await response.text();
      var parse_config = {header: true}
      const dates = papa.parse(panelInfo, parse_config).data;

      return res.send(dates);
})

module.exports = router;
