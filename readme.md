# Setting Up Hosting on a Machine as a Server using WSL

#### summary of the process i went through to host on a local machine as a server

## Step 1: Install and Run SSH on Both Host and Deploy Machines

**WSL Machine:**

- Update package list:

  ```bash

  sudo apt update

  sudo apt install openssh-server

  sudo service ssh start
  ```

## Step 2: Allow Password Authentication for ssh on WSL (server machine)

- Edit SSH configuration

```
sudo nano/vim /etc/ssh/sshd_config
```

- Allow Password Authentication

```
PasswordAuthentication yes
listen 0.0.0.0
port 22
```

- Restart SSH service

```
sudo service ssh restart
```

## Step 3: Create a Port Proxy to Forward SSH Port Connection from host machine to wsl ip

- Open Command Prompt as Administrator.
- Set up port proxy:

```cmd
netsh interface portproxy add v4tov4 listenport=22 listenaddress=0.0.0.0 connectport=22 connectaddress=127.0.0.1

```

## Step 4: Run the Service on the WSL Server Machine

Start the service on a preferred port (e.g., 8080):

```bash
python3 -m http.server 8080 // just an example it could be any thing running on the port. but on wsl
```

## Step 5: Create an Inbound Rule to Allow Traffic to Port 8080 on Host Machine

1. Open Windows Defender Firewall with Advanced Security.
2. Create a new inbound rule:
   - Type: Port
   - Protocol and Ports: TCP, Port Number: 8080
   - Action: Allow the Connection
   - Profile: Choose applicable profiles (Domain, Private, Public)
   - Name: e.g., "Allow Port 8080"

Command:

```powershell
New-NetFirewallRule -DisplayName "Allow Port 8080" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

## Step 6: Create a Port Proxy to Allow Traffic from Host Machine to SSH Instance IP

Set up a port proxy for the service port (e.g., 8080) using netsh:

```cmd
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=127.0.0.1
```

## Step 7: Access the Port from Any Machine on the Network via the Host IP Address

To access the port from any machine on the network via the host IP address, you need to configure port forwarding on your router or network gateway (step 6).

1. **Access Router Settings**: Open a web browser and enter your router's IP address in the address bar
2. **Configure Port Forwarding**: Look for the port forwarding or virtual server section in your router's settings. Add a new port forwarding rule:

   - External Port: The port number you want to access from outside the network (e.g., 8080).
   - Internal IP Address: The IP address of your host machine on the local network.
   - Internal Port: The port number on your host machine where the service is running (e.g., 8080).
   - Protocol: TCP (or UDP if applicable).
   - Save the changes.

3. **Access the Service**: Once port forwarding is configured, you can access the service from any machine on the network by using the external IP address of your router followed by the port number (e.g., `http://external_ip:8080`).

By setting up port forwarding, external requests to your router's IP address and the specified port will be forwarded to your host machine, allowing access to the service running on it.
