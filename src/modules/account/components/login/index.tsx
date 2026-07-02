import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="font-heading text-5xl text-matcha-accent mb-4">Bejelentkezés</h1>
      <p className="text-center text-base-regular text-matcha-text/70 mb-8">
        Jelentkezz be a Momo Matcha közösségbe.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="E-mail cím"
            name="email"
            type="email"
            title="Adj meg egy érvényes e-mail címet."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Jelszó"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6 h-12 rounded-full bg-matcha-accent hover:bg-matcha text-white font-bold uppercase tracking-wider text-sm border-none"
        >
          Bejelentkezés
        </SubmitButton>
      </form>
      <span className="text-center text-matcha-text/70 text-small-regular mt-6">
        Még nincs fiókod?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline text-matcha font-semibold"
          data-testid="register-button"
        >
          Regisztrálj
        </button>
        .
      </span>
    </div>
  )
}

export default Login
