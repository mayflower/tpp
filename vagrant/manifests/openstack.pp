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
  server_name  => ['tpp.novalocal'],
  listen_port  => 80,
  index_files  => ['index.html',],
  www_root     => '/www/tpp/app',
  try_files   => ['$uri', '$uri/', '/index.html', '=404'],
}

$path_translated = 'PATH_TRANSLATED $document_root$fastcgi_path_info'
$script_filename = 'SCRIPT_FILENAME $document_root$fastcgi_script_name'

nginx::resource::location { 'api-rewrite':
  ensure              => 'present',
  vhost               => '172.18.54.8',
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
  vhost               => '172.18.54.8',
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
    ensure => present;
  'php::dev':
    ensure => present;
  'php::pear':
    ensure => present;
  'php::extension::mysql':
    ensure => present;
  'php::extension::curl':
    ensure => present;
  'php::extension::mcrypt':
    ensure => present;
  'php::extension::intl':
    ensure => present;
  'php::composer': ;
  'php::fpm':
    ensure   => installed,
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


include nodejs

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
  user    => 'vagrant',
  require => Class['nodejs']
}
exec { 'install_bower_modules':
  command => 'bower install',
  cwd     => '/www/tpp',
  user    => 'vagrant',
  require => Package['bower']
}
exec { 'composer_install':
  command => '/usr/local/bin/composer install',
  environment => 'COMPOSER_HOME=/usr/local/bin',
  cwd     => '/www/tpp/api',
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
exec { 'db_schema_create_test':
  command => '/www/tpp/api/app/console doctrine:schema:update -e test',
  cwd     => '/www/tpp/api',
  user    => 'www-data',
  require => [
  Exec['composer_install'],
  Mysql::Db['mayflower_tpp_tests']
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
