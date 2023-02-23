const showHVDataButton = document.getElementById('btnShowHVData');
showHVDataButton.addEventListener('click', async function () {
    var output = "";
    var panel_number = parseInt(document.getElementById('panel_number').value);

    const n_pairs = 48;
    if (!isNaN(panel_number)) {
	var this_title = "Panel "+panel_number;

	var all_current_data = Array(n_pairs);
	for (let i_pair = 0; i_pair < n_pairs; ++i_pair) {
	    var chan1_number = (2*i_pair).toString();
	    var chan2_number = (2*i_pair+1).toString();
	    var pair_number = i_pair.toString().padStart(2,'0');
	    var axis_pair_number = (i_pair+1).toString().padStart(2,'0'); // axis names have to start counting at 1...

	    const hv_response = await fetch('getHVData/'+panel_number+'/'+pair_number);
	    const hv_data = await hv_response.json();

	    var timestamps = hv_data.map(a => a.timestamp);
	    var currents = hv_data.map(a => a.current);
	    var currents_data = {
		name : 'current_' + chan1_number + "_" + chan2_number,
		type : 'scatter',
		x: timestamps,
		y: currents,
		mode : 'lines',
		xaxis : 'x'+axis_pair_number,
		yaxis : 'y'+axis_pair_number
	    };	    
	    all_current_data[i_pair] = currents_data;
	}

    
	hv_data_plot = document.getElementById('hv_data_plot');
	var xaxis = {title : {text : 'timestamp'}};
	var yaxis = {title : {text : 'current [nA]'}, range : [0, 1]};
	var layout = { //title : {text: this_title + " HV Data"},
		       grid: {rows: 8, columns: 6, pattern: 'independent'},
		       legend: {"orientation": "h"},
//	    yaxis: yaxis,
		       //		   margin: {t:0},
		   scroolZoom : true };
	Plotly.newPlot(hv_data_plot, all_current_data, layout);	    
    }
    else {
	output = "Input must be a number";
    }
	    
//    document.getElementById("panel_info").innerHTML = output;
});
