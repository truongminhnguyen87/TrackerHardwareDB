const showAnaHVDataButton = document.getElementById('btnShowAnaHVData');
showAnaHVDataButton.addEventListener('click', async function () {
    var output = "";
    var panel_number = parseInt(document.getElementById('panel_number_ana').value);

    const max_run_to_try = 10;
    const min_run_to_try = 1;
    if (!isNaN(panel_number)) {
	var this_title = "Panel "+panel_number;
	console.log(this_title);

	// Some images have a run number in the file name (e.g. mn251_r7.png, mn251_r7_smooth.png)
	var i_smooth_run = max_run_to_try;
	var img_smoothdata = document.getElementById('img_smoothdata');
	var smooth_data = function(){ 
	    if (i_smooth_run == 1) {
		img_smoothdata.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_datasmooth.png";
		--i_smooth_run;
	    }
	    else if (i_smooth_run > min_run_to_try) {
		img_smoothdata.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_r" + i_smooth_run.toString() + "_smooth.png";
		--i_smooth_run;
	    }
	    else {
		img_smoothdata.src = "images/hv_data/notfound.png";
	    }
	}
	img_smoothdata.onerror = smooth_data;
	img_smoothdata.onload = function() { document.getElementById("smooth_filename").innerHTML = img_smoothdata.src; }
	smooth_data();
	
	var i_raw_run = max_run_to_try;
	var img_rawdata = document.getElementById('img_rawdata');
	var raw_data = function(){ 
	    if (i_raw_run == 1) {
		img_rawdata.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_rawdata.png";
		--i_raw_run;
	    }
	    else if (i_raw_run > min_run_to_try) {
		img_rawdata.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_r" + i_raw_run.toString() + ".png";
		--i_raw_run;
	    }
	    else {
		img_rawdata.src = "images/hv_data/notfound.png";
	    }
	}
	img_rawdata.onerror = raw_data;
	img_rawdata.onload = function() { document.getElementById("raw_filename").innerHTML = img_rawdata.src; }
	raw_data();

	var i_maxerf_run = max_run_to_try;
	var img_maxerf = document.getElementById('img_maxerf');
	var maxerf_data = function(){ 
	    if (i_maxerf_run == 1) {
		img_maxerf.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_maxerf.png";
		--i_maxerf_run;
	    }
	    else if (i_maxerf_run > min_run_to_try) {
		img_maxerf.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_maxerf_r" + i_maxerf_run.toString() + ".png";
		--i_maxerf_run;
	    }
	    else {
		img_maxerf.src = "images/hv_data/notfound.png";
	    }
	}
	img_maxerf.onerror = maxerf_data;
	img_maxerf.onload = function() { document.getElementById("maxerf_filename").innerHTML = img_maxerf.src; }
	maxerf_data();
	
	var i_deltatime_run = max_run_to_try;
	var img_deltatime = document.getElementById('img_deltatime');
	var deltatime_data = function(){ 
	    if (i_deltatime_run == 1) {
		img_deltatime.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_deltatime.png";
		--i_deltatime_run;
	    }
	    else if (i_deltatime_run > min_run_to_try) {
		img_deltatime.src =  "images/hv_data/mn" + panel_number.toString().padStart(3,'0') + "_deltatime_r" + i_deltatime_run.toString() + ".png";
		--i_deltatime_run;
	    }
	    else {
		img_deltatime.src = "images/hv_data/notfound.png";
	    }
	}
	img_deltatime.onerror = deltatime_data;
	img_deltatime.onload = function() { document.getElementById("deltatime_filename").innerHTML = img_deltatime.src; }
	deltatime_data();
    }
    else {
	output = "Input must be a number";
    }
	    
//    document.getElementById("panel_info").innerHTML = output;
});

const showRawHVDataButton = document.getElementById('btnShowRawHVData');
showRawHVDataButton.addEventListener('click', async function () {
    var output = "";
    var panel_number = parseInt(document.getElementById('panel_number_raw').value);

    const n_doublets = 48;
    if (!isNaN(panel_number)) {
	var this_title = "Panel "+panel_number;

	var all_current_data = Array(n_doublets);
	for (let i_doublet = 0; i_doublet < n_doublets; ++i_doublet) {
	    var chan1_number = (2*i_doublet).toString();
	    var chan2_number = (2*i_doublet+1).toString();
	    var doublet_number = i_doublet.toString().padStart(2,'0');
	    var axis_doublet_number = (i_doublet+1).toString().padStart(2,'0'); // axis names have to start counting at 1...

	    const hv_response = await fetch('getRawHVData/'+panel_number+'/'+doublet_number);
	    const hv_data = await hv_response.json();

	    var timestamps = hv_data.map(a => a.timestamp);
	    var currents = hv_data.map(a => a.current);
	    var currents_data = {
		name : 'current_' + chan1_number + "_" + chan2_number,
		type : 'scatter',
		x: timestamps,
		y: currents,
		mode : 'lines',
		xaxis : 'x'+axis_doublet_number,
		yaxis : 'y'+axis_doublet_number
	    };	    
	    all_current_data[i_doublet] = currents_data;
	}

    
	raw_hv_data_plot = document.getElementById('raw_hv_data_plot');
	var xaxis = {title : {text : 'timestamp'}};
	var yaxis = {title : {text : 'current [nA]'}, range : [0, 1]};
	var layout = { //title : {text: this_title + " HV Data"},
		       grid: {rows: 8, columns: 6, pattern: 'independent'},
		       legend: {"orientation": "h"},
//	    yaxis: yaxis,
		       //		   margin: {t:0},
		   scroolZoom : true };
	Plotly.newPlot(raw_hv_data_plot, all_current_data, layout);	    
    }
    else {
	output = "Input must be a number";
    }
	    
//    document.getElementById("panel_info").innerHTML = output;
});
