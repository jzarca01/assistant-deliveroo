# assistant-deliveroo

Un plugin pour être tenu informé de l'état de votre commande Deliveroo avec votre assistant vocal

## Configuration

Dans le fichier `configuration.json`, ajoutez votre identifiant, votre mot de passe Deliveroo et votre code promo

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
      "password": "votreMotdePasse",
      "voucher": ""
    }
  }
}
```

## Utilisation

Le tracking sera appelé quand le message `deliveroo_track` sera envoyé à Pushbullet (depuis IFTTT)
