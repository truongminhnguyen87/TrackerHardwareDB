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
