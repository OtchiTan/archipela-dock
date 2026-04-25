import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LOGIN_STORAGE_KEY = 'archiLogin'
const LOGIN_REDIRECT_PATH = '/dashboard'

function LoginPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [slotName, setSlotName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const loginData = {
      address: address.trim(),
      slotName: slotName.trim(),
      password,
    }

    localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData))
    navigate(LOGIN_REDIRECT_PATH)
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
            Entre l'adresse, le slot et ton mot de passe si necessaire.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="address">Adresse</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Ex: ws://localhost:38281"
            autoComplete="url"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />

          <label htmlFor="slotName">Nom de slot</label>
          <input
            id="slotName"
            name="slotName"
            type="text"
            placeholder="Ex: Player1"
            value={slotName}
            onChange={(event) => setSlotName(event.target.value)}
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
