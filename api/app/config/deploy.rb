set :application, "tpp"
set :domain,      "lcweb.lc.local"
set :deploy_to,   "/www/tpp"
set :deploy_via,  :remote_cache
set :app_path,    "app"
set :web_path,    "web"
set :cache_path,  "api/app/cache"

set :repository,  "git@lcgitlab:loccom/#{application}.git"
set :scm,         :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `subversion`, `mercurial`, `perforce`, or `none`

set :model_manager, "doctrine"
# Or: `propel`

role :web,        domain                         # Your HTTP server, Apache/etc
role :app,        domain, :primary => true       # This may be the same as your `Web` server
role :db, domain, :primary => true # This may be the same as your `Web` server

set  :use_sudo, false
set  :user, "deploy"
set  :keep_releases, 3

set :composer_options,  "--no-dev --verbose --prefer-dist --optimize-autoloader --working-dir=api"
set :composer_dump_autoload_options, "--optimize --working-dir=api"
set :symfony_console, "api/app/console"

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL

set :shared_files, ["api/app/config/parameters.yml"]
set :shared_children, ["api/app/logs", "api/app/uploads", "api/vendor"]
set :use_composer, true
set :update_vendors, true

# before "symfony:cache:warmup", "symfony:doctrine:migrations:migrate"
before 'deploy:finalize_update', 'grunt'
before 'grunt', 'bower:install'
before 'bower:install', 'npm:install'

set :grunt_tasks, ['build']

namespace :bower do
  desc "Install bower components"
  task :install do
    run "cd #{release_path} && bower install --production --quiet"
  end
end

namespace :npm do
  desc "Install npm components"
  task :install do
    run "cd #{release_path} && npm install --quiet"
  end
end
