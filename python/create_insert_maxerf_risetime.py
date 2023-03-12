import os

def usage():
    print("Usage: python3 create_insert_maxerf_risetime.py panel_id")
    exit(1);

if (len(os.sys.argv) != 2):
    usage()
elif (os.sys.argv[1] == "-h" or os.sys.argv[1] == "--help"):
    usage()

import time
import numpy as np
import pandas as pd


def read_csvs(csv):
    return pd.read_csv(csv, header=None, names=["ch", "rise_time", "max_erf_fit"])


def find_datafiles(panel_name):
    panel_datafiles=[]
    # Collect all the data files for this panel
    with os.scandir("../data/deltatime_panel") as datafiles:
        for datafile in datafiles:
            if (datafile.is_file()):
                if (panel_name in datafile.name):
                    panel_datafiles.append(datafile)

    # Now we go through and get the specific files we want in this order
    # 1. if there are not separate ch0/ch1 files, then take the highest numbered run
    # 2. if there are separate ch0/ch1 files, then both files must be from the same, highest-numbered run
    # 3. if there are separate ch0/ch1 files, then both files must be from the same run
    # 4. if there are separate ch0/ch1 files, then each file must be the highest-numbered one for that channel
    separate_ch_files=False;
    highest_run=0
    returning_panel_datafiles=[] # these are the files we will return to the main function
    backup_panel_datafiles=[] # these are files we want to keep in back up in case we need them
    highest_ch0_run=0
    highest_ch1_run=0
    for i_run in range(10,0,-1):
        for datafile in panel_datafiles:
            fields=datafile.name.split('_');
            run=""
            ch=""
            if ('r' in fields[1]):
                run=fields[1];
                separate_ch_files = False
            elif('r' in fields[2]): # means there are separate ch0 and ch1 files
                run=fields[2];
                ch=fields[1]
                separate_ch_files = True
            run_number=int(run.replace('r', ''))
            if (not separate_ch_files):
                if (run_number == i_run):
                    returning_panel_datafiles.append(datafile)
                    break
            else: # we have separate ch0/ch1 files
                if (run_number == i_run):
                    if (len(returning_panel_datafiles) == 0):
                        returning_panel_datafiles.append(datafile)
                    elif (len(returning_panel_datafiles) == 1):
                        # check whether the existing datafile is from the same run
                        if (int(returning_panel_datafiles[0].name.split('_')[2].replace('r', '')) == i_run):
                            returning_panel_datafiles.append(datafile) # add this file which is from the same run
                        else:
                            backup_panel_datafiles.append(returning_panel_datafiles[0]) # hold on to this file in case we don't find two ch0/ch1 files with the same run number and want the highest numbered run
                            returning_panel_datafiles.clear()
                            returning_panel_datafiles.append(datafile) # add this file and look for one with the same run number later

        if (not separate_ch_files and len(returning_panel_datafiles) == 1):
            break; # from the i_run loop
        elif (separate_ch_files and len(returning_panel_datafiles) == 2):
            break; # from the i_run loop
        elif (separate_ch_files and len(returning_panel_datafiles) == 1):
            if (i_run == 1):
                # We are at the end and still just have one file, take one from the backup
                for backup_panel_datafile in backup_panel_datafiles:
                    if (returning_panel_datafiles[0].name.split('_')[1] != backup_panel_datafile.name.split('_')[1]): # make sure the channels are different
                        returning_panel_datafiles.append(backup_panel_datafile)
                        break;
                break;
            # Missing a file
        elif (len(returning_panel_datafiles) == 0):
            continue;
        else:
            print("Something went wrong in find_datafiles(), there are more files than expected: ");
            print("separate_ch_files = " + str(separate_ch_files))
            print("returning_panel_datafiles: ");
            print(returning_panel_datafiles)
            exit(1);

    return returning_panel_datafiles;



panel_id=os.sys.argv[1]
try:
    panel_id=int(panel_id)
except ValueError:
    print("panel_id \"" + panel_id + "\" is not a number");
    exit(1);

outfilename = '../sql/insert_maxerf_risetime.sql';
print("Creating " + outfilename + " for panel number " + str(panel_id) + "...");

panel_name = "mn" + str(panel_id).zfill(3);
panel_datafiles = find_datafiles(panel_name)
if (len(panel_datafiles) == 0):
    print("No data files found for " + panel_name);
    exit(1);

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
insert_sql_file.write("UPDATE qc.panels SET hv_data_filenames=\'{"
                      + ' '.join([datafile.name+"," for datafile in panel_datafiles[:-1]]) # all but the last filenames should be comma-separated
                      + ' '.join([datafile.name for datafile in panel_datafiles[-1:]])
                      + "}\' where id=" + str(panel_id) + ";\n");
print("Done!");
