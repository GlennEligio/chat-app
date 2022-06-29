class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    let user = { id, name, room };
    this.users.push(user);
    return user;
  }

  getUserList(room) {
    let usersInRoom = this.users.filter((user) => user.room === room);
    let namesArray = usersInRoom.map((user) => user.name);

    return namesArray;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  removeUser(id) {
    const userToRemove = this.getUser(id);

    if (userToRemove) {
      this.users = this.users.filter((user) => id !== user.id);
      return userToRemove;
    }
  }
}

module.exports = { Users };
