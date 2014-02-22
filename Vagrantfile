Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/ubuntu-server-12042-x64-vbox4210.box"

  #config.cache.auto_detect = true

  config.vm.network :private_network, ip: "192.168.56.101"
  config.ssh.forward_agent = true

  config.vm.usable_port_range = (2200..2250)

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--memory", 1024]
    v.customize ["modifyvm", :id, "--name", "tpp-dev-box"]
    v.customize ["setextradata", :id, "--VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.synced_folder "./", "/www/tpp/", id: "vagrant-root", :nfs => false

  config.vm.provision :shell, :inline =>
    "if [[ ! -f /apt-get-run ]]; then sudo apt-get update && sudo touch /apt-get-run; fi"
  config.vm.provision :shell, :inline => 'echo -e "mysql_root_password=tppdev
  controluser_password=awesome" > /etc/phpmyadmin.facts;'
  config.vm.provision :shell, :path => "vagrant/init-puppet.sh"

  config.vm.provision :puppet do |puppet|
    puppet.facter = {
      "ssh_username" => "vagrant"
    }

    puppet.manifests_path = "vagrant/manifests"
    puppet.module_path = ["vagrant/modules", "vagrant/site"]
    puppet.hiera_config_path = "vagrant/hiera.yaml"
  end

  config.ssh.username = "vagrant"

  config.ssh.shell = "bash -l"

  config.ssh.keep_alive = true
  config.ssh.forward_agent = false
  config.ssh.forward_x11 = false
  config.vagrant.host = :detect
end
