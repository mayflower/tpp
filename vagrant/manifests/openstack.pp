group { 'puppet': ensure => present }
Exec { path => [ '/bin/', '/sbin/', '/usr/bin/', '/usr/sbin/' ] }
File { owner => 0, group => 0, mode => 0644 }

class {'apt':
  always_apt_update => true,
}

Class['::apt::update'] -> Package <|
title != 'python-software-properties'
and title != 'software-properties-common'
|>

Package["libaugeas-ruby"] -> Augeas <| |>

package {
[
'build-essential',
'vim',
'curl',
'git-core',
'libaugeas-ruby',
]:
ensure  => 'installed',
before  => Class['php::augeas']
}

class { 'nginx': }

nginx::resource::vhost { 'tpp.novalocal':
ensure       => present,
server_name  => ['172.18.54.8', 'tpp.muc.mayflower.de', 'tpp.dmz.muc.mayflower.de', 'tpp.mayflower.de'],
listen_port  => 80,
index_files  => ['index.html',],
www_root     => '/www/tpp/dist',
try_files   => ['$uri', '$uri/', '/index.html', '=404'],
}

$path_translated = 'PATH_TRANSLATED $document_root$fastcgi_path_info'
$script_filename = 'SCRIPT_FILENAME $document_root$fastcgi_script_name'

nginx::resource::location { 'api-rewrite':
ensure              => 'present',
vhost               => 'tpp.novalocal',
location            => '~ ^/api.+$',
www_root            => '/www/tpp/api/web',
proxy               => undef,
index_files  => [
'app.php',
],
location_cfg_append => {'rewrite' => '^(.+)$ /app.php/$1 last',},
notify              => Class['nginx::service'],
}

nginx::resource::location { 'tpp.dev-php':
ensure              => 'present',
vhost               => 'tpp.novalocal',
location            => '~ ^/app\.php($|/)',
proxy               => undef,
www_root            => '/www/tpp/api/web',
index_files  => [
'app_dev.php',
],
location_cfg_append => {
'fastcgi_split_path_info' => '^(.+\.php)(/.+)$',
'fastcgi_param'           => 'PATH_INFO $fastcgi_path_info',
'fastcgi_param '          => $path_translated,
'fastcgi_param  '         => $script_filename,
'fastcgi_pass'            => 'unix:/var/run/php5-fpm.sock',
'fastcgi_index'           => 'app.php',
'fastcgi_busy_buffers_size' => '512k',
'fastcgi_buffer_size'       => '512k',
'fastcgi_buffers'           => '16 512k',
'include'                 => 'fastcgi_params'
},
notify              => Class['nginx::service'],
}

include php
include php::apt

class {
  'php::cli':
  ensure => present,
  provider => 'apt';
  'php::dev':
  ensure => present,
  provider => 'apt';
  'php::pear':
  ensure => present,
  provider => 'apt';
  'php::extension::mysql':
  ensure => present,
  provider => 'apt';
  'php::extension::curl':
  ensure => present,
  provider => 'apt';
  'php::extension::mcrypt':
  ensure => present,
  provider => 'apt';
  'php::extension::intl':
  ensure => present,
  provider => 'apt';
  'php::composer': ;
  'php::fpm':
  ensure   => installed,
  provider => 'apt',
  settings => {
  set => {
  'Date/date.timezone' => 'Europe/Berlin',
  }
  };
}

php::fpm::conf {'www':
  listen => '/var/run/php5-fpm.sock',
}

class { 'mysql::server':
  config_hash   => { 'root_password' => 'tppdev' }
}

mysql::db { 'mayflower_tpp':
  grant    => [
  'ALL'
  ],
  user     => 'mayflower',
  password => 'efZeAJpnFbNs7eHy',
  host     => 'localhost',
  charset  => 'utf8',
  require  => Class['mysql::server'],
}

class { "nodejs":
  version => '0.10.20-1chl1~quantal1',
  manage_repo => true,
}

package { 'bower':
  ensure => present,
  provider => 'npm',
  require => Class['nodejs']
}
package { 'grunt-cli':
  ensure => present,
  provider => 'npm',
  require => Class['nodejs']
}
exec { 'install_node_modules':
  command => 'npm install',
  cwd     => '/www/tpp',
  user    => 'www-data',
  require => Class['nodejs']
}
exec { 'install_bower_modules':
  command => 'bower install',
  cwd     => '/www/tpp',
  user    => 'www-data',
  require => Package['bower']
}
exec { 'composer_install':
  command => '/usr/local/bin/composer install',
  environment => 'COMPOSER_HOME=/usr/local/bin',
  cwd     => '/www/tpp/api',
  user    => 'www-data',
  require => [
  Class['php::composer'],
  Class['php::extension::intl']
  ]
}
exec { 'db_schema_create':
  command => '/www/tpp/api/app/console doctrine:schema:update',
  cwd     => '/www/tpp/api',
  user    => 'www-data',
  require => [
  Exec['composer_install'],
  Mysql::Db['mayflower_tpp']
  ]
}
exec { 'assets_install':
  command => '/www/tpp/api/app/console assets:install --relative --symlink',
  cwd     => '/www/tpp/api',
  user    => 'www-data',
  require => [
  Exec['db_schema_create']
  ]
}
exec { 'compass_install':
  command => 'gem install compass'
}

