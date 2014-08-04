# WASTED
**W**​eb
**A**​pplication
**ST**​ack for
**E**​xtreme
**D**​evelopment

This is a generic vagrant box (ubuntu) with php, mysql, composer and nginx and preconfigured vhosts for:
 - Symfony2
 - Zend Framework 1


## Sections
* [How to get WASTED](#how-to-get-wasted)
* [Usage](#usage)
* [Notes](#notes)
 * [Recommended Plugins](#recommended-plugins)
 * [LXC](#lxc)
* [Contributing](#contributing)

## How to get WASTED
WASTED is designed to be used with an existing git repository (containing your application).
Check out the [Setup](#setup) section of this document for instructions. If you want to get WASTED without an existing project see the [Notes](#notes) section.

### Setup
### Adding WASTED to your project
Switch to the root of your existing git repository and execute the following commands:
```
git subtree add --prefix vagrant https://github.com/Mayflower/wasted.git master
./vagrant/bootstrap.sh
```
This requires that there is no existing `vagrant` directory.

#### Note on git-subtree
`git-subtree` was first added to git with 1.7.11 in May 2012. If it isn't available on your machine see
the [installation instructions](https://github.com/git/git/blob/master/contrib/subtree/INSTALL).
All git subtree commands accept a `--squash` flag to squash the subtree commits into one commit.

### Configuration
All configuration happens in the `devstack.yaml` which gets created when running the bootstrap above.
You may add a `local_devstack.yaml` in which you can overwrite configuration in devstack.yaml e.g. when using
different IP or box name.

**TODO** Document devstack.yaml possibilities

### Updating
To update the devstack use (from the root of your git repository):
```
git subtree pull --prefix vagrant https://github.com/Mayflower/wasted.git master
```

## Usage
Once you completed the steps described in the [Setup](#setup) section just do a `vagrant up`.
r10k will first bootstrap your local Puppet modules and after that the provisioning process will be started.
This might not work if you are using non-Virtualbox providers.

### Additional information for windows users
 * You have to run `vagrant up` from the vagrant subdirectory
 * You have to edit your `C:\Windows\System32\drivers\etc\hosts` file manually

## Notes
### Recommended Plugins
The config makes use of but does not require:
 - vagrant-cachier (Package file caching)
 - vagrant-hostmanager (/etc/hosts management)

To update vbox guest extensions automatically you can use:
 - vagrant-vbguest

### LXC
If you are using LXC (instead of VirtualBox) obviously you should have `lxc` and a recent kernel (>3.5) installed.
Make sure to configure sane defaults in /etc/lxc/default.conf:

    lxc.network.type = veth
    lxc.network.link = virbr0
    lxc.network.flags = up

### WASTED without an existing project
If you do not (yet) have a project to use with WASTED the easiest way to test WASTED is to create a dummy repository:
```
# create directory, switch to new directory and initialize git repository
mkdir dummy_project && cd dummy_project && git init
# create a file and commit it to ensure there is a HEAD for the subtree command to work with
touch dummy_file && git add dummy_file && git commit dummy_file -m "Initial commit"
```
Your dummy repository is now ready for use with WASTED. Just follow the instruction from the [Setup](#setup) section.

## Contributing
For development of WASTED create a staging directory and clone the WASTED repository directly into the `vagrant` directory.
```
mkdir wasted_development && cd wasted_development
git clone git@github.com:Mayflower/wasted vagrant
```
Now you can hack on WASTED code as you would usually do while still retaining the ability to bootstrap and use it like described in the [setup](#setup) section.

### Merge changes back from within your project
If WASTED was subtree merged into your project and changes were made inside the `vagrant` directory that you would like to contribute, you need to use `git subtree push`.

If you have push access you may create a new branch directly and then submit a pull request:
```
git subtree push --prefix vagrant git@github.com:Mayflower/wasted $BRANCH_NAME
```

Otherwise please fork this repository and then create a pull request from your fork:
```
git subtree push --prefix vagrant git@github.com:$YOUR_USER/wasted $BRANCH_NAME
```

