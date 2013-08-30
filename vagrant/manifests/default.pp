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

apt::source { 'packages.dotdeb.org':
  location          => 'http://packages.dotdeb.org',
  release           => $lsbdistcodename,
  repos             => 'all',
  required_packages => 'debian-keyring debian-archive-keyring',
  key               => '89DF5277',
  key_server        => 'keys.gnupg.net',
  include_src       => true
}

if $lsbdistcodename == 'wheezy' {
  apt::source { 'packages.dotdeb.org-php55':
    location          => 'http://packages.dotdeb.org',
    release           => 'wheezy-php55',
    repos             => 'all',
    required_packages => 'debian-keyring debian-archive-keyring',
    key               => '89DF5277',
    key_server        => 'keys.gnupg.net',
    include_src       => true
  }
}


class { 'puphpet::dotfiles': }

package { [
    'build-essential',
    'vim',
    'curl',
    'git-core'
  ]:
  ensure  => 'installed',
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
  www_root     => '/www/tpp/web/bundles/mayflowertppfrontend/app',
}

$path_translated = 'PATH_TRANSLATED $document_root$fastcgi_path_info'
$script_filename = 'SCRIPT_FILENAME $document_root$fastcgi_script_name'

nginx::resource::location { 'api-rewrite':
  ensure              => 'present',
  vhost               => 'tpp.dev',
  location            => '~ ^/api.+$',
  www_root            => '/www/tpp/web',
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
  www_root            => '/www/tpp/web',
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
    'include'                 => 'fastcgi_params'
  },
  notify              => Class['nginx::service'],
}

class { 'php':
  package             => 'php5-fpm',
  service             => 'php5-fpm',
  service_autorestart => false,
  config_file         => '/etc/php5/fpm/php.ini',
  module_prefix       => ''
}

php::module {
  [
    'php5-mysql',
    'php5-cli',
    'php5-curl',
    'php5-intl',
    'php5-mcrypt',
  ]:
  service => 'php5-fpm',
}

service { 'php5-fpm':
  ensure     => running,
  enable     => true,
  hasrestart => true,
  hasstatus  => true,
  require    => Package['php5-fpm'],
}

class { 'php::devel':
  require => Class['php'],
}

class { 'php::pear':
  require => Class['php'],
}



$xhprofPath = '/var/www/xhprof'

php::pecl::module { 'xhprof':
  use_package     => false,
  preferred_state => 'beta',
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
    Php::Pecl::Module['xhprof'],
    File["${xhprofPath}/xhprof_html"]
  ]
}


class { 'xdebug':
  service => 'nginx',
}

class { 'composer':
  require => Package['php5-fpm', 'curl'],
}

puphpet::ini { 'xdebug':
  value   => [
    'xdebug.default_enable = 1',
    'xdebug.remote_autostart = 0',
    'xdebug.remote_connect_back = 1',
    'xdebug.remote_enable = 1',
    'xdebug.remote_handler = "dbgp"',
    'xdebug.remote_port = 9000'
  ],
  ini     => '/etc/php5/fpm/conf.d/zzz_xdebug.ini',
  notify  => Service['php5-fpm'],
  require => Class['php'],
}

puphpet::ini { 'php':
  value   => [
    'date.timezone = "Europe/Berlin"'
  ],
  ini     => '/etc/php5/fpm/conf.d/zzz_php.ini',
  notify  => Service['php5-fpm'],
  require => Class['php'],
}

puphpet::ini { 'custom':
  value   => [
    'display_errors = On',
    'error_reporting = -1'
  ],
  ini     => '/etc/php5/fpm/conf.d/zzz_custom.ini',
  notify  => Service['php5-fpm'],
  require => Class['php'],
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

class { 'phpmyadmin':
  require => [Class['mysql::server'], Class['mysql::config'], Class['php']],
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
    'fastcgi_split_path_info' => '^(.+\.php)(/.+)$',
    'fastcgi_param'           => 'PATH_INFO $fastcgi_path_info',
    'fastcgi_param '          => 'PATH_TRANSLATED $document_root$fastcgi_path_info',
    'fastcgi_param  '         => 'SCRIPT_FILENAME $document_root$fastcgi_script_name',
    'fastcgi_pass'            => 'unix:/var/run/php5-fpm.sock',
    'fastcgi_index'           => 'index.php',
    'include'                 => 'fastcgi_params'
  },
  notify              => Class['nginx::service'],
  require             => Nginx::Resource::Vhost['phpmyadmin'],
}
