#!/bin/sh

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

set -ex
# For future Josh that wants to make DB changes.
# Uncomment the line below and include in the PR that gets merged
# and goes through the deploy process. Before merging, go to your
# local terminal and run these commands:
# > flyctl image show
# The above ^ command will output the machine id you need for the next command:
# > flyctl machine update <machine_id> --vm-memory 512
# After that gets deployed, then merge the PR and let the code deploy
# and run the migrations. After that, comment the line below again and
# merge and let that deploy. Then go to your local terminal and downsize the
# memory back to 256:
# > flyctl machine update <machine_id> --vm-memory 256
# It sucks but such is life.
npx prisma@5.5.2 migrate deploy
npm run start
