import os
import time
import numpy as np
import pandas as pd

def usage():
    print("Usage: python3 create_insert_maxerf_risetime.py panel_id")
    exit(1);

def read_csvs(csv):
    return pd.read_csv(csv, header=None, names=["ch", "rise_time", "max_erf_fit"])

if (len(os.sys.argv) != 2):
    usage()
elif (os.sys.argv[1] == "-h" or os.sys.argv[1] == "--help"):
    usage()

panel_id=os.sys.argv[1]
try:
    panel_id=int(panel_id)
except ValueError:
    print("panel_id \"" + panel_id + "\" is not a number");
    exit(1);

outfilename = '../sql/insert_maxerf_risetime.sql';
print("Creating " + outfilename + " for panel number " + str(panel_id) + "...");

panel_datafiles=[]
panel_name = "mn" + str(panel_id).zfill(3);
highest_run=0
with os.scandir("../data/deltatime_panel") as datafiles:
    for datafile in datafiles:
        if (datafile.is_file()):
            if (panel_name in datafile.name):
                # check which run number this is
                fields=datafile.name.split('_');
                run=""
                if ('r' in fields[1]):
                    run=fields[1];
                elif('r' in fields[2]):
                    run=fields[2];
                else:
                    print("No run number in file name: \"" + datafile.name + "\"");
                    exit(1)
                run_number=int(run.replace('r', ''))
                if (run_number > highest_run):
                    panel_datafiles.clear() # clear all previous runs
                    highest_run = run_number
                elif (run_number < highest_run):
                    continue;
                panel_datafiles.append(datafile)

output_line = "Using data files: ";
for datafile in panel_datafiles:
    output_line += datafile.name + " ";
print(output_line)
df = pd.concat(map(read_csvs, panel_datafiles)) # (panel_datafiles, header=None);

expected_rows = 48;
if (len(df.index) != expected_rows):
    print("Wrong number of rows. Expected " + str(expected_rows) + " but got " + str(len(df.index)));
    exit(1);

#print(df.values)
#print(df.head())
#print(df.sort_values('ch')['rise_time'].to_numpy())
#print(df.sort_values('ch')['rise_time'].to_string(index=False).replace("\n", ","))

insert_sql_file = open(outfilename, 'w')
insert_sql_file.write("UPDATE qc.panels SET max_erf_fit=\'{" + df.sort_values('ch')['max_erf_fit'].to_string(index=False).replace("\n", ",") + "}\' where id=" + str(panel_id) + ";\n");
insert_sql_file.write("UPDATE qc.panels SET rise_time=\'{" + df.sort_values('ch')['rise_time'].to_string(index=False).replace("\n", ",") + "}\' where id=" + str(panel_id) + ";\n");
print("Done!");
