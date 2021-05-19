import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuctionsSearch = (query, page, sortType, sortOrder, reset) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [auctions, setAuctions] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setAuctions([]);
    }, [query, sortType, sortOrder])

    useEffect(() => {
        setAuctions([]);
    }, [reset])

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;

        if (!!query && query.length >= 3) {
            axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/api/auction`,
                params: { query, page, size: 12, sortType, sortOrder},
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(res => {
                setAuctions(prev => {
                    return [...prev, ...res.data];
                });
                setHasMore(res.data.length === 12);
                setLoading(false);

            }).catch(e => {
                setError(true);
                setLoading(false);
                if (axios.isCancel(e)) {
                    return;
                }
            });

            return () => cancel();
        }
        return () => { };

    }, [query, page, sortType, sortOrder, reset]);

    return { loading, error, auctions, hasMore };
}

export default useAuctionsSearch;