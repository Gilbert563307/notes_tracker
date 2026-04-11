export class UserDto {
  private id: string;
  private displayName: string;
  private photoURL: string;

  private constructor(id: string, displayName: string, photoURL: string) {
    this.id = id;
    this.displayName = displayName;
    this.photoURL = photoURL;
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
    return { id: this.id, displayName: this.displayName, photoURL: this.displayName };
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

    build() {
      return new UserDto(this._id, this._displayName, this._photoURL);
    }
  };
}
