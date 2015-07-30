#Scripts and Configuration

These scripts are to be used on the Edison to start the proper module when the Edison turns on.
Additionally, config.json serves as an example of the sort of configuration files one needs to put on the Edison as well.

##Using the start.sh scripts
The following strategy was originally found on the [Intel Community Forums](https://communities.intel.com/thread/57555?start=15&tstart=0).

First, extract the script and modules to your Edison in the /node_app_slot folder.

Next, make sure the script is executable, by using the following command:
chmod +x start.sh
 
Now, to ensure the system starts with the script running (thus eliminating any need for configuration on your part), 
add the following service file in the /lib/systemd/system/ directory.

[Unit]
Description=Edison Start
After=network.target
                                    
[Service]
Type=idle   
RemainAfterExit=true
ExecStart=/home/root/bluetooth-magic.sh     
Environment="HOME=/home/root"               
WorkingDirectory=/home/root/                
                                        
[Install]                               
WantedBy=multi-user.target
 
Enable it to start using the following command:
systemctl enable bluetooth-magic
 
Then reboot the Edison to test the setup.setup

##Troubleshooting
Coming Soon!