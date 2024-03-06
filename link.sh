##
# Linking a Pipenv dependency to a local service (i.e. for Swagger integration)
# 
#   usage:  sh link.sh [depenency name] [depedency source (local repo)]
#   example:  sh link.sh farm-def-service-client /Users/jvu/dev/farm-def-service
#
#   Note this only works for "github-repo" dependencies
##

if [[ -z "$1" ]] ; then
  echo 'Please provide name of the dependency'
  echo 'Example: sh link.sh farm-def-service-client /Users/jvu/dev/farm-def-service'
  exit 1
fi

if [[ -z "$2" ]] ; then
  echo 'Please provide the location of depdency source (local repo)'
  echo 'Example: sh link.sh farm-def-service-client /Users/jvu/dev/farm-def-service'
  exit 1
fi

dependency_name="$1"
dependency_source_dir="$2"
pipenv_venv_dir=$(PIPENV_VERBOSITY=-1 pipenv --venv)
pipenv_venv_src_dir="$pipenv_venv_dir/src"
pipenv_venv_depedency_dir="$pipenv_venv_src_dir/$dependency_name"
pipenv_venv_dependency_bak_dir="$pipenv_venv_depedency_dir.bak"
pipenv_venv_depedency_link=$(readlink -f $pipenv_venv_depedency_dir)

if [[ -z $(readlink -f $dependency_source_dir) ]] ; then
    echo '...ERROR...'
    echo 'Your dependency source cannot be found!'
    exit 1
fi

if [[ -z $pipenv_venv_depedency_link ]] ; then
    echo '...ERROR...'
    echo 'Dependency cannot be found! Make sure this dependency is already installed.'
    echo 'If not, please run "pipenv install --dev" before linking'
    exit 1
fi

if [[ "$pipenv_venv_depedency_dir" = "$pipenv_venv_depedency_link" ]]; then
  # if symlink does not exist
  # backup the current dependency
  echo 'Back up current dependency...'
  mv $pipenv_venv_depedency_link $pipenv_venv_dependency_bak_dir

  # sym link it!
  echo 'Linking dependeny source...'
  run_sym_link=$(ln -s $dependency_source_dir $pipenv_venv_depedency_link)

  if [[ -z $run_sym_link ]] ; then
    echo '...DONE...'
    echo "SUCCESS!! $dependency_name is now linked to $dependency_source_dir"
    exit 1
  fi

else
  # if symlink does exist
  echo '...ERROR...'
  echo 'Link already exists! To unlink, use "unlink.sh"'
  echo 'Example: sh unlink.sh farm-def-service-client'
  exit 1
fi
