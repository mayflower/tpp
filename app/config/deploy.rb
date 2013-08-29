set :application, "tpp"
set :domain,      "#{application}.loc-com.de"
set :deploy_to,   "/var/www/tpp"
set :deploy_via, :remote_cache
set :app_path,    "app"

set :repository,  "lcgitlab:loccom/#{application}.git"
set :scm,         :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `subversion`, `mercurial`, `perforce`, or `none`

set :model_manager, "doctrine"
# Or: `propel`

role :web,        domain                         # Your HTTP server, Apache/etc
role :app,        domain, :primary => true       # This may be the same as your `Web` server

set   :use_sudo,      false
set :user, "deploy"
set  :keep_releases,  3
default_run_options[:pty] = true

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL

set :shared_files, ["app/config/parameters.yml"]
set :shared_children, [app_path + "/logs", web_path + "/uploads", "vendor"]
set :use_composer, true
set :update_vendors, true
