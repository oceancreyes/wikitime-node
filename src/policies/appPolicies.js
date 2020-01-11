module.exports = class AppPolicy {
    constructor(user, record) {
      this.user = user;
      this.record = record;
    }
    isOwner() {
      return this.record && this.record.userId == this.user.id;
    }
    isAdmin() {
      return this.user && this.user.role === 2;
    }
    isPremium() {
      return this.user.role === 1;
    }
    isStandard() {
      return this.user.role === 0;
    }
    _new() {
      return this.user != null;
    }
    create() {
      return this._new();
    }
    show() {
      return true;
    }
    edit() {
      return this._new();
    }
    update() {
      return this.edit();
    }
    destroy() {
      if (this.isOwner() == false) {
        return this.isAdmin();
      } else if (this.isOwner()) {
        return true;
      }
    }
  };
  