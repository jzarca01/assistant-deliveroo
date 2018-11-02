# assistant-deliveroo

Un plugin pour être tenu informé de l'état de votre commande Deliveroo avec votre assistant vocal

## Configuration

Dans le fichier `configuration.json`, ajoutez votre identifiant et votre mot de passe Deliveroo

```json
{
  "main": {
    "pushbullet_token": ""
  },
  "plugins": {
    "notifier": {
      "host": ""
    },
    "deliveroo": {
      "email": "votre@email.com",
      "password": "votreMotdePasse"
    }
  }
}
```

## Utilisation

Le tracking sera appelé quand le message `deliveroo_track` sera envoyé à Pushbullet (depuis IFTTT)
