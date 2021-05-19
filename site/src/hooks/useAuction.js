import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuction = (auctionId) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [auction, setAuction] = useState({});
        
    

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;

        if (!!auctionId && auctionId > 0) {
            axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/api/auction/${auctionId}`,
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(res => {
                setAuction(res.data);
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
            setAuction(null);
            setLoading(false);
        }
        return () => { };

    }, [auctionId]);

    return { loading, error, auction };
}

export default useAuction;