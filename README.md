# assistant-deliveroo

Ce plugin de [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/) permet d'être tenu informé de l'état de la commande [Deliveroo](https://deliveroo.fr/) en cours, en utilisant le retour vocal du Google Home.
  
**Attention**, vous devez avoir une version supérieure ou égale à Node v8 pour utiliser ce plugin, ainsi qu'un Google Home et le [plugin `assistant-notifier`](https://aymkdn.github.io/assistant-plugins/?plugin=notifier).

## Installation

Si vous n'avez pas installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), alors il faut le faire.

Ensuite, pour ajouter ce plugin :
  - Pour Windows, télécharger [`install_deliveroo.bat`](https://github-proxy.kodono.info/?q=https://raw.githubusercontent.com/jzarca01/assistant-deliveroo/master/install_deliveroo.bat&download=install_deliveroo.bat) dans le répertoire `assistant-plugins`, puis l'exécuter en double-cliquant dessus.  
  - Pour Linux/MacOS, ouvrir une console dans le répertoire `assistant-plugins` et taper :  
  `npm install assistant-deliveroo@latest --save && npm run-script postinstall`

## Configuration

Deux paramètres sont obligatoires : `email` et `password`, qui correspondent à vos identifiants [Deliveroo](https://deliveroo.fr/).

## Utilisation

Utiliser l'applet ci-dessous : 
- Surveille ma commande --> *il faut créer l'applet via https://platform.ifttt.com/ pour pouvoir la publier et ensuite la partager*
