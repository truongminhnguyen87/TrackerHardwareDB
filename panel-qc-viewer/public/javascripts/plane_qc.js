const form = document.querySelector("form");
const log = document.querySelector("#log");
const single_channel_issues = ["missing_straws", "high_current_wires", "blocked_straws", "short_wires", "sparking_wires", "missing_anode", "missing_cathode" ] // the rest to be added
const doublet_channel_issues = ["missing_omega_pieces", "loose_omega_pieces"]

const showPlaneButton = document.getElementById('btnShowPlane');
showPlaneButton.addEventListener('click', async function () {
    var output = "";
    var plane_number = parseInt(document.getElementById('plane_number').value);
    if (!isNaN(plane_number)) {
	// const response = await fetch('getPlane/'+plane_number);
	// const plane_info = await response.json();

	// // Output the full return to the verbose output section
	// document.getElementById("log").innerHTML = JSON.stringify(plane_info,
	// 							  undefined,
	// 							  2);

	// Fill with DUMMY data for the time being
	var panels = Array(6).fill(0);
	for (let i_panel = 0; i_panel < 6; ++i_panel) {
	    panels[i_panel] = i_panel+1;
	}

	output = "Plane "+plane_number;
	for (let i_panel = 0; i_panel < 6; ++i_panel) {
	    var panel_number = panels[i_panel]
	    var this_title = "Panel "+panel_number.toString();
	    
	    const response = await fetch('getPanel/'+panel_number);
	    const panel_info = await response.json();

	    if (panel_info.length>0) {
		var this_panel_issues = panel_info[0]

		var all_wires = Array(96).fill(0)
		var wire_numbers = Array(96).fill(0)
		for (let i = 0; i < all_wires.length; i++) {
		    wire_numbers[i] = i;
		}
		
		var data = Array(single_channel_issues.length + doublet_channel_issues.length + 2) // +2 for max_erf_fit and rise_time
		var total_issues = 0

		for (let i = 0; i < doublet_channel_issues.length; i++) {
		    var the_issue = doublet_channel_issues[i];
		    var this_panel_doublets = Array(96).fill(0)
		    var this_panel_issue = this_panel_issues[the_issue];
		    for (let j = 0; j < this_panel_issue.length; j++) {
			this_panel_doublets[this_panel_issue[j]] = 1;
		    }
		    //		total_issues = total_issues + this_panel_issue.length
		    var this_data = {
			name : the_issue + " (DEMO)",
			type : 'histogram',
			histfunc : "sum",
			x: wire_numbers,
			y: this_panel_doublets,
			xbins : { start : -0.5, end : 96.5, size : 1}
		    };
		    data[i] = this_data
		}

		for (let i = 0; i < single_channel_issues.length; i++) {
		    var the_issue = single_channel_issues[i];
		    var this_panel_straws = Array(96).fill(0)
		    var this_panel_issue = this_panel_issues[the_issue];
		    for (let j = 0; j < this_panel_issue.length; j++) {
			this_panel_straws[this_panel_issue[j]] = 1;
		    }
		    total_issues = total_issues + this_panel_issue.length
		    var this_data = {
			name : the_issue,
			type : 'histogram',
			histfunc : "sum",
			x: wire_numbers,
			y: this_panel_straws,
			xbins : { start : 0, end : 96, size : 1}
		    };
		    data[doublet_channel_issues.length + i] = this_data
		}

		var max_erf_fits = this_panel_issues['max_erf_fit'];
		var doublet_numbers = Array(48).fill(0)
		for (let i = 0; i < doublet_numbers.length; i++) {
		    doublet_numbers[i] = (2*i+0.5);
		}
		var max_erf_fit_data = {
		    name : 'max_erf_fit',
		    type : 'scatter',
		    x: doublet_numbers,
		    y: max_erf_fits,
		    yaxis : 'y2',
		    mode : 'lines+markers',
		    marker : { color : 'red' },
		    line : { color : 'red' }
		};	    
		data[data.length-2] = max_erf_fit_data;
		
		//	    var rise_times = this_panel_issues['rise_time'];
		var rise_times = Array(48).fill(10);
		var rise_time_data = {
		    name : 'rise_time',
		    type : 'scatter',
		    x: doublet_numbers,
		    y: rise_times,
		    yaxis : 'y3',
		    mode : 'lines+markers',
		    marker : { color : 'blue' },
		    line : { color : 'blue' }
		};	    
		data[data.length-1] = rise_time_data;
		
		var plot_name = 'panel'+(i_panel+1).toString()+'_plot';
		console.log(plot_name);
		var straw_status_plot = document.getElementById(plot_name);
		var xaxis = {title : {text : 'straw number'}, tickmode : "linear", tick0 : 0.0, dtick : 1.0, gridwidth : 2, range : [0, 96], domain : [0, 0.9]};
		var yaxis = {title : {text : 'no. of issues'}};
		var layout = { title : {text: this_title + " Straw/Wire Status"},
			       xaxis : xaxis,
			       yaxis : yaxis,
			       yaxis2: {
				   title: 'Max Erf Fit [nA]',
				   overlaying: 'y',
				   side: 'right',
				   titlefont: {color: 'red'},
				   tickfont: {color: 'red'}
			       },
			       yaxis3: {
				   title: 'Rise Time [min]',
				   overlaying: 'y',
				   side: 'right',
				   position : 0.95,
				   titlefont: {color: 'blue'},
				   tickfont: {color: 'blue'}
			       },
			       barmode : 'stack',
			       legend: {"orientation": "h"},
			       //		   margin: {t:0},
			       scroolZoom : true };
		Plotly.newPlot(straw_status_plot, data, layout);	    
		// total = missing_straws.length + high_current_wires.length + blocked_straws.length + sparking_wires.length;
		output += "\n - panel " + panel_number + " has "+total_issues+" bad channels: \n"
		for (let i = 0; i < data.length-2; i++) {
		    var the_issue = "";
		    if (i < single_channel_issues.length) {
			if (i == 0) {
			    output += "\t single-channel issues: ";
			}
			the_issue = single_channel_issues[i];
		    }
		    else {
			if (i == single_channel_issues.length) {
			    output += "\n\t doublet-channel issues: ";
			}
			the_issue = doublet_channel_issues[i-single_channel_issues.length];
		    }
		    var this_panel_issue = this_panel_issues[the_issue];
		    output += this_panel_issue.length + " " + the_issue;
		    
		    if (i != data.length-1) { output += ", "; }
		}
	    }
	    else {
		output += " not found!";
	    }
	}
    }
    else {
	output = "Input must be a number";
    }
	    
    document.getElementById("plane_info").innerHTML = output;
});
