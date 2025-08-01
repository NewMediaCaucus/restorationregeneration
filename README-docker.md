# README

This details the steps for getting Docker set up to run the New Media Caucus website.

## Step 0: Install Docker Engine and Docker Compose.

Before we can start, you will have to install the Docker Engine on your computer. This is best done on a laptop or workstation (non-servers) by installing the Docker Desktop application. Docker Desktop will install Compose for you.
You can follow the official documentation here for your OS:

Linux: https://docs.docker.com/engine/install/

macOS: https://docs.docker.com/desktop/install/mac-install/

Windows: https://docs.docker.com/desktop/install/windows-install/

## Step 1. Mac and Linux users, create an id.env file.

### Windows Users

You don't need an id.env file. You can jump to Step 3.

### Mac and Linux Users

You're going to generate an id.env file for your computer. We have id.env in .gitignore so it won't share your id up to GitHub.com. Your ID is just a simple number, such as ```1001```. You need Docker to use this same ID to run Apache with the same ID as the ID that mount's your local filesystem.

### Mac Users

Double-click the *create-id-mac.command* file provided in this repo.

**Note**: If you get a permission error when trying to run the file, you may need to make it executable first by running:

```bash
chmod +x create-id-mac.command
```

This will create your id.env file.

You may need to enter your username and password to run this.

**Alternative method using terminal:**
If you prefer to run the script from the terminal, you can use:

```bash
./create-id-mac.command
```

Make sure you're in the project directory when running this command.

### Linux Users

Make the create-id-linux.sh file executable
The ```+x``` is for eXecutable.

```chmod +x create-id-linux.sh```

Run *create-id-linux.sh* from the terminal.
```./create-id-linux.sh```

This will create your id.env file. 
You may need to run this as sudo.
```$ sudo create-id-linux.sh```

## Step 2. Mac and Linux users, make the entrypoint.sh script executable and run it

Windows users can skip this step. Mac and Linux users, there's a script that your docker will need to run so it needs the "executable" permission. Use this command to make it executable.

The ```+x``` is for eXecutable.

```chmod +x entrypoint.sh```

## Step 3. Build and run your DEV environment using docker's compose

Now use this command to build your dev environment. This uses the ```docker compose``` command. Compose let's you get fancy with your Docker setups.

Windows Users:
```sudo docker compose -f docker-compose.windows-dev.yml up --build -d```

Mac and Linux Users:
```docker compose -f docker-compose.dev.yml up --build -d```

**Note**: If you get a permission error, you may need to use `sudo` before the docker commands, or ensure your user is in the docker group.

### Build and start your DEV containers from images you already have

Note: If you have already created your docker images and you just want to create containers you can run remove the --build argument.

Example for Windows Users:
```docker compose -f docker-compose.windows-dev.yml up -d```

Example for Mac and Linux Users:
```docker compose -f docker-compose.dev.yml up -d```

This should now be serving this repo on http://localhost:8888
You'll notice our development port is 8888. If you need to change it for yourself, just edit the ports line in your docker-compose.dev.yml

### Stopping and deleting your DEV containers with the Docker Compose down command

Windows Users:
```docker compose -f docker-compose.windows-dev.yml down```

Mac and Linux Users:
```docker compose -f docker-compose.dev.yml down```

## Docker on Staging and Production

### Installing Docker on Ubuntu

#### Method 1: Official Docker Installation (Recommended)

**1. Update package index and install prerequisites:**
```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

**2. Add Docker's official GPG key:**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

**3. Add Docker repository:**
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**4. Update package index again:**
```bash
sudo apt update
```

**5. Install Docker Engine:**
```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**6. Add your user to the docker group (so you don't need sudo):**
```bash
sudo usermod -aG docker $USER
```

**7. Start and enable Docker service:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**8. Verify installation:**
```bash
docker --version
docker run hello-world
```

#### Method 2: Quick Install Using Convenience Script

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**After installation:**
- **Log out and back in** for the docker group membership to take effect
- **Or run:** `newgrp docker` to start a new shell with docker group


### Building and running the production (also known as prod) containers

The production containers are setup to be the production (prod) environment.

You might ask yourself, how might dev and prod need to be different?

- prod needs to have certificates setup so https:// works, not just http://.
- dev should have logging turned on, where prod should only have mininal logging.
- dev should have autoreload capabilitites so devs can see changes in the browser right away. Prod should not.

The beauty of Docker is only one developer has to set this up and everybody else gets it for free.

### Building and running prod

ATTN: This should only be run on a staging or prod server. It won't harm your dev setup, it just won't work.

```cd /home/rrnmc/restorationregeneration```

```sudo docker compose -f docker-compose.prod.yml up --build -d```

You will be prompted for the nmcdev password.

Upon successful start, you should see two containers running: "certbot" and "restorationregeneration-prod-container".
