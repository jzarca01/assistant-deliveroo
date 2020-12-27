const Deliveroo = require("node-deliveroo");
const deliveroo = new Deliveroo();

class AssistantDeliveroo {
  constructor({ accessToken, userId, updateInterval }) {
    this.accessToken = accessToken;
    this.userId = userId;
    this.updateInterval = updateInterval;
    this.current_step = {};
  }

  init(plugins) {
    this.plugins = plugins;
    if (!this.accessToken || !this.userId) {
      return Promise.reject(
        "[assistant-deliveroo] Erreur : vous devez configurer ce plugin !"
      );
    }
    return Promise.resolve(this);
  }

  setCurrentStep(step) {
    this.current_step = step;
  }

  resetCurrentStep() {
    this.current_step = {};
  }

  tryNotify(message) {
    if (this.plugins.notifier) {
      return this.plugins.notifier.action(message);
    }
    return null;
  }

  async trackOrder(accessToken, userId) {
    try {
      await deliveroo.setAccessToken(userId, accessToken);
      console.log("logged in");
      const interval = setInterval(async () => {
        const history = await deliveroo.getHistory(userId);
        const lastOrder = history.orders && history.orders.length >= 1
          ? history.orders[0].consumer_status
          : null;
        if (typeof lastOrder !== 'object') {
          if (
            lastOrder.code === "COMPLETE" ||
            lastOrder.code === "FAIL"
          ) {
            const isFail = this.current_step.code === "FAIL";
            this.tryNotify(
              `Votre commande ${isFail ? "a échoué" : "est terminée"}.`
            );
            clearInterval(interval);
          }
          else if (lastOrder.current_step !== this.current_step.current_step) {
            this.setCurrentStep(lastOrder);
            this.tryNotify(
              `Votre livraison en est à l'étape: ${lastOrder.title}, elle arrivera dans ${lastOrder.eta_minutes} minutes.`
            );
          }
        } else {
          this.tryNotify(`Aucune commande n'est accessible.`);
          clearInterval(interval);
        }
      }, this.updateInterval);
    } catch (err) {
      this.tryNotify(`Un problème est survenu avec le traqueur.`);
      console.log("err", err);
    }
  }

  async action(commande) {
    switch (commande) {
      case "track":
        return await this.trackOrder(this.accessToken, this.userId);
      default:
        break;
    }
  }
}

exports.init = (configuration, plugins) => {
  return new AssistantDeliveroo(configuration)
    .init(plugins)
    .then((resource) => {
      console.log("[assistant-deliveroo] Plugin chargé et prêt.");
      return resource;
    });
};
