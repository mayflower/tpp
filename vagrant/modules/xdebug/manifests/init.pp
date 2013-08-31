class xdebug (
  $service = 'apache'
){

  package { 'xdebug':
    name    => 'php5-xdebug',
    ensure  => installed,
    require => Class['php::fpm'],
    notify  => Service[$service],
  }

}
