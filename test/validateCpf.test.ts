import { validateCpf } from "../src/validateCpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "it should test if CPF is valid: %s",
  function (cpf: string) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
  }
);

test.each(["8774824880", null, undefined, "11111111111"])(
  "it should test if CPF is invalid: %s",
  function (cpf: any) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
  }
);
