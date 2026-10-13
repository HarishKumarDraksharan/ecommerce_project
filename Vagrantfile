
Vagrant.configure("2") do |config|
  # Ubuntu 22.04
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "shopsphere-dev"

  # Private network with a unique IP
  config.vm.network "private_network", ip: "192.168.56.17"

  # Forward Nginx HTTP port to Windows localhost:8080
  config.vm.network "forwarded_port",
    guest: 80,
    host: 8080,
    host_ip: "127.0.0.1",
    auto_correct: true

  # Share the current ShopSphere project with Ubuntu
  config.vm.synced_folder ".",
    "/home/vagrant/ecommerce-platform"

  # VirtualBox resources
  config.vm.provider "virtualbox" do |vb|
    vb.name = "ShopSphere-Dev"
    vb.memory = 4096
    vb.cpus = 2
  end

  # Install Docker Engine and Docker Compose on first boot
  config.vm.provision "shell", inline: <<-SHELL
    set -eux

    apt-get update
    apt-get install -y ca-certificates curl

    install -m 0755 -d /etc/apt/keyrings

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
      -o /etc/apt/keyrings/docker.asc

    chmod a+r /etc/apt/keyrings/docker.asc

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list

    apt-get update

    apt-get install -y \
      docker-ce \
      docker-ce-cli \
      containerd.io \
      docker-buildx-plugin \
      docker-compose-plugin

    systemctl enable --now docker

    # Allow the Vagrant user to run Docker commands
    usermod -aG docker vagrant

    docker --version
    docker compose version
  SHELL
end
