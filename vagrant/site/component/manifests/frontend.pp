class component::frontend (
  $path = '/www/app'
) {
  anchor {'component::frontend::begin': } ->
  class { 'nodejs':
    manage_repo => true
  } ->
  package { 'bower':
    provider => 'npm'
  } ->
  package { 'grunt-cli':
    provider => 'npm'
  } ->
  exec { 'install_node_modules':
    command => 'npm install',
    cwd     => $path,
    user    => 'vagrant',
  } ->
  exec { 'install_bower_modules':
    command => 'bower install',
    cwd     => $path,
    user    => 'vagrant',
  } ->
  anchor {'component::frontend::end': }
}