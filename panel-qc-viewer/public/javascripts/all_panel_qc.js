const single_channel_issues = ["missing_straws", "high_current_wires", "blocked_straws", "short_wires", "sparking_wires", "missing_anode", "missing_cathode" ] // the rest to be added
const doublet_channel_issues = ["missing_omega_pieces", "loose_omega_pieces"]

//
// All Panels Plot
//
const response = await fetch('allPanels');
const allPanelInfo = await response.json();
//console.log(allPanelInfo);
var single_channel_n_data = Array(single_channel_issues.length)
var panels = Array(allPanelInfo.length)
var hv_exists = Array(allPanelInfo.length).fill(0)
for (let i_panel = 0; i_panel < panels.length; i_panel++) {
    panels[i_panel] = allPanelInfo[i_panel]['id'];
    if (allPanelInfo[i_panel]['max_erf_fit'].length != 0) {
	hv_exists[i_panel] = 1;
    }
}
for (let i_issue = 0; i_issue < single_channel_issues.length; ++i_issue) {
    var n_issue = Array(allPanelInfo.length);
    var issue = single_channel_issues[i_issue];
//    console.log(issue)
    for (let i_panel = 0; i_panel < panels.length; i_panel++) {
	if (allPanelInfo[i_panel][issue] != null) {
	    n_issue[i_panel] = allPanelInfo[i_panel][issue].length;
	}
    }

    // Define Data
    single_channel_n_data[i_issue] = {name : issue,
					  x: panels,
					  y: n_issue,
					  mode:"markers",
					  type:"scatter"
					 }
}
var single_channel_issue_vs_panel_plot = document.getElementById('single_channel_issue_vs_panel_plot');
var xaxis = {title : {text : 'panel number'}, tickmode : "linear", tick0 : 0.0, dtick : 10.0, gridwidth : 2};
var yaxis = {title : {text : 'no. of channels with single-channel issues'}};
var layout = { title : {text: "All Single-Channel Issues vs Panel Number"},
	       xaxis : xaxis,
	       yaxis : yaxis,
	       scroolZoom : true };
Plotly.newPlot(single_channel_issue_vs_panel_plot, single_channel_n_data, layout);

var hv_data_vs_panel_plot = document.getElementById('hv_data_vs_panel_plot');
var hv_data_exists = {name : "hv_data_exists",
		      x: panels,
		      y: hv_exists,
		      mode:"markers",
		      type:"scatter"
		     }
var xaxis = {title : {text : 'panel number'}, tickmode : "linear", tick0 : 0.0, dtick : 10.0, gridwidth : 2};
var yaxis = {title : {text : ''}, 
	     tickmode: "array",
	     tickvals: [0, 1],
	     ticktext: ['no', 'yes']
	    };
var layout = { title : {text: "HV Data Exists?"},
	       xaxis : xaxis,
	       yaxis : yaxis,
	       scroolZoom : true };
Plotly.newPlot(hv_data_vs_panel_plot, [ hv_data_exists ], layout);
