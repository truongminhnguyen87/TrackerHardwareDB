set role mu2e_tracker_admin;

create schema qc;
grant usage on schema qc to public;

create table qc.panels (
	id integer primary key,
	missing_straws integer[] NULL,
	high_current_wires integer[] NULL,
	blocked_straws integer[] NULL,
	sparking_wires integer[] NULL,
	no_hv_straw_hv integer[] NULL,
	no_hv_straw_cal integer[] NULL,
  missing_omega_pieces integer[] NULL,
	loose_omega_pieces integer[] NULL,
	overhang_omega_pieces integer[] NULL,
	overlap_omega_pieces integer[] NULL,
	dmb_height real[] NULL,
	earboard_installed boolean NULL,
	gain_test_done boolean NULL,
	hv_test_done boolean NULL,
	short_wires integer[] NULL,
	dmb_id integer NULL,
	max_erf_fit real NULL,
	missing_anode integer[] NULL,
	missing_cathode integer[] NULL,
	notes text NULL,
	hv_issues text NULL,
	earboard_issues text NULL,
	omega_piece_issues text NULL,
	last_hour_droege_img text NULL,
	traveler_img text NULL,
	hv_data text NULL,
	epoxy_in_dmb_connector text NULL,
	air_test_for_blocked_straws text NULL
);

grant select on qc.panels to public;
grant insert on qc.panels to mu2e_tracker_admin;
