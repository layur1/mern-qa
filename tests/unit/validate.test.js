const { isValidName } = require("../../utils/validate");

test("valid task name returns true", () => {
  expect(isValidName("Study QA")).toBe(true);
});

test("blank task name returns false", () => {
  expect(isValidName("   ")).toBe(false);
});
