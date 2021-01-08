const Deliveroo = require("node-deliveroo");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const deliveroo = new Deliveroo();

dayjs.extend(relativeTime);

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
        const lastOrder = history.orders ? history.orders[0] : null;
        if (lastOrder) {
          const { status, estimated_delivery_at } = lastOrder;
          if (status === "DELIVERED" || status === "FAIL") {
            const isFail = status === "FAIL";
            this.tryNotify(
              `Votre commande ${isFail ? "a échoué" : "est terminée"}.`
            );
            clearInterval(interval);
          } else if (status !== this.current_step.status) {
            this.setCurrentStep(lastOrder);
            this.tryNotify(
              `Votre livraison en est à l'étape: ${status}, elle arrivera dans ${dayjs(
                estimated_delivery_at
              ).fromNow(true)}.`
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
