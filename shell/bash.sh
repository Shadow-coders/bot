if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; 
fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi;
 if [ -f /home/container/package.json ]; then /usr/local/bin/npm install --production; fi;
  /usr/local/bin/node /home/container/bot/src/index