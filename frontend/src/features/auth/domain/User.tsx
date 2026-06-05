export class User {
  private id: string;
  private displayName: string;
  private photoURL: string;

  private constructor(id: string, displayName: string, photoURL: string) {
    this.id = id;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.validate();
  }

  getId() {
    return this.id;
  }

  getDisplayName() {
    return this.displayName;
  }

  getPhotoURL() {
    return this.photoURL;
  }

  toJson(): { id: string; displayName: string; photoURL: string } {
    return { id: this.id, displayName: this.displayName, photoURL: this.photoURL };
  }

  //TODO REMOVE IN THE FUTURE THIS METHOD SHOULD NOT BELONG HERE
  static from({ id, displayName, photoURL }: { id: string; displayName: string; photoURL: string }): User {
    return new User.Builder().displayName(displayName).id(id).photoURL(photoURL).build();
  }

  private validate() {
    if (this.id == null || this.id.trim() === "") {
      throw new Error("User id is required");
    }

    if (this.displayName == null || this.displayName.trim() === "") {
      throw new Error("Display name is required");
    }
  }

  static Builder = class {
    private _id: string = "";
    private _displayName: string = "";
    private _photoURL: string = "";

    id(id: string) {
      this._id = id;
      return this;
    }

    displayName(displayName: string) {
      this._displayName = displayName;
      return this;
    }

    photoURL(photoURL: string) {
      this._photoURL = photoURL;
      return this;
    }

    build(): User {
      if (!this._id) {
        throw new Error("User id is required");
      }
      return new User(this._id, this._displayName, this._photoURL);
    }
  };
}
