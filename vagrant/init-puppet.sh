#!/bin/bash

CODENAME="precise"

echo "Downloading http://apt.puppetlabs.com/puppetlabs-release-${CODENAME}.deb"
wget --quiet --tries=5 --timeout=10 -O "/tmp/puppetlabs-release-${CODENAME}.deb" "http://apt.puppetlabs.com/puppetlabs-release-${CODENAME}.deb"
echo "Finished downloading http://apt.puppetlabs.com/puppetlabs-release-${CODENAME}.deb"

dpkg -i "/tmp/puppetlabs-release-${CODENAME}.deb" >/dev/null

echo "Running update-puppet apt-get update"
apt-get update >/dev/null
echo "Finished running update-puppet apt-get update"

echo "Updating Puppet to sane version"
apt-get -y install git puppet-common=3.4.0-1puppetlabs1 puppet=3.4.0-1puppetlabs1 ruby1.9.1 > /dev/null
PUPPET_VERSION=$(puppet help | grep 'Puppet v')
echo "Finished updating puppet to sane version: $PUPPET_VERSION"

echo "install r10k"
gem install r10k
cd /vagrant/vagrant
r10k puppetfile install
echo "installed r10k and puppet modules"
