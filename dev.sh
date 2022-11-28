#!/bin/bash

PROJECT_NAME="slack-clone"

DEV_DIR="${HOME}/development/suimenkathemove"

cd "$DEV_DIR/$PROJECT_NAME" || exit

if tmux has-session -t "$PROJECT_NAME"; then
  tmux attach-session -t "$PROJECT_NAME"
else
  tmux new-session -s "$PROJECT_NAME" -d -n root
  tmux new-window -n backend -c "./backend" 'make up'
  tmux new-window -n frontend -c "./frontend" 'make up'
  tmux select-window -t root
  tmux attach-session -t "$PROJECT_NAME"
fi
