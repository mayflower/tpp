TPP - The Team Project Planner
===

Install Vagrant (vagrantup.com), nfs and VirtualBox

For additional niceties:
```
vagrant plugin install vagrant-vbguest (keeps your VirtualBox extensions up-to-date)
vagrant plugin install vagrant-hostmanager (manages /etc/hosts)
```

Fire it up
````
vagrant up
vagrant ssh
cd /var/www/tpp
composer install -d api
api/app/console doctrine:schema:create
grunt server
````

access tpp on:
http://tpp.dev

