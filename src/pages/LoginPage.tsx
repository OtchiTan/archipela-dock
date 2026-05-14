import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosClient from '../hooks/AxiosClient'
import type { PlayerInfo } from '../types/socket.types'
import './LoginPage.css'

const EVENT_ID_STORAGE_KEY = 'archiEventId'
const LOGIN_REDIRECT_PATH = '/dashboard'

type HostEvent = {
  id: number
  name: string
  channelId: string
  messageId: string
  url: string | null
  startTime: string | null
  endTime: string | null
  clientConnected: boolean
  players: PlayerInfo[]
}

function LoginPage() {
  const navigate = useNavigate();
  const axios = useAxiosClient();

  const [events, setEvents] = useState<HostEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    axios
      .get<HostEvent[]>('/ap-events')
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const loadedEvents = response.data.filter((event) => event.endTime === null);
        setEvents(loadedEvents);

        const storedEventId = window.localStorage.getItem(EVENT_ID_STORAGE_KEY);
        const hasStoredEvent = storedEventId
          ? loadedEvents.some((event) => String(event.id) === storedEventId)
          : false;

        if (hasStoredEvent) {
          setSelectedEventId(storedEventId ?? '');
        } else if (loadedEvents.length > 0) {
          setSelectedEventId(String(loadedEvents[0].id));
        }

        setError(null);
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        if (requestError instanceof Error) {
          setError(requestError.message);
        } else {
          setError('Impossible de charger la liste des events.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [axios]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedEventId = Number(selectedEventId.trim());

    if (!Number.isFinite(parsedEventId) || parsedEventId <= 0) {
      return;
    }

    localStorage.setItem(EVENT_ID_STORAGE_KEY, String(parsedEventId));

    navigate(LOGIN_REDIRECT_PATH);
  };

  return (
    <main className="login-page">
      <img
        className="login-deco login-deco--left"
        src="/assets/images/cloud-0001.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="login-deco login-deco--top"
        src="/assets/images/cloud-0002.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="login-deco login-deco--right"
        src="/assets/images/cloud-0003.webp"
        alt=""
        aria-hidden="true"
      />

      <section className="login-card" aria-labelledby="login-title">
        <img
          className="login-card__brand"
          src="/assets/images/header-logo-full.svg"
          alt="Archipelago"
        />

        <header className="login-card__header">
          <h1 id="login-title">Choisir un event</h1>
          <p className="login-subtitle">
            Sélectionne l'event host à afficher sur le dashboard.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="eventId">Event</label>
          <select
            id="eventId"
            name="eventId"
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            disabled={loading || events.length === 0}
            required
          >
            <option value="" disabled>
              {loading ? 'Chargement des events...' : 'Sélectionner un event'}
            </option>
            {events.map((eventOption) => (
              <option key={eventOption.id} value={String(eventOption.id)}>
                {eventOption.name} #{eventOption.id}
              </option>
            ))}
          </select>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading || events.length === 0}>
            Ouvrir le dashboard
          </button>
        </form>
      </section>

      <img
        className="login-deco login-deco--island"
        src="/assets/images/island-a.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="login-deco login-deco--rock"
        src="/assets/images/rock-single.webp"
        alt=""
        aria-hidden="true"
      />
    </main>
  )
}

export default LoginPage
