Exec { path => [ '/bin/', '/sbin/', '/usr/bin/', '/usr/sbin/' ] }
File { owner => 0, group => 0, mode => 0644 }

class {'apt':
  always_apt_update => true,
}

apt::ppa {'ppa:ondrej/php5': }

Class['::apt::update'] -> Package <|
    title != 'python-software-properties'
and title != 'software-properties-common'
|>

Package["libaugeas-ruby"] -> Augeas <| |>

package { [
    'build-essential',
    'vim',
    'curl',
    'git-core',
    'ruby1.9.1',
    'libaugeas-ruby',
  ]:
  ensure  => 'installed',
}

class { 'nginx':
#  sendfile => 'off'   # TODO not possible yet
}

nginx::resource::vhost { 'tpp.dev':
  ensure       => present,
  server_name  => [
    'tpp.dev'  ],
  listen_port  => 80,
  index_files  => [
    'index.html',
  ],
  www_root     => '/www/tpp/app',
  try_files   => ['$uri', '$uri/', '/index.html', '=404'],
}

$path_translated = 'PATH_TRANSLATED $document_root$fastcgi_path_info'
$script_filename = 'SCRIPT_FILENAME $document_root$fastcgi_script_name'

nginx::resource::location { 'api-rewrite':
  ensure              => 'present',
  vhost               => 'tpp.dev',
  location            => '~ ^/api.+$',
  www_root            => '/www/tpp/api/web',
  proxy               => undef,
  index_files  => [
    'app_dev.php',
  ],
  location_cfg_append => {
    'rewrite' => '^(.+)$ /app_dev.php/$1 last',
  },
  notify              => Class['nginx::service'],
}

nginx::resource::location { 'tpp.dev-php':
  ensure              => 'present',
  vhost               => 'tpp.dev',
  location            => '~ ^/app_dev\.php($|/)',
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
    'fastcgi_index'           => 'app_dev.php',
    'fastcgi_busy_buffers_size' => '512k',
    'fastcgi_buffer_size'       => '512k',
    'fastcgi_buffers'           => '16 512k',
    'include'                 => 'fastcgi_params'
  },
  notify              => Class['nginx::service'],
}

include php

class {
  'php::cli':
    ensure => present,
    provider => apt,
    settings => {
      set => {
        'Date/date.timezone' => 'Europe/Berlin',
      }
    };
  'php::dev':
    ensure => present,
    provider => apt;
  'php::pear':
    ensure => present;
  'php::extension::mysql':
    ensure => present,
    provider => apt;
  'php::extension::curl':
    ensure => present,
    provider => apt;
  'php::extension::mcrypt':
    ensure => present,
    provider => apt;
  'php::extension::intl':
    ensure => present,
    provider => apt;
  'php::extension::xdebug':
    ensure => present,
    provider => apt,
    inifile  => '/etc/php5/mods-available/xdebug.ini',
    settings => {
      set => {
        '.anon/xdebug.default_enable' => 1,
        '.anon/xdebug.remote_autostart' => 0,
        '.anon/xdebug.remote_connect_back' => 1,
        '.anon/xdebug.remote_enable' => 1,
        '.anon/xdebug.remote_handler' => "dbgp",
        '.anon/xdebug.remote_port' => 9000
      }
    };
  'php::composer': ;
  'php::fpm':
    ensure   => installed,
    inifile  => '/etc/php5/fpm/php.ini',
    settings => {
      set => {
        'Date/date.timezone' => 'Europe/Berlin',
      }
    };
}

php::fpm::conf {'www':
  listen => '/var/run/php5-fpm.sock',
  user => 'vagrant';
}

class {'phantomjs': }

class { 'mysql::server':
  root_password => 'tppdev'
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

mysql::db { 'mayflower_tpp_tests':
  grant    => [
    'ALL'
  ],
  user     => 'mayflower',
  password => 'efZeAJpnFbNs7eHy',
  host     => 'localhost',
  charset  => 'utf8',
  require  => Class['mysql::server'],
}

class { 'phpmyadmin':
  require => [Class['mysql::server'], Class['php::fpm']],
}

nginx::resource::vhost { 'phpmyadmin':
  ensure      => present,
  server_name => ['tpp.pma'],
  listen_port => 80,
  index_files => ['index.php'],
  www_root    => '/usr/share/phpmyadmin',
  try_files   => ['$uri', '$uri/', '/index.php?$args'],
  require     => Class['phpmyadmin'],
}

nginx::resource::location { "phpmyadmin-php":
  ensure              => 'present',
  vhost               => 'phpmyadmin',
  location            => '~ \.php$',
  proxy               => undef,
  try_files           => ['$uri', '$uri/', '/index.php?$args'],
  www_root            => '/usr/share/phpmyadmin',
  location_cfg_append => {
    'fastcgi_split_path_info'   => '^(.+\.php)(/.+)$',
    'fastcgi_param'             => 'PATH_INFO $fastcgi_path_info',
    'fastcgi_param '            => 'PATH_TRANSLATED $document_root$fastcgi_path_info',
    'fastcgi_param  '           => 'SCRIPT_FILENAME $document_root$fastcgi_script_name',
    'fastcgi_pass'              => 'unix:/var/run/php5-fpm.sock',
    'fastcgi_index'             => 'index.php',
    'include'                 => 'fastcgi_params'
  },
  notify              => Class['nginx::service'],
}

class { 'nodejs':
  manage_repo => true
} ->
package { "bower":
  ensure => present,
  provider => 'npm'
} ->
package { "grunt-cli":
  ensure => present,
  provider => 'npm'
} ->
exec { 'install_node_modules':
  command => 'npm install',
  cwd     => '/www/tpp',
  user    => 'vagrant',
  require => Class['nodejs']
} ->
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
  user    => 'vagrant',
  require => [
    Exec['composer_install'],
    Mysql::Db['mayflower_tpp']
  ]
}
exec { 'db_schema_create_test':
  command => '/www/tpp/api/app/console doctrine:schema:update -e test',
  cwd     => '/www/tpp/api',
  user    => 'vagrant',
  require => [
    Exec['composer_install'],
    Mysql::Db['mayflower_tpp_tests']
  ]
}
exec { 'assets_install':
  command => '/www/tpp/api/app/console assets:install --relative --symlink',
  cwd     => '/www/tpp/api',
  user    => 'vagrant',
  require => [
    Exec['db_schema_create']
  ]
}
exec { 'compass_install':
  command => 'gem install compass',
  require => Package['ruby1.9.1']
}
