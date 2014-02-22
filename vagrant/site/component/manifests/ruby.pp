class component::ruby (
  $version = '1.9.1'
) {
  anchor { 'component::ruby::begin': } ->
  class { '::ruby':
    ruby_package     => "ruby${version}",
    rubygems_package => "rubygems${version}",
  } ->
  package { 'libaugeas-ruby': } ->
  package { 'compass':
    provider => 'gem'
  } ->
  anchor { 'component::ruby::end': }
}