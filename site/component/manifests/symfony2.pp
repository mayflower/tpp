class component::symfony2 (
  $path       = hiera('path', '/var/www/app_name'),
  $vhost      = hiera('vhost', 'app-name.dev'),
  $vhost_port = 80,
  $env        = hiera('env', 'dev'),
) {

  $index_file = $env ? {
    /development|dev/ => 'app_dev.php',
    default           => 'app.php'
  }
  $location_index = $env ? {
    /development|dev/ => '(app_dev|app)',
    default           => 'app'
  }

  nginx::resource::vhost { "${vhost}-${vhost_port}-symfony2":
    server_name => [$vhost],
    listen_port => $vhost_port,
    www_root    => "${path}/web",
    index_files => [index_file],
    try_files   => ['$uri', '@rewriteapp'],
  }

  nginx::resource::location { '@rewriteapp':
    vhost         => "${vhost}-${vhost_port}-symfony2",
    www_root      => "${path}/web",
    rewrite_rules => ["^(.*)\$ /${index_file}/\$1 last"]
  }

  nginx::resource::location { "~ ^/${location_index}\\.php(/|\$)":
    vhost               => "${vhost}-${vhost_port}-symfony2",
    www_root            => "${path}/web",
    fastcgi             => '127.0.0.1:9000',
    fastcgi_split_path  => '^(.+\.php)(/.+)$',
    location_cfg_append => {
      fastcgi_buffer_size       => '128k',
      fastcgi_buffers           => '4 256k',
      fastcgi_busy_buffers_size => '256k',
    }
  }

  if defined(Class['::hhvm']) {
    nginx::resource::vhost { "hhvm.${vhost}-${vhost_port}-symfony2":
      server_name => ["hhvm.${vhost}"],
      listen_port => $vhost_port,
      www_root    => "${path}/web",
      index_files => [index_file],
      try_files   => ['$uri', '@rewriteapp'],
    }

    nginx::resource::location { 'hhvm-sf2-rewrite':
      location      => '@rewriteapp',
      vhost         => "hhvm.${vhost}-${vhost_port}-symfony2",
      www_root      => "${path}/web",
      rewrite_rules => ["^(.*)\$ /${index_file}/\$1 last"]
    }

    nginx::resource::location { 'hhvm-sf2-php':
      location            => "~ ^/${location_index}\\.php(/|\$)",
      vhost               => "hhvm.${vhost}-${vhost_port}-symfony2",
      www_root            => "${path}/web",
      fastcgi             => '127.0.0.1:9090',
      fastcgi_split_path  => '^(.+\.php)(/.+)$',
      location_cfg_append => {
        fastcgi_buffer_size       => '128k',
        fastcgi_buffers           => '4 256k',
        fastcgi_busy_buffers_size => '256k',
      }
    }
  }
}
