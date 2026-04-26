import { useEffect, useState } from "react";
import AxiosClient from "../hooks/AxiosClient";

type Post = {
    id: number;
    title: string;
};

function TestPage() {
    const [data, setData] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const axios = AxiosClient();

    useEffect(() => {
        axios
            .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Erreur inconnue');
                }
                setLoading(false);
            });
    }, [axios]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {data.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default TestPage