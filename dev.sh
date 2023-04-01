#!/bin/bash

# EDIT THIS
PROJECT_NAME="monorepo-sandbox"

# EDIT THIS
DEV_DIR_PATH="${HOME}/development/suimenkathemove"

cd "$DEV_DIR_PATH/$PROJECT_NAME" || exit

if tmux has-session -t "$PROJECT_NAME"; then
  tmux attach-session -t "$PROJECT_NAME"
else
  # EDIT THIS
  tmux new-session -s "$PROJECT_NAME" -d -n root
  # EDIT THIS
  tmux new-window -n backend -c "./backend" 'make up'
  # EDIT THIS
  tmux new-window -n frontend -c "./frontend" 'make up'
  # EDIT THIS
  tmux select-window -t root

  tmux attach-session -t "$PROJECT_NAME"
fi
