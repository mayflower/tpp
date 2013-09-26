TPP - The Team Project Planner
===

Install Vagrant (vagrantup.com), nfs and vagrant-cachier

    vagrant up
    vagrant ssh
    cd /www/tpp
    NODENV_ROOT=/usr/local/share/nodenv /usr/local/share/nodenv/bin/nodenv exec grunt server


add following to local /etc/hosts:

    192.168.56.101 tpp.dev tpp.pma

access tpp on:
http://tpp.dev

phpmyadmin on (user root, pw tppdev):
http://tpp.pma

