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

class { 'puphpet::dotfiles': }

package { [
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
  user => 'vagrant';
}
php::config {'xdebug_conf':
  inifile  => '/etc/php5/fpm/conf.d/20-xdebug.ini',
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
}

$xhprofPath = '/var/www/xhprof'

php::extension { 'xhprof':
  package  => 'xhprof',
  ensure   => '0.9.3',
  provider => 'pecl';
}

if !defined(Package['git-core']) {
  package { 'git-core' : }
}

vcsrepo { $xhprofPath:
  ensure   => present,
  provider => git,
  source   => 'https://github.com/facebook/xhprof.git',
  require  => Package['git-core']
}

file { "${xhprofPath}/xhprof_html":
  ensure  => 'directory',
  owner   => 'vagrant',
  group   => 'vagrant',
  mode    => '0775',
  require => Vcsrepo[$xhprofPath]
}

composer::run { 'xhprof-composer-run':
  path    => $xhprofPath,
  require => [
    Class['composer'],
    File["${xhprofPath}/xhprof_html"]
  ]
}

nginx::resource::vhost { 'xhprof':
  ensure      => present,
  server_name => ['xhprof'],
  listen_port => 80,
  index_files => ['index.php'],
  www_root    => "${xhprofPath}/xhprof_html",
  try_files   => ['$uri', '$uri/', '/index.php?$args'],
  require     => [
    Php::Extension['xhprof'],
    File["${xhprofPath}/xhprof_html"]
  ]
}

class { 'xdebug':
  service => 'nginx',
}

class { 'composer':
  require => Package['php5-fpm', 'curl'],
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
  require => [Class['mysql::server'], Class['mysql::config'], Class['php::fpm']],
}

nginx::resource::vhost { 'phpmyadmin':
  ensure      => present,
  server_name => ['phpmyadmin'],
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
  require             => Nginx::Resource::Vhost['phpmyadmin'],
}

include nodejs::v0_10
nodejs::module { "bower":
  node_version => 'v0.10'
}
nodejs::module { "grunt-cli":
  node_version => 'v0.10'
}
exec { 'node_version':
  command => '/usr/local/share/nodenv/bin/nodenv global v0.10',
  environment => 'NODENV_ROOT=/usr/local/share/nodenv',
  cwd     => '/www/tpp',
  require => Class['nodejs::v0_10']
}
exec { 'install_node_modules':
  command => '/usr/local/share/nodenv/bin/nodenv exec npm install',
  cwd     => '/www/tpp',
  user    => 'vagrant',
  environment => 'NODENV_ROOT=/usr/local/share/nodenv',
  require => Exec['node_version']
}
exec { 'install_bower_modules':
  command => '/usr/local/share/nodenv/bin/nodenv exec bower install',
  cwd     => '/www/tpp',
  user    => 'vagrant',
  environment => 'NODENV_ROOT=/usr/local/share/nodenv',
  require => Nodejs::Module['bower']
}
composer::run { 'composer_install':
  path    => '/www/tpp/api',
  require => [
    Class['composer'],
    Class['php::extension::intl']
  ]
}
exec { 'db_schema_create':
  command => '/www/tpp/api/app/console doctrine:schema:update',
  cwd     => '/www/tpp/api',
  user    => 'vagrant',
  require => [
    Composer::Run['composer_install'],
    Mysql::Db['mayflower_tpp']
  ]
}
exec { 'db_schema_create_test':
  command => '/www/tpp/api/app/console doctrine:schema:update -e test',
  cwd     => '/www/tpp/api',
  user    => 'vagrant',
  require => [
    Composer::Run['composer_install'],
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
  command => 'gem install compass'
}
