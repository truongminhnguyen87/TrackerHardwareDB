import os

def usage():
    print("Usage: python3 create_insert_new_panel.py panel_id")
    exit(1);

if (len(os.sys.argv) != 2):
    usage()
elif (os.sys.argv[1] == "-h" or os.sys.argv[1] == "--help"):
    usage()

import time
import numpy as np
import pandas as pd


panel_id=os.sys.argv[1]
try:
    panel_id=int(panel_id)
except ValueError:
    print("ERROR: panel_id \"" + panel_id + "\" is not a number. Exiting...");
    exit(1);

outfilename = '../sql/insert_new_panel.sql';
print("Creating " + outfilename + " for panel number " + str(panel_id) + "...");

insert_sql_file = open(outfilename, 'w')
insert_sql_file.write("INSERT INTO qc.panels(id) VALUES(" + str(panel_id) + ");\n");

print("Done!");
print("Now check " + outfilename + " looks OK and then run the following command:")
print("  psql -h ifdb08 -p 5459 mu2e_tracker_prd < " + outfilename)
