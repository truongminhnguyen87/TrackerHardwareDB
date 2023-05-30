set role mu2e_tracker_admin;

create schema qc;
grant usage on schema qc to public;

create table qc.panels (
	id integer primary key,
	missing_straws integer[] DEFAULT '{}',
	high_current_wires integer[] DEFAULT '{}',
	blocked_straws integer[] DEFAULT '{}',
	sparking_wires integer[] DEFAULT '{}',
	no_hv_straw_hv integer[] DEFAULT '{}',
	no_hv_straw_cal integer[] DEFAULT '{}',
	missing_omega_pieces integer[] DEFAULT '{}',
	loose_omega_pieces integer[] DEFAULT '{}',
	short_wires integer[] DEFAULT '{}',
	max_erf_fit real[] DEFAULT '{}',
	missing_anode integer[] DEFAULT '{}',
	missing_cathode integer[] DEFAULT '{}',
	rise_time real[] DEFAULT '{}',
	missing_wires integer[] DEFAULT '{}',
	maxerf_risetime_filenames text[] DEFAULT '{}',
);

grant select on qc.panels to public;
grant insert on qc.panels to mu2e_tracker_admin;
