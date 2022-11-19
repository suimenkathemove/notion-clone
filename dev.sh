#!/bin/bash

shopt -s expand_aliases

alias tmux-start="sh ~/.commands/tmux-start.sh"

PROJECT_NAME="slack-clone"

DEV_DIR="${HOME}/development/emgniddikur"

cd "$DEV_DIR/$PROJECT_NAME"

tmux-start "$PROJECT_NAME"
