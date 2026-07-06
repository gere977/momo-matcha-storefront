import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Bejelentkezés",
  description: "Jelentkezz be a Momo Matcha fiókodba.",
}

export default function Login() {
  return <LoginTemplate />
}
