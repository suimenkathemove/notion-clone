#!/bin/bash

# EDIT THIS
PROJECT_NAME="notion-clone"

# EDIT THIS
DEV_DIR_PATH="${HOME}/development/suimenkathemove"

cd "$DEV_DIR_PATH/$PROJECT_NAME" || exit

if tmux has-session -t "$PROJECT_NAME"; then
  tmux attach-session -t "$PROJECT_NAME"
else
  # EDIT THIS
  tmux new-session -s "$PROJECT_NAME" -d -n root
  # EDIT THIS
  tmux new-window -n backend -c "./backend" 'makers dev'
  # EDIT THIS
  tmux new-window -n frontend-dev -c "./frontend" 'pnpm dev'
  # EDIT THIS
  tmux new-window -n frontend-storybook -c "./frontend" 'pnpm storybook'
  # EDIT THIS
  tmux select-window -t root

  tmux attach-session -t "$PROJECT_NAME"
fi
