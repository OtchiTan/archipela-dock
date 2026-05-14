import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import useAxiosClient from "../hooks/AxiosClient";
import WebSocketEvent from "../hooks/WebSocketEvent";
import type { DeathlinkEvent, DeathlinkEventInstance, Game } from "../types/socket.types";
import { DeathlinkAlert } from "../components/DeathlinkAlert";
import { DeathlinkLeaderboard } from "../components/DeathlinkLeaderboard";
import { LeaderboardChampionAlert } from "../components/LeaderboardChampionAlert";
import { getTopLeaderboardPlayer } from "../utils/deathlinkLeaderboard";
import { DEATHLINK_ALERT_DURATION_MS } from "../components/DeathlinkAlert";

const EVENT_ID_STORAGE_KEY = "archiEventId";

type ChampionAlertState = {
    newLeaderName: string;
    oldLeaderName: string;
    eventName: string;
    newLeaderDeathlink: number;
} | null;

function DashboardPage() {
    const axios = useAxiosClient();
    const [eventId] = useState<number | null>(() => {
        const storedEventId = window.localStorage.getItem(EVENT_ID_STORAGE_KEY);

        if (!storedEventId) {
            return null;
        }

        const parsedEventId = Number(storedEventId);

        return Number.isFinite(parsedEventId) && parsedEventId > 0 ? parsedEventId : null;
    });
    const socket = WebSocketEvent(eventId);
    const [lastDeathlinkEvent, setLastDeathlinkEvent] = useState<DeathlinkEvent | null>(null);
    const [lastDeathlinkInstance, setLastDeathlinkInstance] = useState<DeathlinkEventInstance | null>(null);
    const [lastGame, setLastGame] = useState<Game | null>(null);
    const [championAlert, setChampionAlert] = useState<ChampionAlertState>(null);
    const previousLeaderIdRef = useRef<number | null>(null);
    const previousLeaderNameRef = useRef<string | null>(null);
    const championAlertTimerRef = useRef<number | null>(null);

    const currentLeader = useMemo(() => getTopLeaderboardPlayer(lastDeathlinkEvent), [lastDeathlinkEvent]);

    useEffect(() => {
        if (eventId === null) {
            return;
        }

        let isMounted = true;

        axios
            .get<DeathlinkEvent>(`/ap-events/${eventId}/deathlinks`)
            .then((response) => {
                if (!isMounted) {
                    return;
                }

                setLastDeathlinkEvent(response.data);
            })
            .catch((requestError) => {
                if (!isMounted) {
                    return;
                }

                console.error("Impossible de charger le leaderboard initial", requestError);
            });

        return () => {
            isMounted = false;
        };
    }, [axios, eventId]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleConnect = () => {
            console.log('connecté');
        };

        const handleDeathlinkTop = (eventDeathlinks: DeathlinkEvent, deathlink: DeathlinkEventInstance, game: Game) => {
            console.log('mise à jour deathlink', eventDeathlinks, deathlink, game);
            setLastDeathlinkEvent(eventDeathlinks);
            setLastDeathlinkInstance(deathlink);
            setLastGame(game);
        };

        const handleDisconnect = () => {
            console.log('déconnecté');
        };

        socket.on('connect', handleConnect);
        socket.on('deathlink-top', handleDeathlinkTop);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('deathlink-top', handleDeathlinkTop);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket]);

    useEffect(() => {
        if (!lastDeathlinkEvent || !currentLeader) {
            return;
        }

        if (championAlertTimerRef.current) {
            window.clearTimeout(championAlertTimerRef.current);
            championAlertTimerRef.current = null;
        }

        const previousLeaderId = previousLeaderIdRef.current;
        const previousLeaderName = previousLeaderNameRef.current;

        const leaderChanged =
            previousLeaderId !== null && previousLeaderId !== currentLeader.playerId;

        previousLeaderIdRef.current = currentLeader.playerId;
        previousLeaderNameRef.current = currentLeader.playerName;

        if (!leaderChanged || !previousLeaderName) {
            return;
        }

        // Wait until the DeathlinkAlert finishes, plus a small gap
        championAlertTimerRef.current = window.setTimeout(() => {
            setChampionAlert({
                newLeaderName: currentLeader.playerName,
                oldLeaderName: previousLeaderName,
                eventName: lastDeathlinkEvent.eventName,
                newLeaderDeathlink: currentLeader.deathlink,
            });
        }, DEATHLINK_ALERT_DURATION_MS + 200);

        return () => {
            if (championAlertTimerRef.current) {
                window.clearTimeout(championAlertTimerRef.current);
                championAlertTimerRef.current = null;
            }
        };
    }, [currentLeader, lastDeathlinkEvent]);

    if (eventId === null) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <DeathlinkLeaderboard event={lastDeathlinkEvent} />
            {lastDeathlinkEvent && lastDeathlinkInstance && lastGame && (
                <DeathlinkAlert
                    key={`${lastDeathlinkEvent.eventId}-${lastDeathlinkInstance.id}-${lastGame.id}`}
                    event={lastDeathlinkEvent}
                    deathlink={lastDeathlinkInstance}
                    game={lastGame}
                />
            )}
            {championAlert && (
                <LeaderboardChampionAlert
                    key={`${lastDeathlinkEvent?.eventId ?? "no-event"}-${championAlert.newLeaderName}`}
                    alert={championAlert}
                    onComplete={() => setChampionAlert(null)}
                />
            )}
        </div>
    );
}

export default DashboardPage