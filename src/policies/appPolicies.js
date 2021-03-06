module.exports = class AppPolicy {
  constructor(user, record, collaborators) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record && this.record.userId == this.user.id;
  }

  _isAdmin() {
    return this.user && this.user.role == 2;
  }

  _isPremium() {
    return this.user && this.user.role == 1;
  }

  _isMember() {
    return this.user && this.user.role == 0;
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
    if (this.record.private == false) {
      return (
        this._new() &&
        this.record &&
        (this._isMember() || this._isPremium() || this._isAdmin())
      );
    } else if (this.record.private == true) {
      return (
        this._new() &&
        this.record &&
        (this._isPremium() || this._isAdmin() || this._isMember())
      );
    }
  }

  showCollaborators() {
    return this.edit();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
