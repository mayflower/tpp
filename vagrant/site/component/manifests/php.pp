class component::php {
  anchor { 'component::php::begin': }   ->
  apt::ppa { 'ppa:ondrej/php5': }       ->
  class { '::php': }                    ->
  class { '::php::cli':
    settings => {
      set => {
        'Date/date.timezone' => 'Europe/Berlin',
      }
    };
  }                                     ->
  class { '::php::dev': }               ->
  class { '::php::pear': }              ->
  class { '::php::extension::mysql': }  ->
  class { '::php::extension::curl': }   ->
  class { '::php::extension::mcrypt': } ->
  class { '::php::extension::intl': }   ->
  class { '::php::extension::xdebug':
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
  }                                     ->
  class { '::php::composer': }          ->
  class { '::php::fpm':
    inifile  => '/etc/php5/fpm/php.ini',
    settings => {
      set => {
        'Date/date.timezone' => 'Europe/Berlin',
      }
    };
  }                                     ->
  anchor { 'component::php::end': }

  Anchor ['component::php::begin'] ->
  ::php::fpm::conf {'www':
    listen => '/var/run/php5-fpm.sock',
    user => 'vagrant';
  }                                ->
  Anchor ['component::php::end']
}