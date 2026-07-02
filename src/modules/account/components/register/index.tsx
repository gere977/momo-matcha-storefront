"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="font-heading text-5xl text-matcha-accent mb-4">
        Regisztráció
      </h1>
      <p className="text-center text-base-regular text-matcha-text/70 mb-4">
        Csatlakozz a Momo Matcha közösséghez és gyűjts MoMo Pontokat minden
        vásárlással.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Keresztnév"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Vezetéknév"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="E-mail cím"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefonszám"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Jelszó"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-matcha-text/70 text-small-regular mt-6">
          A fiók létrehozásával elfogadod a Momo Matcha{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline text-matcha"
          >
            Adatvédelmi szabályzatát
          </LocalizedClientLink>{" "}
          és{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline text-matcha"
          >
            ÁSZF-jét
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton
          className="w-full mt-6 h-12 rounded-full bg-matcha-accent hover:bg-matcha text-white font-bold uppercase tracking-wider text-sm border-none"
          data-testid="register-button"
        >
          Fiók létrehozása
        </SubmitButton>
      </form>
      <span className="text-center text-matcha-text/70 text-small-regular mt-6">
        Már van fiókod?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline text-matcha font-semibold"
        >
          Bejelentkezés
        </button>
        .
      </span>
    </div>
  )
}

export default Register
