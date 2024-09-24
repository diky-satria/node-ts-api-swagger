class HDate {
  public static date = new Date();
  public static year = this.date.getFullYear();
  public static month = String(this.date.getMonth() + 1).padStart(2, "0");
  public static day = String(this.date.getDate()).padStart(2, "0");
  public static hours = String(this.date.getHours()).padStart(2, "0");
  public static minutes = String(this.date.getMinutes()).padStart(2, "0");
  public static seconds = String(this.date.getSeconds()).padStart(2, "0");

  public static frFullDate() {
    return `${this.year}-${this.month}-${this.day} ${this.hours}:${this.minutes}:${this.seconds}`;
  }

  public static frDate() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  public static frFolderDate() {
    return `${this.year}${this.month}`;
  }
}

export default HDate;
