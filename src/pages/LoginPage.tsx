import { useState } from 'react'
import type { FormEvent } from 'react'
import './LoginPage.css'

function LoginPage() {
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('Tentative de connexion', {
      pseudo,
      password,
    })
  }

  return (
    <main className="login-page">
      <img
        className="deco-cloud cloud-left"
        src="/login-assets/images/cloud-0001.webp"
        alt=""
      />
      <img
        className="deco-cloud cloud-right"
        src="/login-assets/images/cloud-0002.webp"
        alt=""
      />
      <img
        className="deco-cloud cloud-top"
        src="/login-assets/images/cloud-0003.webp"
        alt=""
      />

      <section className="login-card" aria-labelledby="login-title">
        <img
          className="login-logo"
          src="/login-assets/images/header-logo-full.svg"
          alt="Archipelago"
        />

        <header>
          <p className="eyebrow">Dock Access</p>
          <h1 id="login-title">Connexion</h1>
          <p className="login-subtitle">
            Entre ton pseudo et ton mot de passe pour rejoindre ton instance.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="pseudo">Pseudo</label>
          <input
            id="pseudo"
            name="pseudo"
            type="text"
            placeholder="Ex: CaptainSeed"
            autoComplete="username"
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Se connecter</button>
        </form>
      </section>

      <img
        className="deco-island"
        src="/login-assets/images/island-a.webp"
        alt=""
      />
      <img
        className="deco-rock"
        src="/login-assets/images/rock-single.webp"
        alt=""
      />
    </main>
  )
}

export default LoginPage
