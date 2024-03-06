##
# Unlinking a linked Pipenv dependency (i.e. for Swagger integration)
#
#   usage:  sh unlink.sh [depenency name]
#   example:  sh unlink.sh farm-def-service-client
#
#   Note this only works for "github-repo" dependencies
##

if [[ -z "$1" ]] ; then
  echo 'Please provide name of the dependency'
  echo 'Example: sh link.sh farm-def-service-client /Users/jvu/dev/farm-def-service'
  exit 1
fi

dependency_name="$1"
pipenv_venv_dir=$(PIPENV_VERBOSITY=-1 pipenv --venv)
pipenv_venv_src_dir="$pipenv_venv_dir/src"
pipenv_venv_depedency_dir="$pipenv_venv_src_dir/$dependency_name"
pipenv_venv_dependency_bak_dir="$pipenv_venv_depedency_dir.bak"
pipenv_venv_depedency_link=$(readlink -f $pipenv_venv_depedency_dir)


if [[ -z $pipenv_venv_depedency_link ]] ; then
  echo '...ERROR...'
  echo 'Dependency cannot be found!'
  exit 1
fi

if [[ "$pipenv_venv_depedency_dir" = "$pipenv_venv_depedency_link" ]]; then
  echo '...ERROR...'
  echo 'No such link is found!'
  exit 1
else
  # delete the link
  echo 'Delete link...'
  rm -r $pipenv_venv_depedency_dir

  # restore the backup
  echo 'Restoring backup...'
  mv $pipenv_venv_dependency_bak_dir $pipenv_venv_depedency_dir

  echo '...DONE...'
  echo "SUCCESS!! $dependency_name dependency is restored"
  exit 1
fi
