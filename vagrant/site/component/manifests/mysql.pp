class component::mysql (
  $root_password = 'secret',
  $db_user = 'user',
  $db_password = 'secret',
  $db_name = 'appdb',
  $headers = false
) {
  anchor { 'component::mysql::begin': } ->
  class { '::mysql::server':
    root_password => $root_password
  } ->
  ::mysql::db { $db_name:
    user     => $db_user,
    password => $db_password,
    host     => 'localhost',
    grant    => ['ALL'],
  } ->
  anchor { 'component::mysql::end': }

  if $headers {
    Anchor['component::mysql::begin'] ->
    package { 'libmysqlclient-dev': } ->
    Anchor['component::mysql::end']
  }

  Anchor['component::mysql::begin'] ->
  ::mysql::db { "test_${db_name}":
    user     => $db_user,
    password => $db_password,
    host     => 'localhost',
    grant    => ['ALL']
  } ->
  Anchor['component::mysql::end']
}
