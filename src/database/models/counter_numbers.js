"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class counter_numbers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  counter_numbers.init(
    {
      code: DataTypes.STRING,
      day: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      sub_year: DataTypes.INTEGER,
      number: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "counter_numbers",
    }
  );
  return counter_numbers;
};
