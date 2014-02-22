class component::symfony (
  $path = '/www/app/api'
) {
  anchor { 'component::symfony::begin': } ->
  exec { 'composer_install':
    command => '/usr/local/bin/composer install',
    environment => 'COMPOSER_HOME=/usr/local/bin',
    cwd     => $path,
  } ->
  exec { 'db_schema_create':
    command => "${path}/app/console doctrine:schema:update --force",
    cwd     => $path,
    user    => 'vagrant',
  } ->
  exec { 'db_schema_create_test':
    command => "${path}/app/console doctrine:schema:update --force -e test",
    cwd     => $path,
    user    => 'vagrant',
  } ->
  exec { 'assets_install':
    command => "${path}/app/console assets:install --relative --symlink",
    cwd     => $path,
    user    => 'vagrant',
  } ->
  anchor { 'component::symfony::end': }
}