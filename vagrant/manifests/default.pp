Exec {
  path => [ '/bin/', '/sbin/', '/usr/bin/', '/usr/sbin/' ]
}

package { [
    'build-essential',
    'curl',
    'git-core'
  ]:
} ->
anchor { 'package_deps': } ->

class { 'component::ruby': }    ->
class { 'component::mysql': }   ->
class { 'component::php': }     ->
class { 'component::symfony': } ->
class { 'phpmyadmin': }

Anchor['package_deps'] ->
class { 'nginx': }     ->
class { 'phantomjs': }

Anchor['package_deps'] ->
class { 'component::frontend': }