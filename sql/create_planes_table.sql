set role mu2e_tracker_admin;

create table qc.planes (
	plane integer primary key,
	panels integer[] NULL
);

grant select on qc.planes to public;
grant insert on qc.planes to mu2e_tracker_admin;
