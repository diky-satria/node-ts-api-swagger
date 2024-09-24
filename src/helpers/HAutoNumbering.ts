import { QueryTypes } from "sequelize";
// @ts-ignore
import { sequelize } from "../database/models";
import dayjs from "dayjs";
// @ts-ignore
import utc from "dayjs-plugin-utc";
// @ts-ignore
import timezone from "dayjs-timezone-iana-plugin";
const Models = require("../database/models/index.js");

dayjs.extend(utc);
dayjs.extend(timezone);
const dayjsAny: any = dayjs;

class AutoNumbering {
  prefix = process.env.AUTO_NUMBERING_CODE;
  yearFull: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;

  constructor() {
    this.yearFull = dayjsAny().tz("Asia/Jakarta").format("YYYY");
    this.year = dayjsAny().tz("Asia/Jakarta").format("YY");
    this.month = dayjsAny().tz("Asia/Jakarta").format("MM");
    this.day = dayjsAny().tz("Asia/Jakarta").format("DD");
    this.hour = dayjsAny().tz("Asia/Jakarta").format("HH");
    this.minute = dayjsAny().tz("Asia/Jakarta").format("mm");
  }

  async autoNumbering(): Promise<string> {
    // CEK APAKAH SUDAH ADA DATA DI TABLE COUNTER_NUMBERS
    const existingEntry = await sequelize.query(
      `SELECT * FROM counter_numbers WHERE code = '${this.prefix}' AND day = ${this.day} AND month = ${this.month} AND year = ${this.yearFull} AND sub_year = ${this.year}`,
      { type: QueryTypes.SELECT }
    );

    let autoNumber: string;

    if (existingEntry.length > 0) {
      // PENAMBAHAN NUMBERS JIKA SUDAH ADA
      autoNumber = String(existingEntry[0].number).padStart(3, "0");
      await Models.counter_numbers.update(
        {
          number: Number(autoNumber) + 1,
        },
        {
          where: {
            id: existingEntry[0].id,
          },
        }
      );
    } else {
      // INSERT DATA BARU JIKA BELUM ADA
      autoNumber = "001";
      await Models.counter_numbers.create({
        code: this.prefix,
        day: this.day,
        month: this.month,
        year: this.yearFull,
        sub_year: this.year,
        number: autoNumber,
      });
    }

    // AMBIL HASIL NUMBER DARI TABLE COUNTER_NUMBERS
    const result = await sequelize.query(
      `SELECT * FROM counter_numbers WHERE code = '${this.prefix}' AND day = ${this.day} AND month = ${this.month} AND year = ${this.yearFull} AND sub_year = ${this.year}`,
      { type: QueryTypes.SELECT }
    );

    const resultNumber = String(result[0].number).padStart(3, "0");
    const finalString = `${this.prefix}${this.year}${this.month}${this.day}${this.hour}${this.minute}${resultNumber}`;

    return finalString;
  }
}

export default AutoNumbering;
