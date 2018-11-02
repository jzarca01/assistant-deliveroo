const Deliveroo = require('node-deliveroo')
const deliveroo = new Deliveroo()

const NewTempMail = require('./mailbucks')
const newTempMail = new NewTempMail()

class AssistantDeliveroo {
  constructor({
    email,
    password,
    voucher
  }) {
    this.email = email
    this.password = password
    this.voucher = voucher
    this.current_step = {}
  }

  init(plugins) {
    this.plugins = plugins
    if (!this.email || !this.password) {
      return Promise.reject("[assistant-deliveroo] Erreur : vous devez configurer ce plugin !")
    }
    return Promise.resolve(this)
  }

  setCurrentStep(step) {
    this.current_step = step
  }

  resetCurrentStep() {
    this.current_step = {}
  }

  setEmail(email) {
    this.email = email
  }

  async createAccount(mail, password, voucher = '') {
    try {
      const tempMail = await newTempMail.createNewEmail(mail)
      this.setEmail(tempMail);
      const signup = await deliveroo.signUp(tempMail, password)
      if (voucher !== '') {
        await deliveroo.addVoucherToUser(signup.user.id, voucher)
      }
      /*       .then(() => {
              this.broker.call('pushover.send', {
                title: 'Deliveroo account',
                message: `${this.settings.email.toLowerCase()}:${
                  this.settings.password
                }`
              }); */
      return console.log(`Account created ${tempMail.toLowerCase()}:${
          password
        }`)
    } catch (err) {
      console.log(`An error occured : ${err}`)
    }
  }

  async trackOrder(mail, password) {
    try {
      const login = await deliveroo.login(mail, password)
      const history = await deliveroo.getHistory(login.user.id)
      const lastOrder = history.orders ? history.orders[0].consumer_status : null
      if (
        lastOrder.current_step !==
        this.current_step.current_step
      ) {
        this.setCurrentStep(lastOrder)
        if (this.plugins.notifier)
          this.plugins.notifier.action(`Votre livraison en est à l'étape: ${
            lastOrder.title
          }, elle arrivera dans ${lastOrder.eta_minutes} minutes`)
      }
      if (this.current_step.code === 'COMPLETE') {
        this.resetCurrentStep()
      } else {
        setTimeout(async () => await this.trackOrder(mail, password),
          120000)
      }
    } catch (err) {
      if (this.plugins.notifier)
        this.plugins.notifier.action(`Un problème est survenu avec le traqueur`)
      console.log('err', err)
    }
  }

  async action(commande) {
    switch (commande) {
      case 'track':
        return await this.trackOrder(this.email, this.password)
      case 'generate':
        return await this.createAccount(this.email, this.password, this.voucher)
      default:
        break
    }
  }
}

exports.init = (configuration, plugins) => {
  return new AssistantDeliveroo(configuration).init(plugins)
    .then(resource => {
      console.log("[assistant-deliveroo] Plugin chargé et prêt.")
      return resource
    })
}