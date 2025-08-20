import * as yup from "yup";

export class Schema {
  static signin() {
    return yup.object().shape({
      email: yup.string().email().required("Email é obrigatório."),
      password: yup.string().required("Senha é obrigatória."),
    });
  }

  static businessCreate() {
    return yup.object().shape({
      name: yup.string().required("Nome da empresa é obrigatório."),
    });
  }

  static businessUpdate() {
    return yup.object().shape({
      id: yup.string().required("ID da empresa é obrigatório."),
      name: yup.string().required("Nome da empresa é obrigatório."),
      deleted: yup.boolean().required("Campo de exclusão é obrigatório."),
      disabled: yup.boolean().required("Campo de desativação é obrigatório."),
    });
  }
}
