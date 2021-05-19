import { useEffect, useState } from 'react';
import axios from 'axios';

const useNotification = (auctionId, token, insert = true) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [notification, setNotification] = useState({});



    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;

        if (!!token && !!auctionId && auctionId > 0) {
            axios({
                method: insert ? 'POST' : 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/api/notification/${auctionId}/${token}`,
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(res => {
                setNotification(res.data);
                setLoading(false);
            }).catch(e => {
                setError(true);
                setLoading(false);
                if (axios.isCancel(e)) {
                    return;
                }
            });

            return () => cancel();
        } else {
            setNotification(null);
            setLoading(false);
        }
        return () => { };

    }, [auctionId, token, insert]);

    return { loading, error, notification };
}

export default useNotification;