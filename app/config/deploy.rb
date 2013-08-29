set :application, "tpp"
set :domain,      "lcweb.lc.local"
set :deploy_to,   "/www/tpp"
set :deploy_via,  :remote_cache
set :app_path,    "app"

set :repository,  "git@lcgitlab:loccom/#{application}.git"
set :scm,         :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `subversion`, `mercurial`, `perforce`, or `none`

set :model_manager, "doctrine"
# Or: `propel`

role :web,        domain                         # Your HTTP server, Apache/etc
role :app,        domain, :primary => true       # This may be the same as your `Web` server
role :db, domain, :primary => true # This may be the same as your `Web` server

set   :use_sudo,      false
set  :user, "deploy"
set  :keep_releases,  3

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL

set :shared_files, ["app/config/parameters.yml"]
set :shared_children, [app_path + "/logs", web_path + "/uploads", "vendor"]
set :use_composer, true
set :update_vendors, true

before 'deploy:finalize_update', 'grunt'

set :grunt_tasks, ['build']
